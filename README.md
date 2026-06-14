# Vocabulary Coach

A web app for English learners (A2–C2) to study vocabulary, phrasal verbs, fixed expressions, and collocations with flash cards. Vocabulary and progress are stored in MongoDB via Prisma.

## Features

- Flash cards with expression on the front and meanings, IPA, and examples on the back
- Filter by CEFR level (A2, B1, B2, C1, C2)
- **Study** page (`/`) for focused flash-card practice
- **Dashboard** page (`/dashboard`) for progress stats
- Track learned cards with per-device progress persistence
- Keyboard shortcuts: `←` / `→` to navigate, `Space` to show or hide details

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

### Database commands

| Command | Description |
| ------- | ----------- |
| `npm run db:push` | Sync Prisma schema to MongoDB |
| `npm run db:seed` | Import vocabulary from JSON files |
| `npm run db:studio` | Open Prisma Studio to browse data |

## Project structure

```
src/
├── app/
│   ├── actions/      # Server Actions (progress writes)
│   ├── layout.tsx    # Root layout and metadata
│   ├── page.tsx      # Study route (/) — server data fetch
│   └── dashboard/
│       └── page.tsx  # Dashboard route (/dashboard)
├── components/
│   ├── pages/        # Study and dashboard page components
│   ├── flashcard/    # Flash card UI
│   ├── filters/      # CEFR level filter
│   ├── progress/     # Progress panel and hydration
│   └── ui/           # shadcn/ui primitives
├── data/
│   └── levels/       # Vocabulary seed source (a2.json … c2.json)
├── hooks/            # Derived state hooks
├── lib/              # Prisma client, vocabulary, progress, device ID
├── stores/           # Zustand stores
└── types/            # TypeScript types
prisma/
├── schema.prisma     # MongoDB models
└── seed.ts           # JSON → MongoDB import script
```

## Adding vocabulary

Edit the level file for the CEFR band you are adding to, e.g. [`src/data/levels/b1.json`](src/data/levels/b1.json). Each file is a JSON array of entries without `id` fields — MongoDB generates ObjectIds on seed. The seed script merges all level files, validates the combined dataset, and upserts by `expression` + `level`.

After editing JSON files, re-run:

```bash
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
  { /* entry */ },
  { /* entry */ }
]
```

### Entry schema

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `expression` | string | yes | The word or phrase shown on the card front |
| `category` | string | yes | Vocabulary type (see allowed values) |
| `partOfSpeech` | string | yes | Grammatical label shown on the card back |
| `level` | string | yes | CEFR level: `A2`, `B1`, `B2`, `C1`, or `C2` |
| `ipa` | string | yes | IPA pronunciation |
| `meaningEn` | string | yes | English definition |
| `meaningVi` | string | yes | Vietnamese translation |
| `examples` | string[3] | yes | Exactly three example sentences |
| `conversation` | object | yes | Short chat-style Q&A using the expression |
| `conversation.question` | string | yes | A natural question in conversation |
| `conversation.answer` | string | yes | A natural reply (1–3 sentences) that uses the expression |

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
- Keep `expression` + `level` pairs unique across the entire dataset (MongoDB generates IDs)
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
- Prisma + MongoDB (vocabulary content and progress)

## Progress storage

Learned card IDs are stored in MongoDB per anonymous device. A `learn-vocab-device-id` cookie identifies each browser; clearing cookies creates a new identity with empty progress. No login is required.
