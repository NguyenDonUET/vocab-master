# Vocabulary Coach

A web app for English learners (A2–C2) to study vocabulary, phrasal verbs, fixed expressions, and collocations with flash cards and multiple-choice tests. Vocabulary and progress are stored in MongoDB via Prisma.

## Features

- Flash cards with expression on the front and meanings, IPA, and examples on the back
- Filter by CEFR level (A2, B1, B2, C1, C2)
- **Study** page (`/`) for focused flash-card practice
- **Dashboard** page (`/dashboard`) for progress stats
- **Vocabulary test** pages (`/test`, `/test/[level]`) for multiple-choice practice by CEFR level
- Track learned cards with per-device progress persistence
- Track completed test parts with version-aware checkmarks (survives retries; invalidates on test regen)
- Mark wrong test answers as unlearned so they reappear in study decks
- Keyboard shortcuts: `←` / `→` to navigate study cards, `Space` to show or hide details; `A`–`D` / `1`–`4` and `Enter` during tests

## Getting started

### Prerequisites

- Node.js 20.9+
- npm
- MongoDB (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Install and run

```bash
npm install
cp .env.example .env
```

Set `DATABASE_URL` in `.env` to your MongoDB connection string:

```bash
# Local
DATABASE_URL="mongodb://localhost:27017/learn-vocab"

# Atlas
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/learn-vocab?retryWrites=true&w=majority"
```

Push the schema and seed vocabulary data:

```bash
npm run db:push
npm run db:seed
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:3000`).

### Build for production

```bash
npm run build
npm run start
```

### Code quality and formatting

The project uses Prettier for formatting, ESLint for logic and React rules, and Husky + lint-staged for pre-commit checks.

| Command                | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `npm run lint`         | Run ESLint                                      |
| `npm run format`       | Format all source files with Prettier           |
| `npm run format:check` | Check formatting without writing (useful in CI) |

**Pre-commit hook** (`.husky/pre-commit`):

1. `lint-staged` — runs Prettier on staged `*.{js,jsx,ts,tsx,json,css,md}` files
2. `npm run build` — full Next.js production build must pass

Config files:

| File               | Purpose                                               |
| ------------------ | ----------------------------------------------------- |
| `.prettierrc`      | Shared format style (single quotes, no semicolons, …) |
| `.prettierignore`  | Skips build output, lock files, `node_modules`, etc.  |
| `.editorconfig`    | Editor defaults (2 spaces, LF, UTF-8)                 |
| `eslint.config.js` | ESLint flat config; `eslint-config-prettier` last     |

### Database commands

| Command                 | Description                                                    |
| ----------------------- | -------------------------------------------------------------- |
| `npm run db:push`       | Sync Prisma schema to MongoDB                                  |
| `npm run db:seed`       | Import vocabulary from JSON files                              |
| `npm run db:studio`     | Open Prisma Studio to browse data                              |
| `npm run vocab:check`   | Validate all level JSON files and detect duplicate expressions |
| `npm run vocab:index`   | Regenerate `src/data/expressions-index.json` from level files  |
| `npm run test:generate` | Generate multiple-choice tests for B1 and B2 (or one level)    |

## Vocabulary tests

Multiple-choice tests use example sentences from the vocabulary database. Each level test is split into **parts of up to 20 questions**; part count grows automatically when vocabulary grows (e.g. 120 words → 6 parts).

### Routes

| Route           | Description                                |
| --------------- | ------------------------------------------ |
| `/test`         | Choose a CEFR level (B1, B2)               |
| `/test/[level]` | Choose a part, answer questions, see score |

Supported test levels: **B1**, **B2** (see `AVAILABLE_TEST_LEVELS` in `src/types/vocabulary-test.ts`).

### Generate tests

After seeding or updating vocabulary for a level, regenerate its test:

```bash
# Both B1 and B2
npm run test:generate

# Single level
npm run test:generate B1
npm run test:generate B2
```

This builds one question per vocabulary entry (ordered by expression), writes to the `VocabularyTest` collection, and **bumps `testVersion`** for that level.

### Test progress and checkmarks

Best scores are stored per device in the `TestProgress` model (same anonymous cookie as learned cards).

