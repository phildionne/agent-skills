#!/usr/bin/env python3

from __future__ import annotations

import argparse
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
SKILL_DIR = SCRIPT_DIR.parent
TEMPLATE_DIR = SKILL_DIR / "assets" / "templates"


def render_template(text: str, values: dict[str, str]) -> str:
    rendered = text
    for key, value in values.items():
        rendered = rendered.replace(f"{{{{{key}}}}}", value)
    return rendered


def read_template(name: str) -> str:
    return (TEMPLATE_DIR / name).read_text()


def write_file(path: Path, content: str, overwrite: bool) -> None:
    if path.exists() and not overwrite:
        raise FileExistsError(f"{path} already exists. Use --overwrite to replace it.")
    path.write_text(content)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Bootstrap prompt.md, plans.md, implement.md, and documentation.md.",
    )
    parser.add_argument("--output-dir", required=True, help="Target repo or project directory")
    parser.add_argument("--project-name", required=True, help="Project name for the templates")
    parser.add_argument("--objective", required=True, help="Primary deliverable or mission")
    parser.add_argument("--role", default="a senior engineer and technical lead")
    parser.add_argument(
        "--verification",
        action="append",
        default=[],
        help="Verification command. Repeat for multiple values.",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Replace existing files if they already exist.",
    )
    args = parser.parse_args()

    output_dir = Path(args.output_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    verification_lines = args.verification or [
        "- `npm run lint`",
        "- `npm run typecheck`",
        "- `npm run test`",
    ]
    verification_block = "\n".join(verification_lines)
    final_validation = ", ".join(command.strip("- ").strip("`") for command in verification_lines)

    values = {
        "PROJECT_NAME": args.project_name,
        "ROLE": args.role,
        "CORE_GOALS": f"- Deliver `{args.objective}`.\n- Keep the result production-grade and verifiable.",
        "HARD_REQUIREMENTS": "- Replace these bullets with project-specific constraints.\n- Add platform, runtime, dependency, or deployment limits here.",
        "DELIVERABLE": f"- {args.objective}",
        "PROJECT_SPEC": "- Replace this section with the concrete product or engineering spec.\n- Keep it specific enough that milestone planning is straightforward.",
        "VERIFICATION_COMMANDS": verification_block,
        "FINAL_VALIDATION": final_validation,
        "INITIAL_FILES": "- Add the initial scaffold files here.",
        "MILESTONE_01_VERIFY": verification_block,
        "CORE_FILES": "- Add the first real implementation files here.",
        "MILESTONE_02_VERIFY": verification_block,
    }

    outputs = {
        "prompt.md": render_template(read_template("prompt.md"), values),
        "plans.md": render_template(read_template("plans.md"), values),
        "implement.md": render_template(read_template("implement.md"), values),
        "documentation.md": render_template(read_template("documentation.md"), values),
    }

    for name, content in outputs.items():
        write_file(output_dir / name, content, args.overwrite)
        print(f"[OK] Wrote {output_dir / name}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
