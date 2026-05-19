import { spawnSync } from "node:child_process";
import { loadManifest, type Manifest } from "./lib.js";

type Command = {
  command: string;
  args: string[];
};

const dryRun = process.argv.includes("--dry-run");
const manifest = loadManifest();

requireCommands(["node", "pnpm", "npx"]);

const commands = buildInstallCommands(manifest);

if (commands.length === 0) {
  console.log("No skills declared in agent-manifest.toml.");
  process.exit(0);
}

for (const item of commands) {
  const printable = [item.command, ...item.args].join(" ");
  if (dryRun) {
    console.log(printable);
    continue;
  }

  console.log(`$ ${printable}`);
  const result = spawnSync(item.command, item.args, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function requireCommand(command: string): void {
  const result = spawnSync("sh", ["-c", `command -v ${command}`], { stdio: "ignore" });
  if (result.status !== 0) {
    throw new Error(`Required command not found: ${command}`);
  }
}

function requireCommands(commands: string[]): void {
  for (const command of commands) {
    requireCommand(command);
  }
}

function buildInstallCommands(manifest: Manifest): Command[] {
  const commands: Command[] = [];

  for (const [source, config] of Object.entries(manifest.external_sources).sort()) {
    for (const skill of [...config.skills].sort()) {
      commands.push(createInstallCommand(source, skill));
    }
  }

  for (const skill of [...manifest.custom.skills].sort()) {
    commands.push(createInstallCommand("phildionne/agent-skills", skill));
  }

  return commands;
}

function createInstallCommand(source: string, skill: string): Command {
  return {
    command: "npx",
    args: ["skills", "add", source, "--skill", skill],
  };
}
