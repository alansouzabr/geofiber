import fs from "fs";
import path from "path";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node tools/writefile.mjs <file>");
  process.exit(1);
}

const chunks = [];
process.stdin.setEncoding("utf8");
process.stdin.on("data", (d) => chunks.push(d));
process.stdin.on("end", () => {
  const content = chunks.join("");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
  console.log("WROTE", file, "bytes:", content.length);
});
