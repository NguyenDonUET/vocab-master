# Vocabulary Coach

A web app for English learners (A2–C2) to study vocabulary, phrasal verbs, fixed expressions, and collocations with flash cards. Progress is saved locally in the browser.

## Features

- Flash cards with expression on the front and meanings, IPA, and examples on the back
- Filter by CEFR level (A2, B1, B2, C1, C2)
- **Study** page (`/`) for focused flash-card practice
- **Dashboard** page (`/dashboard`) for progress stats
- Track learned cards with local progress persistence
- Keyboard shortcuts: `←` / `→` to navigate, `Space` to show or hide details

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Install and run

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── app/
│   ├── pages/        # Study and dashboard routes
│   ├── App.tsx       # Router setup
│   └── main.tsx
├── components/
│   ├── flashcard/    # Flash card UI
│   ├── filters/      # CEFR level filter
│   ├── progress/     # Progress panel
│   └── ui/           # shadcn/ui primitives
├── data/
│   └── vocabulary.json
├── hooks/            # Derived state hooks
├── lib/              # Utilities, deck logic, vocabulary loader
├── stores/           # Zustand stores
└── types/            # TypeScript types
```

## Adding vocabulary

Edit [`src/data/vocabulary.json`](src/data/vocabulary.json). Each entry must follow the schema below. The app validates data on load and throws in development if anything is invalid.

### Dataset wrapper

```json
{
  "version": 1,
  "items": [ /* entries */ ]
}
```

### Entry schema

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `id` | string | yes | Unique ID (e.g. `"v026"`) |
| `expression` | string | yes | The word or phrase shown on the card front |
| `category` | string | yes | Vocabulary type (see allowed values) |
| `partOfSpeech` | string | yes | Grammatical label shown on the card back |
| `level` | string | yes | CEFR level: `A2`, `B1`, `B2`, `C1`, or `C2` |
| `ipa` | string | yes | IPA pronunciation |
| `meaningEn` | string | yes | English definition |
| `meaningVi` | string | yes | Vietnamese translation |
| `examples` | string[3] | yes | Exactly three example sentences |

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
  "id": "v001",
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
  ]
}
```

### Authoring tips

- Write natural example sentences useful for speaking
- Mix daily life, workplace, and opinion-style examples
- Keep `id` values unique across the entire dataset
- Use `category` for the vocabulary type badge and `partOfSpeech` for the grammatical label on the back

## Design system

All UI follows [`.cursor/rules/ui-ux-standards.mdc`](.cursor/rules/ui-ux-standards.mdc). Tokens live in [`src/lib/design-system.ts`](src/lib/design-system.ts):

- **Spacing** — 8px grid: `space-y-6` (page), `space-y-4` (section), `gap-4`, `p-6`
- **Typography** — page titles `text-3xl`, sections `text-xl`, body `text-sm text-muted-foreground`
- **Controls** — uniform `h-9`, `rounded-md`, semantic colors only
- **Surfaces** — `rounded-xl border-border/60`, subtle `shadow-sm`, no decorative gradients

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Zustand (study state + persisted progress)
- JSON vocabulary data (no backend)

## Progress storage

Learned card IDs are stored in `localStorage` under the key `learn-vocab-progress`. Clearing browser storage resets progress.
