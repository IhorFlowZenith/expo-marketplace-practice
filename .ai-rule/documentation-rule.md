# Documentation Rule — Expo Marketplace Practice

## Context
This project uses a structured README.md as the primary documentation for a mentor
who reads it before reviewing code. The mentor has limited time, so every milestone
must be scannable in under 30 seconds and justify every non-obvious decision.

---

## When to apply
Apply this rule whenever the user asks to:
- Document a new feature / milestone
- Update the README changelog
- Write a commit message

---

## Milestone structure (strict order)

```markdown
### 🟢 [DD.MM.YYYY] Feature Name · Feature Name · Feature Name

**Що зроблено:** One sentence. What was built, not how.

---

#### Рішення та обґрунтування

**🔤 Decision Title**
- **Проблема:** Why the previous approach didn't work (if replacing something).
- **Рішення:** What was chosen instead.
- **Чому саме так:** The reason — library trade-offs, architecture benefit, perf gain.
- **Компроміс:** Known limitation or future fix (if any).

*(Repeat block for each non-trivial decision)*

---

#### Змінені файли

| # | File | What changed |
|---|------|--------------|
| 🆕 | `path/file.tsx` | Short description |
| 🔄 | `path/file.tsx` | Short description |
| ❌ | `path/file.tsx` | Removed — reason |

#### Заплановано
- [ ] Known limitation to fix later
- [ ] Planned feature or improvement
```

---

## Rules

### What to document
- Every decision that isn't the obvious default → must have "Чому саме так"
- Every replaced library or pattern → must have "Проблема" before "Рішення"
- Every known limitation → goes to "Заплановано", never buried in prose
- Interface/type changes → show as a before/after code diff

### How to format
- Use ASCII diagrams for screen layouts — never describe layout in prose only
- Use tables for file lists — never plain bullet lists
- Use `Компроміс` when a decision has a known downside — hiding trade-offs is worse than admitting them
- Keep "Що зроблено" to one sentence — details belong in subsections

### Tone
- Ukrainian language for all documentation
- No filler phrases ("було реалізовано", "виконано впровадження") — state facts directly
- "Замінено X на Y — причина" is better than "використано Y для підвищення продуктивності"

### Milestone status icons
- 🟢 — Latest commit (only one at a time)
- 🔴 — Previous milestones
- When adding a new milestone: change previous 🟢 to 🔴

### What NOT to document
- Self-evident changes (adding a font file, updating .gitignore)
- Placeholder screens with no logic — list in files table, no explanation needed
- Internal refactors with no user-facing or architecture impact — one line in files table is enough

---

## Commit message format

```
type(scope): short description

- bullet: what and why (not just what)
- bullet: non-obvious decision or trade-off
```

**Types:** `feat` · `fix` · `refactor` · `chore` · `docs`  
**Scopes:** `home` · `auth` · `navigation` · `ui` · `product-details` · `firebase` · `validation`  
**Rules:**
- Subject line: max 72 chars, imperative mood, English
- Body bullets: only for non-obvious changes — skip if self-explanatory
- One commit per milestone

### Example
```
feat(product-details): add image gallery, zoom modal, size selector

- replace reanimated-carousel with flash-list: eliminates gesture conflicts in nested ScrollView
- use View + manual insets.top instead of SafeAreaView inside Modal: fixes close button positioning
- extend ProductItem with images[] field, keep image for backward compat
```
