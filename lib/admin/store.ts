/**
 * Where the admin panel reads and writes repository files.
 *
 * - Local / development: straight to the working tree (config/*.json, public/uploads/*).
 * - Production on Vercel (read-only filesystem): through the GitHub Contents API, so every
 *   save is a commit on the deployed branch and Vercel redeploys the site automatically.
 *   Needs a GITHUB_TOKEN with "Contents: read & write" on this repository.
 */
import { promises as fs } from "fs";
import path from "path";

const OWNER = process.env.VERCEL_GIT_REPO_OWNER || process.env.GITHUB_OWNER || "hoangduytn1703";
const REPO = process.env.VERCEL_GIT_REPO_SLUG || process.env.GITHUB_REPO || "my-CV-next-js";
const BRANCH = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || "main";

export type StoreMode = "local" | "github" | "readonly";

export const storeMode = (): StoreMode => {
  if (process.env.NODE_ENV !== "production") return "local";
  if (process.env.GITHUB_TOKEN) return "github";

  // Production without a token (e.g. `next start` on a machine with a writable disk).
  return process.env.VERCEL ? "readonly" : "local";
};

export class StoreError extends Error {
  constructor(message: string, public status = 500) {
    super(message);
  }
}

const github = async (url: string, init?: RequestInit) => {
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${url}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  return res;
};

const safePath = (file: string) => {
  const normalized = path.posix.normalize(file).replace(/^\/+/, "");
  if (normalized.startsWith("..") || !/^(config|public\/uploads)\//.test(normalized)) {
    throw new StoreError(`Refusing to touch ${file}`, 400);
  }

  return normalized;
};

/** Reads a repo file as a Buffer, or null if it does not exist. */
export const readFile = async (file: string): Promise<Buffer | null> => {
  const rel = safePath(file);
  if (storeMode() !== "github") {
    try {
      return await fs.readFile(path.join(process.cwd(), rel));
    } catch {
      return null;
    }
  }
  const res = await github(`${encodeURI(rel)}?ref=${encodeURIComponent(BRANCH)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new StoreError(`GitHub read failed (${res.status})`, 502);
  const data = (await res.json()) as { content?: string; download_url?: string };
  if (data.content) return Buffer.from(data.content, "base64");
  // Files over 1 MB come without inline content.
  if (data.download_url) return Buffer.from(await (await fetch(data.download_url)).arrayBuffer());

  return null;
};

/** Creates or overwrites a repo file (a commit in GitHub mode). */
export const writeFile = async (file: string, body: Buffer | string, message: string) => {
  const rel = safePath(file);
  const mode = storeMode();
  if (mode === "readonly") {
    throw new StoreError("Saving is not configured on this deployment (missing GITHUB_TOKEN).", 503);
  }
  const buffer = typeof body === "string" ? Buffer.from(body, "utf8") : body;
  if (mode === "local") {
    const abs = path.join(process.cwd(), rel);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.writeFile(abs, buffer);

    return;
  }
  // GitHub needs the current blob sha to overwrite an existing file.
  const head = await github(`${encodeURI(rel)}?ref=${encodeURIComponent(BRANCH)}`);
  const sha = head.ok ? ((await head.json()) as { sha?: string }).sha : undefined;
  const res = await github(encodeURI(rel), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: buffer.toString("base64"), branch: BRANCH, ...(sha ? { sha } : {}) }),
  });
  if (!res.ok) throw new StoreError(`GitHub write failed (${res.status})`, 502);
};
