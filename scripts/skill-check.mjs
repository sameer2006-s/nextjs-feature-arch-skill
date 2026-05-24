#!/usr/bin/env node
/**
 * Deterministic checks for the nextarch skill package.
 * Run: npm run skill:check
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILL_DIR = path.join(REPO_ROOT, "skills", "nextarch");
const SKILL_MD_MAX_LINES = 165;
const TRIGGER_EVAL_COUNT = 25;
const LAZY_DOC_EXCLUDE = new Set(["docs/README.md"]);

let failed = false;

function ok(msg) {
  console.log(`✓ ${msg}`);
}
function err(msg) {
  console.error(`✗ ${msg}`);
  failed = true;
}

function readText(p) {
  return fs.readFileSync(p, "utf8");
}
function readJson(p) {
  return JSON.parse(readText(p));
}

function parseFrontmatter(content) {
  if (!content.startsWith("---")) throw new Error("SKILL.md: missing YAML frontmatter");
  const end = content.indexOf("\n---", 3);
  if (end === -1) throw new Error("SKILL.md: unclosed frontmatter");
  const raw = content.slice(4, end).trim();
  const frontmatter = {};
  const nameMatch = raw.match(/^name:\s*([a-z0-9-]+)\s*$/m);
  if (nameMatch) frontmatter.name = nameMatch[1];
  if (raw.includes("description: >-")) {
    const descMatch = raw.match(/description:\s*>-\s*\n([\s\S]*?)(?=\n[a-zA-Z_-]+:|$)/);
    if (descMatch) {
      frontmatter.description = descMatch[1]
        .split("\n")
        .map((l) => l.replace(/^\s+/, ""))
        .join(" ")
        .trim();
    }
  } else {
    const descLine = raw.match(/^description:\s*(.+)$/m);
    if (descLine) frontmatter.description = descLine[1].trim();
  }
  return frontmatter;
}

function resolveSkillLink(fromRel, link) {
  return path.normalize(path.join(path.dirname(fromRel), link)).replace(/\\/g, "/");
}

function listMd(dir, base = dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listMd(full, base));
    else if (e.name.endsWith(".md")) out.push(path.relative(base, full).replace(/\\/g, "/"));
  }
  return out;
}

function walkMd(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkMd(p));
    else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

function checkPackage() {
  const skillMd = path.join(SKILL_DIR, "SKILL.md");
  const skillJsonPath = path.join(SKILL_DIR, "skill.json");

  if (!fs.existsSync(skillMd)) return err("SKILL.md not found");
  if (!fs.existsSync(skillJsonPath)) return err("skill.json not found");

  const skillJson = readJson(skillJsonPath);
  const content = readText(skillMd);
  let frontmatter;
  try {
    frontmatter = parseFrontmatter(content);
  } catch (e) {
    return err(e.message);
  }

  if (frontmatter.name !== "nextarch") err(`SKILL.md name must be "nextarch", got "${frontmatter.name ?? "(missing)"}"`);
  else ok('SKILL.md name is "nextarch"');

  if (skillJson.name !== "nextarch") err(`skill.json name must be "nextarch", got "${skillJson.name}"`);
  else ok('skill.json name is "nextarch"');

  const desc = frontmatter.description ?? "";
  if (desc.length < 20) err("SKILL.md description missing or too short");
  else if (desc.length > 1024) err(`SKILL.md description too long (${desc.length})`);
  else ok("SKILL.md description within length limit");

  if (/<|>/.test(desc)) err("SKILL.md description must not contain angle brackets");

  const lines = content.split("\n").length;
  if (lines > SKILL_MD_MAX_LINES) err(`SKILL.md has ${lines} lines (max ${SKILL_MD_MAX_LINES})`);
  else ok(`SKILL.md ${lines} lines ≤ ${SKILL_MD_MAX_LINES}`);

  if (skillJson.entry !== "SKILL.md") err(`skill.json entry must be SKILL.md`);
  else ok("skill.json entry is SKILL.md");

  const linkRe = /\]\(([^)]+)\)/g;
  const broken = [];
  let linkCount = 0;
  const mdFiles = ["SKILL.md", ...walkMd(SKILL_DIR).map((f) => path.relative(SKILL_DIR, f).replace(/\\/g, "/"))];
  for (const rel of mdFiles) {
    const text = readText(path.join(SKILL_DIR, rel));
    let m;
    while ((m = linkRe.exec(text)) !== null) {
      const target = m[1].split("#")[0].trim();
      if (!target || target.startsWith("http") || target.startsWith("#")) continue;
      linkCount++;
      const resolved = path.join(SKILL_DIR, resolveSkillLink(rel, target));
      if (!fs.existsSync(resolved)) broken.push(`${rel} → ${resolveSkillLink(rel, target)}`);
    }
  }
  if (broken.length) err(`Broken links:\n  ${broken.join("\n  ")}`);
  else ok(`${linkCount} internal links resolve`);

  const evalsPath = path.join(SKILL_DIR, "evals", "evals.json");
  if (!fs.existsSync(evalsPath)) err("evals/evals.json not found");
  else {
    const evals = readJson(evalsPath);
    if (evals.skill_name !== "nextarch") err(`evals.json skill_name must be nextarch`);
    else if (!Array.isArray(evals.evals) || evals.evals.length !== 4) err(`evals.json must have 4 evals`);
    else {
      for (const ev of evals.evals) {
        if (!ev.id || !ev.prompt || !ev.expectations?.length) {
          err(`eval ${ev.id}: missing id, prompt, or expectations`);
          break;
        }
      }
      if (!failed) ok("evals.json valid (4 evals)");
    }
  }
}

function checkLazyDocs() {
  const lazyDocs = readJson(path.join(SKILL_DIR, "skill.json")).lazyDocs ?? [];
  if (!lazyDocs.length) return err("skill.json lazyDocs is empty");

  for (const doc of lazyDocs) {
    if (!fs.existsSync(path.join(SKILL_DIR, doc))) return err(`lazyDocs missing: ${doc}`);
  }
  ok(`${lazyDocs.length} lazyDocs paths exist`);

  const mustList = [
    ...listMd(path.join(SKILL_DIR, "rules")).map((f) => `rules/${f}`),
    ...listMd(path.join(SKILL_DIR, "docs")).map((f) => `docs/${f}`),
  ].filter((f) => !LAZY_DOC_EXCLUDE.has(f));

  const lazySet = new Set(lazyDocs);
  const missing = mustList.filter((f) => !lazySet.has(f));
  if (missing.length) err(`Not in lazyDocs: ${missing.join(", ")}`);
  else ok("rules/ and docs/ synced with lazyDocs");
}

function checkVersion() {
  const version = readJson(path.join(SKILL_DIR, "skill.json")).version;
  if (!/^\d+\.\d+\.\d+$/.test(version ?? "")) return err(`Invalid semver: ${version}`);

  const match = readText(path.join(REPO_ROOT, "CHANGELOG.md")).match(/^## \[(\d+\.\d+\.\d+)\]/m);
  if (!match) return err("CHANGELOG: no version header");
  if (match[1] !== version) err(`Version mismatch: skill.json ${version}, CHANGELOG [${match[1]}]`);
  else ok(`version ${version} matches CHANGELOG`);
}

function checkTriggerEval() {
  const entries = readJson(path.join(SKILL_DIR, "evals", "trigger-eval.json"));
  if (!Array.isArray(entries)) return err("trigger-eval.json must be an array");
  if (entries.length !== TRIGGER_EVAL_COUNT) {
    return err(`trigger-eval.json: expected ${TRIGGER_EVAL_COUNT}, got ${entries.length}`);
  }

  let trueCount = 0;
  const seen = new Set();
  for (let i = 0; i < entries.length; i++) {
    const row = entries[i];
    if (typeof row.query !== "string" || !row.query.trim()) return err(`Entry ${i}: invalid query`);
    if (typeof row.should_trigger !== "boolean") return err(`Entry ${i}: should_trigger must be boolean`);
    const key = row.query.trim().toLowerCase();
    if (seen.has(key)) return err(`Entry ${i}: duplicate query`);
    seen.add(key);
    if (row.should_trigger) trueCount++;
  }

  const falseCount = entries.length - trueCount;
  if (trueCount < 4 || falseCount < 4) err(`Trigger balance too skewed: ${trueCount} true, ${falseCount} false`);
  else ok(`trigger-eval.json: ${entries.length} entries (${trueCount} true, ${falseCount} false)`);
}

console.log("nextarch skill:check\n");
checkPackage();
checkLazyDocs();
checkVersion();
checkTriggerEval();

if (failed) {
  console.error("\nskill:check failed");
  process.exit(1);
}
console.log("\nskill:check passed");
