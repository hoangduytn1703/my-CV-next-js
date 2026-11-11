/**
 * Admin authentication.
 *
 * config/admin.json holds { username, salt, hash } where hash = scrypt(password).
 * Because the repository is public, the whole record is additionally encrypted with
 * AES-256-GCM using ADMIN_SECRET (server-only env var) — without that secret the file
 * reveals nothing, not even the username.
 *
 * Sessions are stateless signed cookies (HMAC-SHA256 with ADMIN_SECRET). They embed a
 * fingerprint of the password hash, so changing the password logs out every session.
 */
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { readFile, StoreError, writeFile } from "lib/admin/store";

export const ADMIN_FILE = "config/admin.json";
const COOKIE = "cv_admin";
const SESSION_DAYS = 7;

export interface AdminRecord {
  username: string;
  salt: string;
  hash: string;
  updatedAt: string;
}

const secret = () => {
  const s = process.env.ADMIN_SECRET;
  if (!s || s.length < 32) throw new StoreError("Admin is not configured (ADMIN_SECRET is missing).", 503);

  return s;
};
const key = () => createHash("sha256").update(secret()).digest();

/* ---------------- password hashing ---------------- */

const scryptAsync = (password: string, salt: Buffer) =>
  new Promise<Buffer>((resolve, reject) =>
    scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 }, (err, out) => (err ? reject(err) : resolve(out)))
  );

export const hashPassword = async (password: string) => {
  const salt = randomBytes(16);

  return { salt: salt.toString("base64"), hash: (await scryptAsync(password, salt)).toString("base64") };
};

const verifyPassword = async (password: string, record: AdminRecord) => {
  const expected = Buffer.from(record.hash, "base64");
  const actual = await scryptAsync(password, Buffer.from(record.salt, "base64"));

  return actual.length === expected.length && timingSafeEqual(actual, expected);
};

/* ---------------- encrypted admin record ---------------- */

const encrypt = (data: object) => {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const body = Buffer.concat([cipher.update(JSON.stringify(data), "utf8"), cipher.final()]);

  return {
    v: 1,
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    data: body.toString("base64"),
  };
};

const decrypt = (payload: { iv: string; tag: string; data: string }): AdminRecord => {
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(payload.iv, "base64"));
  decipher.setAuthTag(Buffer.from(payload.tag, "base64"));
  const json = Buffer.concat([decipher.update(Buffer.from(payload.data, "base64")), decipher.final()]).toString("utf8");

  return JSON.parse(json);
};

export const readAdmin = async (): Promise<AdminRecord> => {
  const raw = await readFile(ADMIN_FILE);
  if (!raw) throw new StoreError("No admin account yet — run scripts/admin-set-password.mjs.", 503);
  try {
    return decrypt(JSON.parse(raw.toString("utf8")));
  } catch {
    throw new StoreError("Admin account file cannot be decrypted (wrong ADMIN_SECRET?).", 500);
  }
};

export const writeAdmin = async (record: AdminRecord, message: string) =>
  writeFile(ADMIN_FILE, `${JSON.stringify(encrypt(record), null, 2)}\n`, message);

/* ---------------- login throttling (per server instance) ---------------- */

const attempts = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_MS = 10 * 60 * 1000;

const clientIp = (req: NextApiRequest) =>
  String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown")
    .split(",")[0]
    .trim();

export const loginLockedFor = (req: NextApiRequest) => {
  const a = attempts.get(clientIp(req));

  return a && a.count >= MAX_ATTEMPTS && a.until > Date.now() ? Math.ceil((a.until - Date.now()) / 60000) : 0;
};

const recordFailure = (req: NextApiRequest) => {
  const ip = clientIp(req);
  const a = attempts.get(ip);
  const fresh = !a || a.until < Date.now();
  attempts.set(ip, { count: fresh ? 1 : a!.count + 1, until: Date.now() + LOCK_MS });
};

export const checkCredentials = async (req: NextApiRequest, username: string, password: string) => {
  const record = await readAdmin();
  const userOk = username.trim().toLowerCase() === record.username.toLowerCase();
  const passOk = await verifyPassword(password, record); // always run: no timing hint about the username
  if (userOk && passOk) {
    attempts.delete(clientIp(req));

    return record;
  }
  recordFailure(req);

  return null;
};

export const verifyCurrentPassword = (password: string, record: AdminRecord) => verifyPassword(password, record);

/* ---------------- session cookie ---------------- */

const fingerprint = (record: AdminRecord) => createHash("sha256").update(record.hash).digest("base64url").slice(0, 16);
const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

export const setSession = (res: NextApiResponse, record: AdminRecord) => {
  const payload = Buffer.from(
    JSON.stringify({ u: record.username, fp: fingerprint(record), exp: Date.now() + SESSION_DAYS * 864e5 })
  ).toString("base64url");
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE}=${payload}.${sign(payload)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_DAYS * 86400}${secure}`
  );
};

export const clearSession = (res: NextApiResponse) => {
  res.setHeader("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`);
};

/** Returns the admin record if the request carries a valid, current session. */
export const getSession = async (req: NextApiRequest) => {
  const token = req.cookies[COOKIE];
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      u: string;
      fp: string;
      exp: number;
    };
    if (data.exp < Date.now()) return null;
    const record = await readAdmin();
    if (data.u !== record.username || data.fp !== fingerprint(record)) return null;

    return record;
  } catch {
    return null;
  }
};
