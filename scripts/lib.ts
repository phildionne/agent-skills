import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { parse } from "smol-toml";

export type ExternalSourceConfig = {
  skills: string[];
};

export type CodexMcpServerConfig = {
  enabled?: boolean;
  kind?: string;
  auth?: string;
};

export type CodexPluginConfig = {
  enabled?: boolean;
};

export type CodexConfig = {
  mcp_servers: Record<string, CodexMcpServerConfig>;
  plugins: Record<string, CodexPluginConfig>;
};

export type Manifest = {
  custom: {
    skills: string[];
  };
  external_sources: Record<string, ExternalSourceConfig>;
  codex: CodexConfig;
};

export type SkillLock = {
  skills: Record<string, { source?: string }>;
};

export function repoRoot(): string {
  return process.cwd();
}

export function homePath(...parts: string[]): string {
  return join(process.env.HOME || homedir(), ...parts);
}

export function readTomlFile(path: string): unknown {
  return parse(readFileSync(path, "utf8"));
}

export function readJsonFile<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

export function loadManifest(path = "agent-manifest.toml"): Manifest {
  const raw = readTomlFile(path);
  assertRecord(raw, "manifest");

  const manifest = raw as Partial<Manifest>;
  if (!manifest.custom || !Array.isArray(manifest.custom.skills)) {
    throw new Error("agent-manifest.toml must define [custom] skills = []");
  }
  if (!manifest.external_sources || typeof manifest.external_sources !== "object") {
    throw new Error("agent-manifest.toml must define [external_sources.<source>] tables");
  }
  for (const [source, config] of Object.entries(manifest.external_sources)) {
    assertRecord(config, `external source ${source}`);
    if (!Array.isArray(config.skills) || config.skills.length === 0) {
      throw new Error(`external source ${source} must define a non-empty skills array`);
    }
  }

  if (manifest.codex !== undefined) {
    assertRecord(manifest.codex, "manifest codex");
    if (manifest.codex.mcp_servers !== undefined) {
      assertRecord(manifest.codex.mcp_servers, "manifest codex.mcp_servers");
    }
    if (manifest.codex.plugins !== undefined) {
      assertRecord(manifest.codex.plugins, "manifest codex.plugins");
    }
  }

  manifest.codex = {
    ...defaultCodexConfig(),
    ...manifest.codex,
    mcp_servers: manifest.codex?.mcp_servers ?? {},
    plugins: manifest.codex?.plugins ?? {},
  };

  return manifest as Manifest;
}

export function loadSkillLock(path = homePath(".agents", ".skill-lock.json")): SkillLock {
  if (!existsSync(path)) {
    return { skills: {} };
  }
  const lock = readJsonFile<Partial<SkillLock>>(path);
  return { skills: lock.skills ?? {} };
}

export function expectedExternalSkills(manifest: Manifest): Map<string, string> {
  const skills = new Map<string, string>();
  for (const [source, config] of Object.entries(manifest.external_sources)) {
    for (const skill of config.skills) {
      const existing = skills.get(skill);
      if (existing) {
        throw new Error(`skill ${skill} is declared by both ${existing} and ${source}`);
      }
      skills.set(skill, source);
    }
  }
  return skills;
}

export function assertRecord(value: unknown, name: string): asserts value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${name} must be an object`);
  }
}

function defaultCodexConfig(): CodexConfig {
  return {
    mcp_servers: {},
    plugins: {},
  };
}