**Rules:**

- Finishing a part saves your **best** correct count for that part at the current `testVersion` (retries only update if the new score is higher).
- A **part** shows a green checkmark only when the best score is **100%** (`bestCorrect === totalQuestions`).
- Attempts below 100% show **Best: 16/20 correct** on the part card with a subtle muted background.
- A **level** is complete when every part is at 100% at the **current** `testVersion`.
- **Regenerating** a test bumps `testVersion`; old scores no longer match and progress resets for that level until parts are retried.

**UI:**

- Green checkmark + green border on mastered part cards on `/test/[level]`
- Muted background + best score text on attempted but not mastered parts
- Green checkmark on a level card on `/test` when all parts are at 100%
- Partial level text, e.g. `2/5 parts at 100%` or `In progress`

**Wrong answers:** after an incorrect choice, a **Mark as unlearned** button removes that vocabulary item from the learned list (same as undo on flash cards), so it appears again when filtering for unlearned cards on Study.

### Updating vocabulary and tests (recommended workflow)

When you add or change vocabulary for a level that has tests:

```bash
npm run vocab:check
npm run db:seed
npm run test:generate B1   # repeat for each affected level
```

Users who had completed parts under an old test version will need to redo those parts for the new version — this keeps checkmarks aligned with current question content.

## Project structure

```
src/
├── app/
│   ├── actions/      # Server Actions (progress, test progress)
│   ├── layout.tsx    # Root layout and metadata
│   ├── page.tsx      # Study route (/) — server data fetch
│   ├── dashboard/
│   │   └── page.tsx  # Dashboard route (/dashboard)
│   └── test/
│       ├── page.tsx           # Test level picker (/test)
│       └── [level]/page.tsx   # Test parts and questions (/test/b1, …)
├── components/
│   ├── pages/        # Study, dashboard, and test page components
│   ├── flashcard/    # Flash card UI
│   ├── test/         # Test-specific UI (e.g. Mark as unlearned)
│   ├── filters/      # CEFR level filter
│   ├── progress/     # Progress hydration (learned + test progress)
│   └── ui/           # shadcn/ui primitives
├── data/
│   └── levels/       # Vocabulary seed source (a2.json … c2.json)
├── hooks/            # Derived state and keyboard shortcuts
├── lib/              # Prisma client, vocabulary, progress, test-progress, device ID
├── stores/           # Zustand stores (study, learned progress, test progress)
└── types/            # TypeScript types
prisma/
├── schema.prisma     # MongoDB models
└── seed.ts           # JSON → MongoDB import script
.husky/
└── pre-commit        # lint-staged + build before commit
```

## Adding vocabulary

Edit the level file for the CEFR band you are adding to, e.g. [`src/data/levels/b1.json`](src/data/levels/b1.json). Each file is a JSON array of entries without `id` fields — MongoDB generates ObjectIds on seed. The seed script merges all level files, validates the combined dataset, and upserts by `expression` + `level`.

Each `expression` must be unique across all level files (case-insensitive). Before seeding:

```bash
npm run vocab:check
npm run vocab:index   # optional: refresh src/data/expressions-index.json
npm run db:seed
```

### Level files

```
src/data/levels/
├── a2.json
├── b1.json
├── b2.json
├── c1.json
└── c2.json
```

Each file contains an array of entries for that level:

```json
[
  {
    /* entry */
  },
  {
    /* entry */
  }
]
```

### Entry schema

| Field                   | Type      | Required | Description                                              |
| ----------------------- | --------- | -------- | -------------------------------------------------------- |
| `expression`            | string    | yes      | The word or phrase shown on the card front               |
| `category`              | string    | yes      | Vocabulary type (see allowed values)                     |
| `partOfSpeech`          | string    | yes      | Grammatical label shown on the card back                 |
| `level`                 | string    | yes      | CEFR level: `A2`, `B1`, `B2`, `C1`, or `C2`              |
| `ipa`                   | string    | yes      | IPA pronunciation                                        |
| `meaningEn`             | string    | yes      | English definition                                       |
| `meaningVi`             | string    | yes      | Vietnamese translation                                   |
| `examples`              | string[3] | yes      | Exactly three example sentences                          |
| `conversation`          | object    | yes      | Short chat-style Q&A using the expression                |
| `conversation.question` | string    | yes      | A natural question in conversation                       |
| `conversation.answer`   | string    | yes      | A natural reply (1–3 sentences) that uses the expression |

