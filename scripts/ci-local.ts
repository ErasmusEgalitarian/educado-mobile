import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const logDirectory = path.join(root, "var/log");

const filesChangedJson = path.join(root, "files-changed.json");
const eslintReportJson = path.join(root, "eslint-report.json");
const tscReportJson = path.join(root, "tsc-report.json");

const slug = (string: string) =>
  string
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const run = async (stepName: string, command: string) => {
  const logFilePath = path.join(logDirectory, `${slug(stepName)}.log`);

  const child = spawn(command, {
    shell: true,
    cwd: root,
    env: process.env,
  });

  let stdout = "";
  let stderr = "";

  child.stdout.on("data", (chunk: string) => (stdout += chunk));
  child.stderr.on("data", (chunk: string) => (stderr += chunk));

  const exitCode: number = await new Promise((resolve) => {
    child.on("close", resolve);
  });

  await fs.writeFile(logFilePath, stdout + stderr, "utf8");

  return { exitCode, stdout, stderr, logFilePath };
};

const detectChangedFiles = async (stepName: string) => {
  const diffFilter = "ACMRT";

  await run(stepName, "git fetch --no-tags --prune");

  const { stdout: base } = await run(
    stepName,
    "git merge-base HEAD origin/dev",
  );

  const { stdout: committed } = await run(
    stepName,
    `git diff --name-only --diff-filter=${diffFilter} ${base.trim()} HEAD`,
  );

  const { stdout: staged } = await run(
    stepName,
    `git diff --staged --name-only --diff-filter=${diffFilter}`,
  );

  // const modified = await run(`diff --name-only --diff-filter=${diffFilter}`);

  const files = new Set<string>();

  [committed, staged]
    .flatMap((string) => (string ? string.split(/\r?\n/) : []))
    .filter(Boolean)
    .forEach((file) => files.add(file));

  const filesChanged = Array.from(files.values()).sort();

  await fs.writeFile(
    filesChangedJson,
    JSON.stringify(filesChanged, null, 2),
    "utf8",
  );

  console.log(
    `\n\x1b[34mFiles changed (${String(filesChanged.length)}):\x1b[0m`,
  );

  filesChanged.forEach((file) => {
    console.log(`    ${file}`);
  });
};

const ensureLogDir = async () => {
  await fs.mkdir(logDirectory, { recursive: true });
};

const clearSummaryMd = async () => {
  await fs.writeFile(path.join(root, "summary.md"), "", "utf8");
};

const steps = [
  // { name: "Install Dependencies", cmd: "npm ci" },
  { name: "Check Dependencies", command: "npx expo install --check" },
  { name: "Run Expo Doctor", command: "npx expo-doctor" },
  { name: "Run Prettier", command: "npm run format:check" },
  { name: "Get Files Changed", function: detectChangedFiles },
  {
    name: "Run ESLint",
    command: "npm run lint:ci",
    continueOnError: true,
  },
  {
    name: "Run tsc",
    command: "npm run tsc:ci",
    continueOnError: true,
  },
  {
    name: "Report",
    command: `npm run ci:report "${filesChangedJson}" "${eslintReportJson}" "${tscReportJson}"`,
    continueOnError: true,
  },
  { name: "Run Tests", command: "npm run test:ci" },
];

(async () => {
  await ensureLogDir();
  await clearSummaryMd();

  let overallExitCode = 0;

  for (const step of steps) {
    const start = Date.now();

    process.stdout.write(`\x1b[33m${step.name} ...\x1b[0m `);

    if (step.function) {
      await step.function(step.name);

      const duration = ((Date.now() - start) / 1000).toFixed(1);

      console.log(`\x1b[32mdone (${duration}s)\x1b[0m`);

      continue;
    }

    const { exitCode } = await run(step.name, step.command);

    const duration = ((Date.now() - start) / 1000).toFixed(1);

    if (exitCode !== 0) {
      console.error(`\x1b[31mfailed (${duration}s)\x1b[0m`);

      if (step.continueOnError) {
        overallExitCode = overallExitCode || exitCode;

        continue;
      }

      process.exit(exitCode);
    }

    console.log(`\x1b[32mdone (${duration}s)\x1b[0m`);
  }

  if (overallExitCode !== 0) {
    console.error(
      "\n\x1b[31mSome steps reported non-zero exit codes (continued on error). See `var/log/`, `summary.md` and JSON reports for details.\x1b[0m",
    );
  }

  process.exit(overallExitCode);
})().catch((error: unknown) => {
  console.error(error);

  process.exit(1);
});
