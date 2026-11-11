import { getSession } from "lib/admin/auth";
import { StoreError } from "lib/admin/store";
import type { NextApiRequest, NextApiResponse } from "next";

type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

/** Wraps an admin API route: method check, JSON-only bodies (CSRF), errors → JSON. */
export const adminRoute =
  (methods: string[], handler: Handler, { auth = true } = {}): Handler =>
  async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    if (!methods.includes(req.method || "")) {
      res.setHeader("Allow", methods);
      res.status(405).json({ message: "Method not allowed" });

      return;
    }
    if (req.method !== "GET" && !String(req.headers["content-type"] || "").includes("application/json")) {
      res.status(415).json({ message: "Expected JSON" });

      return;
    }
    try {
      if (auth && !(await getSession(req))) {
        res.status(401).json({ message: "Please sign in again." });

        return;
      }
      await handler(req, res);
    } catch (err) {
      const status = err instanceof StoreError ? err.status : 500;
      res.status(status).json({ message: err instanceof Error ? err.message : "Unexpected error" });
    }
  };
