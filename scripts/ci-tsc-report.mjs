import path from "node:path";
import ts from "typescript";

const cwd = process.cwd();

const configPath = ts.findConfigFile(cwd, ts.sys.fileExists, "tsconfig.json");

if (!configPath) {
  console.error("No tsconfig.json found");

  process.exit(0);
}

const config = ts.readConfigFile(configPath, ts.sys.readFile).config;
const parsed = ts.parseJsonConfigFileContent(
  config,
  ts.sys,
  path.dirname(configPath),
);

const program = ts.createProgram(parsed.fileNames, parsed.options);
const diagnostics = ts.getPreEmitDiagnostics(program);

const out = diagnostics.map((diagnostic) => {
  const file = diagnostic.file?.fileName
    ? path.relative(cwd, diagnostic.file.fileName)
    : null;

  const { line = 0, character = 0 } =
    diagnostic.file && diagnostic.start != null
      ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
      : {};

  return {
    file: file,
    line: line + 1,
    column: character + 1,
    code: diagnostic.code,
    category: ts.DiagnosticCategory[diagnostic.category],
    message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
  };
});

process.stdout.write(JSON.stringify(out, null, 2));
