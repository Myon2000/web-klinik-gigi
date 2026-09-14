<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, load the antislop skill for the task:
- Core filter, always on: `antislop`
- UI / visual: `antislop-ui`
- Copy & text: `antislop-copywriting`
- People: `antislop-human`
- Mobile / responsive: `antislop-layoutmobile`
- Code comments: `antislop-code`
Before starting, ask the user when antislop applies: during the work, or after it is done.
<!-- antislop:end -->

## Project Agent Workflow Rules (Strict)
1. **Branch Isolation:** ALWAYS create and work inside a new dedicated branch (e.g. `feat/feature-name`, `fix/bug-name`, `refactor/scope`). NEVER commit or write code directly on `main`.
2. **Merge Confirmation:** NEVER merge any branch into `main` autonomously. Only merge when the user explicitly instructs to do so.
3. **Branch Retention:** NEVER delete local or remote branches after merging unless explicitly instructed. Keep all branch history intact for PKL documentation.
4. **Clean Code & Dead Code Hygiene:** Always detect and remove dead code, unused files, unused variables, and unused imports. Always verify that `npm run lint` and `npm run build` pass cleanly before completing tasks.
