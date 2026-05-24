#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = path.join(REPO_ROOT, "nextarch-workspace");
const iteration = path.join(workspace, "iteration-1");
const evals = JSON.parse(
  fs.readFileSync(path.join(REPO_ROOT, "skills", "nextarch", "evals", "evals.json"), "utf8"),
);

fs.mkdirSync(workspace, { recursive: true });

for (const ev of evals.evals) {
  const dir = path.join(iteration, `eval-${ev.id - 1}`, "with_skill", "outputs");
  fs.mkdirSync(dir, { recursive: true });
  const readme = path.join(dir, "README.md");
  if (!fs.existsSync(readme)) {
    fs.writeFileSync(
      readme,
      `# Eval ${ev.id}\n\nSave agent response as \`response.md\`.\n\nPrompt:\n\n${ev.prompt}\n`,
    );
  }
}

const historyPath = path.join(workspace, "history.json");
if (!fs.existsSync(historyPath)) {
  const example = JSON.parse(
    fs.readFileSync(
      path.join(REPO_ROOT, "skills", "nextarch", "evals", "history.example.json"),
      "utf8",
    ),
  );
  example.started_at = new Date().toISOString();
  fs.writeFileSync(historyPath, `${JSON.stringify(example, null, 2)}\n`);
}

console.log(`Scaffolded ${iteration}`);
console.log(`Edit ${historyPath} after grading agent outputs.`);
