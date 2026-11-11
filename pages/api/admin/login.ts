import { adminRoute } from "lib/admin/api";
import { checkCredentials, loginLockedFor, setSession } from "lib/admin/auth";

export default adminRoute(
  ["POST"],
  async (req, res) => {
    const locked = loginLockedFor(req);
    if (locked) {
      res.status(429).json({ message: `Too many attempts. Try again in ${locked} minute(s).` });

      return;
    }
    const { username, password } = req.body ?? {};
    if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
      res.status(400).json({ message: "Enter your username and password." });

      return;
    }
    const record = await checkCredentials(req, username, password);
    if (!record) {
      await new Promise((r) => setTimeout(r, 400)); // slow down guessing
      res.status(401).json({ message: "Wrong username or password." });

      return;
    }
    setSession(res, record);
    res.status(200).json({ username: record.username });
  },
  { auth: false }
);
