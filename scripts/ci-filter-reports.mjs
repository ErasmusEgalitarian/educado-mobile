import fs from "node:fs";
import path from "node:path";

const [, , changedPath, eslintPath, tsDiagPath] = process.argv;

const root = path.resolve(process.cwd(), "..");
const appRoot = process.cwd();

const toRel = (p) => {
  if (!p) {
    return null;
  }

  const abs = path.isAbsolute(p) ? p : path.resolve(appRoot, p);

  return path.relative(root, abs).split(path.sep).join("/");
};

const changed = new Set(
  fs
    .readFileSync(changedPath, "utf8")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean),
);

let eslintErrs = [];

try {
  const eslintJson = JSON.parse(fs.readFileSync(eslintPath, "utf8"));

  for (const file of eslintJson) {
    const fileRel = toRel(file.filePath);

    for (const m of file.messages || []) {
      if (m.severity >= 2) {
        eslintErrs.push({ file: fileRel, rule: m.ruleId, message: m.message });
      }
    }
  }
} catch {
  // ignore
}

let tsErrs = [];

try {
  const tsJson = JSON.parse(fs.readFileSync(tsDiagPath, "utf8"));

  for (const d of tsJson) {
    if (d.category === "Error" && d.file) {
      tsErrs.push({ file: d.file, code: d.code, message: d.message });
    }
  }
} catch {
  // ignore
}

const eslintChanged = eslintErrs.filter((e) => changed.has(e.file));
const tscChanged = tsErrs.filter((e) => changed.has(e.file));

const summarize = (list, label) => {
  if (list.length) {
    console.error(`\n${label} errors in CHANGED files:\n`);

    for (const e of list.slice(0, 50)) {
      console.error(
        `- ${e.file}: ${e.rule ? e.rule : e.code} – ${e.message.replace(/\n/g, " ")}`,
      );
    }

    if (list.length > 50) {
      console.error(`... and ${list.length - 50} more`);
    }
  }
};

summarize(eslintChanged, "ESLint");
summarize(tscChanged, "TypeScript");

if (eslintChanged.length || tscChanged.length) {
  console.error("\nCI gate failed: changed files contain errors.\n");
  process.exit(1);
} else {
  console.log(
    "CI gate passed: errors exist only in untouched files (permissive mode).",
  );
}
