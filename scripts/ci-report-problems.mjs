import fs from "node:fs";
import path from "node:path";

const [, , filesChangedJsonPath, eslintReportJsonPath, tscReportJsonPath] =
  process.argv;

const appRoot = process.cwd();
const gitHubStepSummaryPath = process.env.GITHUB_STEP_SUMMARY;
const gitHubServerUrl = process.env.GITHUB_SERVER_URL;
const gitHubRepository = process.env.GITHUB_REPOSITORY;
const gitHubSha = process.env.GITHUB_SHA;

const filesChanged = new Set(
  JSON.parse(fs.readFileSync(filesChangedJsonPath, "utf8")),
);

console.log("::group::Files changed");
filesChanged.forEach((file) => console.log(file));
console.log("::endgroup::");

const convertToRelativePath = (absolutePath) => {
  if (!absolutePath) {
    return null;
  }

  const abs = path.isAbsolute(absolutePath)
    ? absolutePath
    : path.resolve(appRoot, absolutePath);

  return path.relative(appRoot, abs).split(path.sep).join("/");
};

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
        code: problem.ruleId,
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

const eslintProblemsChanged = allEslintProblems.filter((problem) =>
  filesChanged.has(problem.file),
);

const tscProblemsChanged = allTscProblems.filter((problem) =>
  filesChanged.has(problem.file),
);

const escapeMarkdown = (s = "") =>
  String(s).replace(/\|/g, "\\|").replace(/\r?\n/g, " ").replace(/\s\s+/g, " ");

const buildTable = (headers, rows) => {
  const header = `| ${headers.join(" | ")} |`;
  const separator = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${row.map(escapeMarkdown).join(" | ")} |`);

  return [header, separator, ...body].join("\n");
};

const linkToFile = (relativeFilePath, line) =>
  `${gitHubServerUrl}/${gitHubRepository}/blob/${gitHubSha}/${relativeFilePath}${line ? `#L${line}` : ""}`;

const lines = [];
const push = (line) => lines.push(line);

const buildSection = (title, problems) => {
  push(`\n## ${title}\n`);

  if (!problems.length) {
    push("No problems found.");

    return;
  }

  const rows = problems.map((problem) => {
    const relativeFilePath = problem.file;
    const url = linkToFile(relativeFilePath, problem.line);

    return [
      `[${relativeFilePath}](${url})`,
      problem.line,
      problem.code,
      problem.message,
    ];
  });

  push(buildTable(["File", "Line", "Code", "Message"], rows));
};

const filesChangedDetailsSummary = () => {
  push("\n<details><summary>Files changed</summary>\n");

  for (const file of filesChanged) {
    const url = linkToFile(file);

    push(`- [${file}](${url})`);
  }

  push("\n</details>\n");
};

push("# ESLint/tsc Report 🚀\n");
push("## Stats\n");
push("### Files Changed\n");
push(`- Files changed: ${filesChanged.size}`);
push(`- ESLint problems: ${eslintProblemsChanged.length}`);
push(`- tsc problems: ${tscProblemsChanged.length}`);
filesChangedDetailsSummary();
push("### All Files\n");
push(`- ESLint problems: ${allEslintProblems.length}`);
push(`- tsc problems: ${allTscProblems.length}`);

buildSection("ESLint", eslintProblemsChanged);
buildSection("tsc", tscProblemsChanged);

const summary = lines.join("\n");

fs.appendFileSync(gitHubStepSummaryPath, `${summary}\n`, "utf8");

if (eslintProblemsChanged.length || tscProblemsChanged.length) {
  console.log("::error::CI failed: Changed files contain problems.");

  process.exit(1);
}

console.log("CI passed: Problems exist only in untouched files.");
