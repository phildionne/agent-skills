Now implement the project end to end.

Non-negotiable constraint

- Do not stop after a milestone to ask for confirmation when the scope is already clear.
- Proceed through `plans.md` until the project is complete and validated.

Execution rules (follow strictly)

- Treat `plans.md` as the source of truth. If anything becomes ambiguous, make a reasonable decision and record it there before or alongside coding.
- Implement deliberately with small, reviewable changes.
- After every milestone:
  - run the milestone verification commands
  - fix failures immediately
  - add or update tests for the milestone's core behavior
  - update `plans.md` and `documentation.md` to match reality
- If a bug is discovered:
  - write a failing test first when practical
  - fix the bug
  - confirm the test passes
  - record the decision or fix note in `plans.md`

Completion criteria

- All planned milestones that matter for the deliverable are complete or explicitly descoped with rationale.
- The validation checklist passes.
- `documentation.md` is accurate.
- The shipped result matches the deliverable in `prompt.md`.
