import { adminRoute } from "lib/admin/api";
import { clearSession } from "lib/admin/auth";

export default adminRoute(
  ["POST"],
  async (_req, res) => {
    clearSession(res);
    res.status(200).json({ ok: true });
  },
  { auth: false }
);
