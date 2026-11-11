import { adminRoute } from "lib/admin/api";
import { getSession, hashPassword, setSession, verifyCurrentPassword, writeAdmin } from "lib/admin/auth";

export default adminRoute(["POST"], async (req, res) => {
  const record = await getSession(req);
  const { currentPassword, newPassword, username } = req.body ?? {};
  if (!record) return;
  if (typeof currentPassword !== "string" || !(await verifyCurrentPassword(currentPassword, record))) {
    res.status(400).json({ message: "Current password is incorrect." });

    return;
  }
  if (typeof newPassword !== "string" || newPassword.length < 8) {
    res.status(400).json({ message: "New password must be at least 8 characters." });

    return;
  }
  const nextUsername = typeof username === "string" && username.trim() ? username.trim() : record.username;
  const next = { username: nextUsername, ...(await hashPassword(newPassword)), updatedAt: new Date().toISOString() };
  await writeAdmin(next, "chore(admin): update admin credentials");
  // Other sessions are now invalid; keep this one signed in.
  setSession(res, next);
  res.status(200).json({ username: next.username });
});
