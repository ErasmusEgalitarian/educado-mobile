import path from "node:path";
import ts from "typescript";

const cwd = process.cwd();

const configPath = ts.findConfigFile(cwd, ts.sys.fileExists, "tsconfig.json");

if (!configPath) {
  console.error("No tsconfig.json found");
  process.exit(0);
}

const cfg = ts.readConfigFile(configPath, ts.sys.readFile).config;
const parsed = ts.parseJsonConfigFileContent(
  cfg,
  ts.sys,
  path.dirname(configPath),
);

const program = ts.createProgram(parsed.fileNames, parsed.options);
const diagnostics = ts.getPreEmitDiagnostics(program);

const out = diagnostics.map((d) => {
  const f = d.file?.fileName ? path.relative(cwd, d.file.fileName) : null;

  const { line = 0, character = 0 } =
    d.file && d.start != null
      ? d.file.getLineAndCharacterOfPosition(d.start)
      : {};

  return {
    file: f,
    line: line + 1,
    column: character + 1,
    code: d.code,
    category: ts.DiagnosticCategory[d.category],
    message: ts.flattenDiagnosticMessageText(d.messageText, "\n"),
  };
});

process.stdout.write(JSON.stringify(out, null, 2));
