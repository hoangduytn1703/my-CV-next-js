import { adminRoute } from "lib/admin/api";
import { storeMode, writeFile } from "lib/admin/store";

// Base64 inflates ~33%, so this allows files up to ~3 MB.
export const config = { api: { bodyParser: { sizeLimit: "4.2mb" } } };

const TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
};
const MAX_BYTES = 3 * 1024 * 1024;

/** Saves an uploaded image/PDF under public/uploads and returns its public path. */
export default adminRoute(["POST"], async (req, res) => {
  const { name, type, data } = req.body ?? {};
  const ext = TYPES[type];
  if (!ext || typeof data !== "string") {
    res.status(400).json({ message: "Only PNG, JPG, WEBP, GIF images or PDF files are allowed." });

    return;
  }
  const buffer = Buffer.from(data, "base64");
  if (buffer.length > MAX_BYTES) {
    res.status(413).json({ message: "File is larger than 3 MB." });

    return;
  }
  const base =
    String(name || "file")
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "file";
  const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const file = `public/uploads/${stamp}-${base}.${ext}`;
  await writeFile(file, buffer, `chore(content): upload ${base}.${ext} via admin panel`);
  res.status(200).json({ path: file.replace(/^public/, ""), mode: storeMode() });
});
