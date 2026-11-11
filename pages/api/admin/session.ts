import { adminRoute } from "lib/admin/api";
import { getSession } from "lib/admin/auth";
import { storeMode } from "lib/admin/store";

/** Who is signed in, and how saving works on this deployment. */
export default adminRoute(
  ["GET"],
  async (req, res) => {
    const record = await getSession(req);
    res.status(200).json({ username: record?.username ?? null, mode: storeMode() });
  },
  { auth: false }
);
