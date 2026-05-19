import { existsSync } from "node:fs";
import { join } from "node:path";
import { assertRecord, loadManifest, loadSkillLock, expectedExternalSkills, homePath, readTomlFile } from "./lib.js";

type Finding = {
  level: "ok" | "warn" | "error";
  message: string;
};

type CodexConfig = {
  mcp_servers?: Record<string, { enabled?: boolean; command?: string; url?: string }>;
  plugins?: Record<string, { enabled?: boolean }>;
};

const manifest = loadManifest();
const lock = loadSkillLock();
const findings: Finding[] = [];

checkExternalSkills();
checkCustomSkills();
checkCodexConfig();
printFindings();

const hasErrors = findings.some((finding) => finding.level === "error");
process.exit(hasErrors ? 1 : 0);

function checkExternalSkills(): void {
  const expected = expectedExternalSkills(manifest);
  const lockedNames = new Set(Object.keys(lock.skills));

  for (const [skill, source] of [...expected.entries()].sort()) {
    const locked = lock.skills[skill];
    if (!locked) {
      findings.push({ level: "error", message: `missing locked skill ${skill} from ${source}` });
      continue;
    }
    if (locked.source !== source) {
      findings.push({
        level: "error",
        message: `skill ${skill} source mismatch: expected ${source}, found ${locked.source ?? "unknown"}`,
      });
      continue;
    }

    const skillDir = homePath(".agents", "skills", skill);
    if (existsSync(join(skillDir, "SKILL.md"))) {
      findings.push({ level: "ok", message: `skill ${skill} locked and present` });
    } else {
      findings.push({ level: "warn", message: `skill ${skill} locked from ${source}, but no ~/.agents/skills directory was found` });
    }
  }

  for (const skill of [...lockedNames].sort()) {
    if (!expected.has(skill)) {
      findings.push({ level: "warn", message: `extra locked skill not in manifest: ${skill}` });
    }
  }
}

function checkCustomSkills(): void {
  if (manifest.custom.skills.length === 0) {
    findings.push({ level: "ok", message: "no custom skills declared" });
    return;
  }

  for (const skill of [...manifest.custom.skills].sort()) {
    const path = join("skills", skill, "SKILL.md");
    if (existsSync(path)) {
      findings.push({ level: "ok", message: `custom skill source present: ${skill}` });
    } else {
      findings.push({ level: "error", message: `custom skill source missing: ${path}` });
    }
  }
}

function checkCodexConfig(): void {
  const codexConfigPath = homePath(".codex", "config.toml");
  if (!existsSync(codexConfigPath)) {
    findings.push({ level: "error", message: "missing ~/.codex/config.toml" });
    return;
  }

  const codexConfig = loadCodexConfig(codexConfigPath);
  const actualMcp = codexConfig.mcp_servers ?? {};
  const actualPlugins = codexConfig.plugins ?? {};

  for (const [name, expected] of Object.entries(manifest.codex.mcp_servers).sort()) {
    const actual = actualMcp[name];
    if (!actual) {
      findings.push({ level: "error", message: `missing Codex MCP server: ${name}` });
      continue;
    }

    const actualEnabled = actual.enabled ?? true;
    if (expected.enabled !== undefined && actualEnabled !== expected.enabled) {
      findings.push({
        level: "error",
        message: `Codex MCP ${name} enabled mismatch: expected ${expected.enabled}, found ${actualEnabled}`,
      });
      continue;
    }

    const actualKind = actual.url ? "url" : "command";
    if (expected.kind && actualKind !== expected.kind) {
      findings.push({
        level: "error",
        message: `Codex MCP ${name} kind mismatch: expected ${expected.kind}, found ${actualKind}`,
      });
      continue;
    }

    findings.push({ level: "ok", message: `Codex MCP configured: ${name}` });
  }

  for (const [name, expected] of Object.entries(manifest.codex.plugins).sort()) {
    const actual = actualPlugins[name];
    if (!actual) {
      findings.push({ level: "error", message: `missing Codex plugin: ${name}` });
      continue;
    }

    if (expected.enabled !== undefined && actual.enabled !== expected.enabled) {
      findings.push({
        level: "error",
        message: `Codex plugin ${name} enabled mismatch: expected ${expected.enabled}, found ${actual.enabled}`,
      });
      continue;
    }

    findings.push({ level: "ok", message: `Codex plugin configured: ${name}` });
  }
}

function loadCodexConfig(path: string): CodexConfig {
  const raw = readTomlFile(path);
  assertRecord(raw, "Codex config");

  if (raw.mcp_servers !== undefined) {
    assertRecord(raw.mcp_servers, "Codex config mcp_servers");
  }
  if (raw.plugins !== undefined) {
    assertRecord(raw.plugins, "Codex config plugins");
  }

  return raw as CodexConfig;
}

function printFindings(): void {
  for (const group of ["error", "warn", "ok"] as const) {
    const groupFindings = findings.filter((finding) => finding.level === group);
    if (groupFindings.length === 0) {
      continue;
    }

    console.log(`\n${group.toUpperCase()}`);
    for (const finding of groupFindings) {
      console.log(`- ${finding.message}`);
    }
  }
}
