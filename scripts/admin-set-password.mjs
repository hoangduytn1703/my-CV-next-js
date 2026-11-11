#!/usr/bin/env node
/**
 * Creates or resets the admin account in config/admin.json (encrypted, safe to commit).
 * Use it for the first setup or if the password is forgotten.
 *
 *   ADMIN_USER=myname ADMIN_PASS='new password' node --env-file=.env.local scripts/admin-set-password.mjs
 *
 * ADMIN_SECRET must be the same value as on Vercel, otherwise production cannot decrypt the file.
 * Must stay in sync with lib/admin/auth.ts (scrypt N=16384,r=8,p=1 / AES-256-GCM).
 */
import { createCipheriv, createHash, randomBytes, scryptSync } from "crypto";
import { writeFileSync } from "fs";

const { ADMIN_SECRET, ADMIN_USER, ADMIN_PASS } = process.env;
if (!ADMIN_SECRET || ADMIN_SECRET.length < 32) {
  console.error("ADMIN_SECRET (32+ chars) is required — put it in .env.local.");
  process.exit(1);
}
if (!ADMIN_USER || !ADMIN_PASS || ADMIN_PASS.length < 8) {
  console.error("Set ADMIN_USER and ADMIN_PASS (8+ chars).");
  process.exit(1);
}

const salt = randomBytes(16);
const record = {
  username: ADMIN_USER.trim(),
  salt: salt.toString("base64"),
  hash: scryptSync(ADMIN_PASS, salt, 64, { N: 16384, r: 8, p: 1 }).toString("base64"),
  updatedAt: new Date().toISOString(),
};

const key = createHash("sha256").update(ADMIN_SECRET).digest();
const iv = randomBytes(12);
const cipher = createCipheriv("aes-256-gcm", key, iv);
const data = Buffer.concat([cipher.update(JSON.stringify(record), "utf8"), cipher.final()]);
const out = {
  v: 1,
  iv: iv.toString("base64"),
  tag: cipher.getAuthTag().toString("base64"),
  data: data.toString("base64"),
};

writeFileSync(new URL("../config/admin.json", import.meta.url), `${JSON.stringify(out, null, 2)}\n`);
console.log(`Admin account "${record.username}" written to config/admin.json`);