### Allowed values

**`category`** (shown on card front):

- `word`
- `phrasal-verb`
- `fixed-expression`
- `collocation`

**`partOfSpeech`** (shown on card back):

- `noun`, `verb`, `adjective`, `adverb`
- `phrasal-verb`, `expression`, `collocation`

**`level`**: `A2`, `B1`, `B2`, `C1`, `C2` (A1 is not supported)

### Example entry

```json
{
  "expression": "take responsibility",
  "category": "fixed-expression",
  "partOfSpeech": "expression",
  "level": "B1",
  "ipa": "/teɪk rɪˌspɒnsəˈbɪləti/",
  "meaningEn": "to accept that you are accountable for something",
  "meaningVi": "chịu trách nhiệm",
  "examples": [
    "You should take responsibility for your mistakes.",
    "As a team lead, she takes responsibility for the project's success.",
    "I think everyone should take responsibility for their own learning."
  ],
  "conversation": {
    "question": "Who should fix this mistake?",
    "answer": "I think everyone should take responsibility for their own learning."
  }
}
```

### Authoring tips

- Write natural example sentences useful for speaking
- Mix daily life, workplace, and opinion-style examples
- Keep each `expression` unique across the entire dataset (see `npm run vocab:check`)
- Use `category` for the vocabulary type badge and `partOfSpeech` for the grammatical label on the back

## Design system

All UI follows [`.cursor/rules/ui-ux-standards.mdc`](.cursor/rules/ui-ux-standards.mdc). Tokens live in [`src/lib/design-system.ts`](src/lib/design-system.ts):

- **Spacing** — 8px grid: `space-y-6` (page), `space-y-4` (section), `gap-4`, `p-6`
- **Typography** — page titles `text-3xl`, sections `text-xl`, body `text-sm text-muted-foreground`
- **Controls** — uniform `h-9`, `rounded-md`, semantic colors only
- **Surfaces** — `rounded-xl border-border/60`, subtle `shadow-sm`, no decorative gradients

## Tech stack

- Next.js 16 (App Router) + React + TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (study state + optimistic progress UI)
- Prisma + MongoDB (vocabulary content, learned progress, test progress)
- Prettier + ESLint + Husky + lint-staged (formatting and pre-commit checks)

## Progress storage

Progress is stored in MongoDB per anonymous device. A `learn-vocab-device-id` cookie identifies each browser; clearing cookies creates a new identity with empty progress. No login is required.

### Learned cards (`UserProgress`)

- **Model:** `UserProgress`
- **Field:** `learnedIds` — array of vocabulary entry ObjectIds
- **Used on:** Study (`/`), Dashboard, test wrong-answer “Mark as unlearned”
- **Client store:** `useProgressStore` + `ProgressHydrator`

### Test completion (`TestProgress`)

- **Model:** `TestProgress`
- **Field:** `completedParts` — array of `{ key, testVersion, bestCorrect, totalQuestions }`
  - `key` format: `"B1:1"`, `"B2:3"` (level + part number)
  - `testVersion` must match `VocabularyTest.testVersion` for scores to display
  - Checkmark shown only when `bestCorrect === totalQuestions`
- **Used on:** `/test`, `/test/[level]`
- **Client store:** `useTestProgressStore` + `TestProgressHydrator`
- **Server helpers:** `src/lib/test-progress.ts`, `src/app/actions/test-progress.ts`

### Test content (`VocabularyTest`)

- **Model:** `VocabularyTest` (one document per CEFR level)
- **Fields:** `questions`, `testVersion` (incremented on each `npm run test:generate` for that level)
- **Helpers:** `src/lib/vocabulary-test.ts`, `getTestParts()` in `src/types/vocabulary-test.ts`

When `testVersion` changes, scores tied to an older version are ignored in the UI until the user retries those parts under the new version.
