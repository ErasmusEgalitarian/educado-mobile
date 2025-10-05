import fs from "node:fs";
import path from "node:path";

const [, , filesChangedJsonPath, eslintReportJsonPath, tscReportJsonPath] =
  process.argv;

const appRoot = process.cwd();

const convertToRelativePath = (absolutePath) => {
  if (!absolutePath) {
    return null;
  }

  const abs = path.isAbsolute(absolutePath)
    ? absolutePath
    : path.resolve(appRoot, absolutePath);

  return path.relative(appRoot, abs).split(path.sep).join("/");
};

const changedFiles = new Set(
  JSON.parse(fs.readFileSync(filesChangedJsonPath, "utf8")),
);

let allEslintProblems = [];

try {
  const eslintReportJson = JSON.parse(
    fs.readFileSync(eslintReportJsonPath, "utf8"),
  );

  for (const file of eslintReportJson) {
    const relativeFilePath = convertToRelativePath(file.filePath);

    for (const problem of file.messages || []) {
      allEslintProblems.push({
        file: relativeFilePath,
        line: problem.line,
        rule: problem.ruleId,
        message: problem.message,
      });
    }
  }
} catch {
  // ignore
}

let allTscProblems = [];

try {
  const tscReportJson = JSON.parse(fs.readFileSync(tscReportJsonPath, "utf8"));

  for (const problem of tscReportJson) {
    allTscProblems.push({
      file: problem.file,
      line: problem.line,
      code: problem.code,
      message: problem.message,
    });
  }
} catch {
  // ignore
}

const eslintProblemsChanged = allEslintProblems.filter((e) =>
  changedFiles.has(e.file),
);

const tscProblemsChanged = allTscProblems.filter((e) =>
  changedFiles.has(e.file),
);

const summarize = (list, label) => {
  if (list.length) {
    console.error(`\n${label} found problems in CHANGED files:\n`);

    for (const problem of list) {
      console.error(
        `${problem.file}: Line ${problem.line} - ${problem.rule ? problem.rule : problem.code} – ${problem.message.replace(/\n/g, " ")}`,
      );
    }
  }
};

summarize(eslintProblemsChanged, "ESLint");
summarize(tscProblemsChanged, "tsc");

if (eslintProblemsChanged.length || tscProblemsChanged.length) {
  console.error("\nCI failed: Changed files contain errors.\n");

  process.exit(1);
}

console.log("CI Passed: errors exist only in untouched files.");
