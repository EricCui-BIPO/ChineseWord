# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A themed Chinese character learning application featuring Elsa/Frozen-inspired UI design. Helps children learn and memorize Chinese characters through interactive flashcards with three learning modes: study, test, and review.

## Development Commands

### Setup
```bash
npm install           # Install dependencies
npm run type-check    # Run TypeScript type checking without emitting
```

### Development
```bash
npm run dev           # Start dev server (http://localhost:3000)
```

### Build & Deploy
```bash
npm run build         # Build for production (Vue TSC type check + Vite build)
npm run preview       # Preview production build locally
```

## Architecture

### Tech Stack
- **Framework**: Vue 3 with TypeScript + Composition API
- **Build Tool**: Vite
- **State Management**: Pinia (lightweight, Vue 3 native)
- **Routing**: Vue Router 4
- **Styling**: Tailwind CSS with custom theme
- **Data Format**: JSON-based (no backend required)

### Key Architectural Patterns

1. **Data Management**
   - Local storage for all user progress (via `useStorage` composable)
   - Pinia stores (`progressStore.ts`, `idiomProgressStore.ts`) for reactive state
   - Immutable JSON data files (`words.json`, `idioms.json`)

2. **Composition Organization**
   - Composables (`useWordData.ts`, `useIdiomData.ts`, `useStorage.ts`) for shared logic
   - Type definitions in `types/` directory (word.ts, idiom.ts)
   - Components for UI rendering, stores for state

3. **Feature Structure**
   - Dual-feature app: Words module and Idioms module (separate stores, data, views)
   - Home pages route to feature selection
   - Feature-specific views: StudyMode, TestMode, ReviewMode

### Data Flow

```
Data Files (words.json, idioms.json)
    ↓
useWordData/useIdiomData (composables)
    ↓
Pinia Store (progressStore/idiomProgressStore)
    ↓
useStorage (localStorage persistence)
    ↓
Vue Components (StudyMode, TestMode, ReviewMode)
```

### Core Stores

**progressStore.ts** (Words learning progress)
- Methods: `markLearned()`, `markMastered()`, `incrementReview()`, `setDifficulty()`, `getReviewWords()`
- Stores: `progressMap` (Record of wordId → Progress), `stats` (computed)
- Review logic: Words marked for review if not mastered OR reviewed < 3 times

**idiomProgressStore.ts** (Similar structure for idioms)

## Data Models

### Word Type (types/word.ts)
```typescript
interface Word {
  id: string              // Unique identifier (word-001)
  character: string       // Chinese character
  pinyin: string         // Pinyin with tone marks
  meaning: string        // Definition
  words?: string[]       // Example phrases
  category?: string      // Grade level (e.g., "一年级")
  difficulty?: number    // Difficulty 1-5
}

interface Progress {
  wordId: string
  learned: boolean       // User marked as learned
  mastered: boolean      // User marked as mastered
  reviewed: number       // Number of reviews
  lastReview?: number    // Timestamp
  difficulty?: number    // User's difficulty rating
}
```

Similar structures exist for idioms in types/idiom.ts.

## Component Organization

### Word Learning Components
- `WordCard.vue`: Flip card animation (front: character, back: pinyin/meaning)
- `StudyMode.vue`: Sequential browsing with next/previous navigation
- `TestMode.vue`: Random word selection with answer reveal
- `ReviewMode.vue`: Auto-filtered words needing review

### Idiom Learning Components
- `IdiomCard.vue`: Similar card structure for idioms
- `IdiomStudyMode.vue`, `IdiomTestMode.vue`, `IdiomReviewMode.vue`: Parallel feature set

### Routing
- Root `/`: Home component selection (words or idioms)
- `/word`: WordHome (feature selection)
- `/words/study`, `/words/test`, `/words/review`: Word modes
- `/idiom`, `/idioms/study`, `/idioms/test`, `/idioms/review`: Idiom modes

## Adding Data

### Extend Character/Idiom Data
Edit `src/data/words.json` or `src/data/idioms.json` directly. Follow existing structure with unique IDs.

See `HOW_TO_EXTEND_WORDS.md` and `WORDS_EXTENSION_GUIDE.md` for guidance on bulk data generation (3000+ characters).

### Key Considerations
- Keep JSON well-formed (test parsing after edits)
- Assign consistent difficulty levels and categories
- Include pinyin with proper tone marks

## Styling & Theme

- **Framework**: Tailwind CSS (configured in `tailwind.config.js`)
- **Theme Colors**: Elsa/Frozen inspired (ice blue, light purple, silver)
- **Animations**: Card flip effects, defined in `src/styles/main.css`
- **Responsive**: Mobile-first approach with Tailwind breakpoints

## Storage

- **Persistence**: localStorage (via `useStorage` composable)
- **Keys**: `word-progress`, `idiom-progress` for progress tracking
- **Data Sync**: Automatic sync on store changes (reactive refs)
- **Clearing**: Users can clear progress via browser devtools or future UI feature

## Testing & Validation

- **Type Checking**: Run `npm run type-check` before commits
- **Build Validation**: `npm run build` must succeed before deployment
- **Manual Testing**: Test all three modes (study/test/review) with different data

## Common Development Tasks

1. **Add a new learning mode variant**:
   - Copy one of the existing mode files (StudyMode.vue)
   - Update router config in `src/router/index.ts`

2. **Modify card appearance**:
   - Edit `WordCard.vue` or `IdiomCard.vue` component
   - Adjust Tailwind classes in template and animation in styles

3. **Change review algorithm**:
   - Update `getReviewWords()` logic in the corresponding progress store

4. **Add new progress metric**:
   - Extend Progress interface in types/
   - Add getter/setter method in progress store
   - Update composables that read the data

## Known Patterns

- **Computed Stats**: `stats` computed property aggregates progress metrics
- **ID Generation**: IDs follow pattern `word-####` or `idiom-####`
- **Mode Navigation**: Each mode (study/test/review) manages its own navigation state
- **Progress Initialization**: Progress objects are created on-demand with default values

## Performance Considerations

- Data files are loaded once at app startup
- Pinia stores use reactive refs for optimal Vue 3 reactivity
- localStorage reads/writes are debounced via ref watchers
- No pagination needed yet (small dataset), but consider if data grows beyond 5000 items