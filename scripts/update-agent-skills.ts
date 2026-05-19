import { spawnSync } from "node:child_process";
import { loadManifest, type Manifest } from "./lib.js";

type Command = {
  command: string;
  args: string[];
};

const manifest = loadManifest();

run({ command: "npx", args: ["skills", "update", "-g", "-y"] });

for (const command of wellKnownSkillUpdateCommands(manifest)) {
  run(command);
}

run({ command: "pnpm", args: ["run", "doctor"] });

function wellKnownSkillUpdateCommands(manifest: Manifest): Command[] {
  return Object.keys(manifest.external_sources)
    .filter((source) => source.includes(".") && !source.includes("/"))
    .sort()
    .map((source) => ({
      command: "npx",
      args: ["skills", "add", `https://${source}`, "-g", "-y"],
    }));
}

function run(command: Command): void {
  const printable = [command.command, ...command.args].join(" ");
  console.log(`$ ${printable}`);

  const result = spawnSync(command.command, command.args, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
