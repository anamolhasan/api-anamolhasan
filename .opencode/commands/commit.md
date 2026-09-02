---
description: Review staged changes and create a clean conventional commit.
---

You are helping create a Git commit. Follow these steps exactly:

1. Run `git status` to see which files are modified, added, deleted, or untracked.

2. Run `git diff` (and `git diff --cached` if anything is already staged) to inspect the actual changes.

3. Review every changed file carefully. Understand what the changes do before staging anything.

4. Never modify any source code to create a commit. Work only with the existing changes.

5. Never stage or commit files that match any of these patterns:
   - `.env`, `.env.*`, `.env.local`, `.env.production`
   - Any file containing secrets, API keys, passwords, tokens, or credentials
   - `node_modules/`, `dist/`, `build/`, `.next/`, `.vercel/`
   - `.clerk/` or any directory containing sensitive configuration
   - Lock files unless the dependency change is intentional

6. Never include unrelated changes in a single commit. If changes span multiple concerns, commit only the files related to one concern and let the user run the command again for the rest.

7. Stage only the relevant files using `git add`.

8. Generate a Conventional Commit message based on the actual diff:
   - `feat:` for new features or functionality
   - `fix:` for bug fixes
   - `refactor:` for code restructuring without behavior change
   - `chore:` for tooling, config, dependencies, or maintenance
   - `docs:` for documentation only
   - `style:` for formatting or whitespace changes
   - `test:` for adding or updating tests
   - Use a clear, concise subject line (under 72 characters)
   - Write the body in imperative mood explaining *what* and *why*, not *how*

9. Create the commit with `git commit -m "<message>"`.

10. After committing, run `git status` and `git log --oneline -5` so the user can confirm the result.

11. Do NOT run `git push`.
12. Do NOT create or switch branches.
13. Do NOT amend any existing commit.
