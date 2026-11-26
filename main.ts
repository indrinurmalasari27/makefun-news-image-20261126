// News image entry for 26 November 2026: write the front page we drew for
// Thursday 26 November 2026 to /output/entry.png.
// Node 22, standard library only. The program copies the image byte for byte;
// it never draws, fetches or transforms anything, so both grader runs write
// exactly the same bytes.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const src = join(here, "entry.png");
const dst = join(outDir, "entry.png");

const bytes = readFileSync(src);

// Guard the gate before writing: a JPEG (FFD8) or PNG (89504E47) magic,
// and at most 1 MiB, the competition's limits for entry.png.
const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8;
const isPng =
  bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
if (!isJpeg && !isPng) {
  throw new Error("news image: entry.png is neither JPEG nor PNG");
}
if (bytes.length > 1048576) {
  throw new Error(`news image: entry.png is ${bytes.length} bytes, over the 1 MiB cap`);
}
mkdirSync(outDir, { recursive: true });
writeFileSync(dst, bytes);

const written = readFileSync(dst);
const digest = (b: Buffer) => createHash("sha256").update(b).digest("hex");
if (digest(bytes) !== digest(written)) {
  throw new Error("news image: output does not match entry.png");
}
console.log(
  `news image: wrote entry.png (${written.length} bytes, sha256 ${digest(written).slice(0, 12)}…)`,
);
