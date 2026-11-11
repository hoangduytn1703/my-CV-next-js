import { adminRoute } from "lib/admin/api";
import { readFile, storeMode, writeFile } from "lib/admin/store";
import { validateContent } from "lib/admin/validate";

const FILE = "config/content.json";

export const config = { api: { bodyParser: { sizeLimit: "512kb" } } };

export default adminRoute(["GET", "PUT"], async (req, res) => {
  if (req.method === "GET") {
    // Read from the store (not the bundle) so the editor always sees the latest saved version.
    const raw = await readFile(FILE);
    if (!raw) {
      res.status(404).json({ message: "config/content.json not found" });

      return;
    }
    res.status(200).json({ content: JSON.parse(raw.toString("utf8")), mode: storeMode() });

    return;
  }

  const content = validateContent(req.body?.content);
  await writeFile(
    FILE,
    `${JSON.stringify(content, null, 2)}\n`,
    "chore(content): update website content via admin panel"
  );
  res.status(200).json({ content, mode: storeMode() });
});
