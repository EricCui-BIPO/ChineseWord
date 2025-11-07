# System Architecture Document
## ChineseWord - Development Process Standardization Initiative

**Document Status:** Draft
**Project:** ChineseWord
**Version:** 1.0
**Date Generated:** 2025-11-07
**Architect:** Winston (System Architect)

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architectural Principles](#architectural-principles)
3. [High-Level Architecture](#high-level-architecture)
4. [Module Architecture](#module-architecture)
5. [Data Architecture](#data-architecture)
6. [Component Architecture](#component-architecture)
7. [State Management](#state-management)
8. [API & Integration Points](#api--integration-points)
9. [Performance Architecture](#performance-architecture)
10. [Deployment & DevOps](#deployment--devops)
11. [Technical Decisions & Rationale](#technical-decisions--rationale)
12. [Migration Path](#migration-path)

---

## Executive Summary

### Architectural Goal

Transform ChineseWord from an organically-grown codebase into a **modular, standardized, scalable platform** where:
- Games are **completely isolated** modules (no cross-game state)
- New games can be added in **days, not weeks**
- Shared logic is **reusable across modules**
- Architecture is **self-documenting and clear**
- Quality is **consistent across all modules**

### Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Module Isolation** | Complete isolation | Prevents bugs, enables parallel development |
| **State Management** | Separate Pinia store per module | Clear boundaries, easy to reason about |
| **Component Sharing** | Shared component library + isolated game components | Reuse UI, isolate game-specific logic |
| **Data Persistence** | localStorage with composable abstraction | Works offline, abstracted for future migration |
| **Performance Strategy** | Balanced approach (load time + FPS + bundle size) | No single metric dominates, holistic optimization |
| **Code Organization** | Feature-based modular structure | Organized by domain, not by function |

### Architecture Philosophy

**"Boring technology, exceptional experience"**

- Use proven technologies (Vue 3, Pinia, Tailwind)
- Make boring decisions to avoid complexity
- Invest innovation in UX, not architecture
- Design for developer productivity
- Optimize for team understanding over technical cleverness

---

## Architectural Principles

### 1. **Module Isolation Principle**

Each game/learning module is completely isolated:
- ✅ Own Pinia store (separate state namespace)
- ✅ Own component directory
- ✅ Own hooks/composables (if any game-specific)
- ✅ Cannot directly access other module's state
- ❌ No cross-module store mutations
- ❌ No shared module-level state outside core

**Exception:** Core platform services (theme, storage, router) are shared and accessed through standard composables.

### 2. **Clear Boundaries Principle**

Explicit interfaces between modules:
- Each module exports a clear contract
- Modules interact through defined service layer
- No hidden dependencies or side effects
- Easy to trace data flow

### 3. **Reusability First Principle**

- **Tier 1 (Atomic):** Maximum reuse, zero game logic
- **Tier 2 (Composite):** Reuse within games and learning
- **Tier 3 (Game-Specific):** Isolated, not shared

Only promote components to shared when 2+ modules need them.

### 4. **Developer Experience Principle**

New developer should understand:
- Where to create new game module (✅ Clear directory)
- How to connect state to UI (✅ Store + component pattern)
- How to reuse components (✅ Component library guide)
- How to test their module (✅ Testing patterns documented)

**Within 4 hours** of reading docs.

### 5. **Scalability Through Simplicity Principle**

- ✅ Avoid premature optimization
- ✅ Keep components small and focused
- ✅ Make it easy to split components later
- ✅ Write code a junior dev can understand

Complexity comes later, only when needed.

---

## High-Level Architecture

### System Context Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  ChineseWord Application                │
│                  (Vue 3 + Pinia + Vue Router)            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Learning   │  │   Learning   │  │    Games     │   │
│  │    Words     │  │    Idioms    │  │   (3 Games)  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│         △                  △                 △           │
│         │                  │                 │           │
│         └──────────────────┴─────────────────┘           │
│                        │                                 │
│        ┌───────────────┴───────────────┐                 │
│        │   Shared Core Services        │                 │
│        ├───────────────────────────────┤                 │
│        │ • Theme System                │                 │
│        │ • Component Library           │                 │
│        │ • Storage Abstraction         │                 │
│        │ • Router Service              │                 │
│        │ • Analytics Hooks             │                 │
│        └───────────────────────────────┘                 │
│                        │                                 │
│        ┌───────────────┴───────────────┐                 │
│        │   Foundation Layer            │                 │
│        ├───────────────────────────────┤                 │
│        │ • Browser Storage             │                 │
│        │ • Browser APIs                │                 │
│        │ • DOM / Vue                   │                 │
│        └───────────────────────────────┘                 │
└─────────────────────────────────────────────────────────┘
```

### Module Isolation Strategy

```
┌─────────────────────────────────────────┐
│         Shared Resources                │
│  (Theme, Components, Composables)       │
└──────────┬───────────────────┬──────────┘
           │                   │
      ┌────▼────┐         ┌────▼────┐
      │ Learning│ ◀─────▶ │  Games  │
      │ Modules │         │ Modules │
      └────┬────┘         └────┬────┘
           │                   │
      ┌────▼──────┐       ┌────▼──────┐
      │ Words     │       │ Gomoku    │
      │ Store     │       │ Store     │
      ├───────────┤       ├───────────┤
      │ Idioms    │       │ Snake     │
      │ Store     │       │ Store     │
      │           │       ├───────────┤
      │           │       │ ClawMach. │
      │           │       │ Store     │
      └───────────┘       └───────────┘

No cross-store mutations ✓
Separate state namespaces ✓
```

---

## Module Architecture

### Directory Structure (Proposed)

```
ChineseWord/
├── src/
│   ├── core/                      # Shared platform code
│   │   ├── composables/           # Reusable hooks
│   │   │   ├── useTheme.ts
│   │   │   ├── useStorage.ts
│   │   │   ├── useAnalytics.ts
│   │   │   └── ...
│   │   │
│   │   ├── components/            # Shared UI components
│   │   │   ├── BaseCard.vue
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseGrid.vue
│   │   │   ├── ProgressBar.vue
│   │   │   └── ...
│   │   │
│   │   ├── services/              # Platform services
│   │   │   ├── themeService.ts
│   │   │   ├── storageService.ts
│   │   │   ├── analyticsService.ts
│   │   │   └── ...
│   │   │
│   │   ├── theme/                 # Theme system
│   │   │   ├── colors.ts
│   │   │   ├── tokens.ts
│   │   │   └── index.ts
│   │   │
│   │   └── types/                 # Shared types
│   │       ├── common.ts
│   │       └── ...
│   │
│   ├── learning/                  # Learning modules (isolated)
│   │   ├── words/
│   │   │   ├── components/
│   │   │   │   ├── WordCard.vue
│   │   │   │   └── ...
│   │   │   ├── stores/
│   │   │   │   ├── progressStore.ts
│   │   │   │   └── wordDataStore.ts
│   │   │   ├── types/
│   │   │   │   └── word.ts
│   │   │   ├── hooks/
│   │   │   │   └── useWordData.ts
│   │   │   ├── views/
│   │   │   │   ├── StudyMode.vue
│   │   │   │   ├── TestMode.vue
│   │   │   │   └── ReviewMode.vue
│   │   │   └── README.md
│   │   │
│   │   └── idioms/
│   │       ├── (same structure as words)
│   │       └── README.md
│   │
│   ├── games/                     # Game modules (isolated)
│   │   ├── gomoku/
│   │   │   ├── components/
│   │   │   │   ├── GomokuBoard.vue
│   │   │   │   └── ...
│   │   │   ├── stores/
│   │   │   │   └── gomokuStore.ts
│   │   │   ├── types/
│   │   │   │   └── gomoku.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useGameLoop.ts
│   │   │   │   └── useGameLogic.ts
│   │   │   ├── views/
│   │   │   │   └── GomokuGame.vue
│   │   │   └── README.md
│   │   │
│   │   ├── snake/
│   │   │   └── (same structure)
│   │   │
│   │   ├── clawMachine/
│   │   │   └── (same structure)
│   │   │
│   │   └── [NEW_GAME]/             # Template for new games
│   │       ├── components/
│   │       ├── stores/
│   │       ├── types/
│   │       ├── hooks/
│   │       ├── views/
│   │       └── README.md
│   │
│   ├── router/                    # Route configuration
│   │   └── index.ts
│   │
│   ├── App.vue                    # Root component
│   ├── main.ts                    # Entry point
│   └── styles/                    # Global styles
│       └── main.css
│
├── public/
├── docs/                          # Documentation
└── package.json
```

### Module Template (For New Games)

Every new game follows this structure:

```
games/[GameName]/
├── README.md                      # Module documentation
├── components/
│   ├── [GameName]Game.vue         # Main game component
│   ├── [GameName]Board.vue        # Game board/canvas
│   └── ...other game components
├── stores/
│   └── [gameNameStore].ts         # Pinia store (isolated)
├── types/
│   └── [gameName].ts              # Type definitions
├── hooks/
│   ├── useGameLoop.ts             # Game loop hook
│   ├── useGameLogic.ts            # Game rules
│   └── ...other game-specific hooks
└── views/
    └── [GameName]Game.vue         # Route view
```

---

## Data Architecture

### State Management Strategy

**Principle:** Separate Pinia store per module, zero cross-store dependencies.

#### Learning Modules

```typescript
// src/learning/words/stores/progressStore.ts
export const useProgressStore = defineStore('word-progress', () => {
  // State: Only word-related progress
  const progressMap = ref<Record<string, Progress>>({})

  // Methods: Only word operations
  const markLearned = (wordId: string) => { ... }
  const markMastered = (wordId: string) => { ... }
  // ...
})

// src/learning/idioms/stores/idiomProgressStore.ts
export const useIdiomProgressStore = defineStore('idiom-progress', () => {
  // State: Only idiom-related progress
  const progressMap = ref<Record<string, Progress>>({})

  // Methods: Only idiom operations
  const markLearned = (idiomId: string) => { ... }
  // ...
})
```

**Key Point:** Stores are named distinctly (`word-progress`, `idiom-progress`, not just `progress`).

#### Game Modules

```typescript
// src/games/gomoku/stores/gomokuStore.ts
export const useGomokuStore = defineStore('gomoku-game', () => {
  // State: ONLY Gomoku game state
  const board = ref<Board>(...)
  const currentPlayer = ref<'black' | 'white'>('black')
  const score = ref({ black: 0, white: 0 })
  // NO learning progress, NO global state

  // Methods: ONLY Gomoku logic
  const makeMove = (x: number, y: number) => { ... }
  const checkWin = () => { ... }
  // ...
})

// src/games/snake/stores/snakeStore.ts
// src/games/clawMachine/stores/clawMachineStore.ts
// (Same pattern: isolated, game-specific only)
```

**Key Point:** Games have NO access to learning progress stores.

### Data Flow

```
User Interaction (Click Card)
    ↓
Component Event Handler
    ↓
Pinia Store Mutation (only in same module)
    ↓
Computed Properties (reactive updates)
    ↓
Template Re-render
    ↓
useStorage composable watches and saves
    ↓
localStorage (persisted)
```

### Storage Layer

```typescript
// src/core/composables/useStorage.ts
export function useStorage(key: string, defaultValue: any) {
  // Abstract localStorage behind a composable
  // Can migrate to IndexedDB later without changing code

  const value = ref(defaultValue)

  // Watch for changes and persist
  watch(value, (newVal) => {
    localStorage.setItem(key, JSON.stringify(newVal))
  })

  // Load from storage
  onMounted(() => {
    const stored = localStorage.getItem(key)
    if (stored) value.value = JSON.parse(stored)
  })

  return value
}
```

**Benefit:** If you ever migrate to IndexedDB or cloud sync, only this one file changes.

---

## Component Architecture

### Component Hierarchy

```
                    Shared Components (core/components/)
                              │
                ┌─────────────┼─────────────┐
                │             │             │
            BaseCard      BaseButton     BaseGrid
                │             │             │
    ┌───────────┴───────────┐ │ ┌──────────┴─────────┐
    │                       │ │ │                    │
LearningCard           BaseInput  GameBoard    CategoryFilter
    │                       │                    │
  │ ├─ WordCard             │                    │
  │ └─ IdiomCard        BaseLabel            ProgressBar
    │
    └─ Game-specific components (isolated per game)
        ├─ GomokuBoard
        ├─ SnakeCanvas
        ├─ ClawMachineUI
        └─ ...
```

### Component Layers

**Layer 1: Atomic (Maximum Reuse)**
- BaseCard, BaseButton, BaseInput
- No game logic
- Theme tokens from context
- Work in isolation

**Layer 2: Composite (Reuse in Learning/Games)**
- LearningCard (study/test/review mode)
- ProgressBar (learning progress)
- ScoreDisplay (game scores)
- Work across modules

**Layer 3: Module-Specific (Isolated)**
- GomokuBoard (Gomoku game)
- SnakeCanvas (Snake game)
- Game-specific UI
- Cannot be shared (tightly coupled to game logic)

---

## State Management

### Pinia Store Organization

```typescript
// Key pattern: Separate namespace per module

// ✅ Good: Clear namespaces
'word-progress'      // Words learning
'idiom-progress'     // Idioms learning
'gomoku-game'        // Gomoku game
'snake-game'         // Snake game
'clawmachine-game'   // Claw machine game

// ❌ Avoid: Ambiguous names
'progress'           // Which module?
'game'               // Which game?
'state'              // Too generic
```

### Store Mutation Rules

**Rule 1:** Each store only mutates its own state
```typescript
// ✅ Good
const wordStore = useProgressStore()
wordStore.markLearned(wordId)  // Mutates word-progress

// ❌ Bad
const gameStore = useGomokuStore()
gameStore.markLearned(wordId)  // Games don't do this!
```

**Rule 2:** Inter-module communication through composed components
```typescript
// ✅ Good: Components composed together, stores separate
<template>
  <LearningCard @learned="handleLearned" />
  <GameBoard @gameEnd="handleGameEnd" />
</template>

// ❌ Bad: Cross-store mutation
const wordStore = useProgressStore()
const gameStore = useGomokuStore()
gameStore.onWin(() => {
  wordStore.incrementScore()  // Cross-module mutation!
})
```

---

## API & Integration Points

### Current Integration Points

**1. Data Loading**
```typescript
// src/learning/words/hooks/useWordData.ts
export function useWordData() {
  const words = ref<Word[]>([])

  onMounted(async () => {
    const response = await import('@/data/word.json')
    words.value = response.default
  })

  return { words }
}
```

**Why this way:** Data is JSON, loaded at startup, abstracted in composable.

### Future Integration Points

**For Backend Migration:**

Current: `useWordData()` loads from JSON
Future: `useWordData()` can load from API

```typescript
// No component changes needed!
// Only this file changes:
export function useWordData() {
  const words = ref<Word[]>([])

  onMounted(async () => {
    // JSON load (current)
    const response = await import('@/data/word.json')
    words.value = response.default

    // OR API load (future)
    // const { data } = await fetch('/api/words')
    // words.value = data
  })
}
```

**For Cloud Sync:**

Current: `useStorage()` saves to localStorage
Future: `useStorage()` can sync to cloud

```typescript
export function useStorage(key: string, defaultValue: any) {
  // localStorage (current)
  const localValue = localStorage.getItem(key)

  // OR cloud sync (future)
  // const { data } = await fetch(`/api/sync/${key}`)
  // value.value = data

  // Watch and persist
  watch(value, (newVal) => {
    localStorage.setItem(key, JSON.stringify(newVal))
    // OR: await fetch(`/api/sync/${key}`, { body: newVal })
  })
}
```

---

## Performance Architecture

### Performance Strategy: Balanced Approach

**Three Metrics, Equal Priority:**

1. **Initial Load Time** (Target: < 2 seconds)
   - Code splitting by route
   - Lazy load game modules
   - Optimize assets

2. **Runtime Performance** (Target: 60fps)
   - Efficient game loops (useGameLoop hook)
   - Debounce updates (animation frames)
   - Memoize computations

3. **Bundle Size** (Target: < 200KB gzipped)
   - Tree-shake unused code
   - Minify and compress
   - Share common dependencies

### Optimization Techniques

**Code Splitting by Route:**
```typescript
// src/router/index.ts
const routes = [
  {
    path: '/words/study',
    component: () => import('@/learning/words/views/StudyMode.vue')
    // Only loads when user navigates here
  },
  {
    path: '/gomoku',
    component: () => import('@/games/gomoku/views/GomokuGame.vue')
    // Only loads when user navigates here
  }
]
```

**Lazy Load Game Data:**
```typescript
// Load word data on first access, cache it
const useWordData = () => {
  const wordData = ref(null)

  const loadWords = async () => {
    if (!wordData.value) {
      wordData.value = await import('@/data/word.json')
    }
    return wordData.value
  }

  return { loadWords }
}
```

**Game Loop Optimization:**
```typescript
// src/games/snake/hooks/useGameLoop.ts
export function useGameLoop(updateFn, targetFps = 60) {
  let frameId = 0
  const frameDuration = 1000 / targetFps
  let lastTime = Date.now()

  const loop = () => {
    const now = Date.now()
    const deltaTime = now - lastTime

    if (deltaTime >= frameDuration) {
      updateFn(deltaTime)
      lastTime = now
    }

    frameId = requestAnimationFrame(loop)
  }

  return { start: () => loop(), stop: () => cancelAnimationFrame(frameId) }
}
```

---

## Deployment & DevOps

### Build Process

```bash
# Development
npm run dev                   # Start dev server with hot reload

# Production Build
npm run build                 # TypeScript check + Vite build
npm run preview              # Preview production build

# Quality Checks
npm run type-check           # TypeScript strict mode
npm run lint                 # ESLint
npm run test                 # Unit tests
```

### Deployment Target

- **Platform:** Vercel (configured in `vercel.json`)
- **Build Output:** `dist/` directory
- **Node Version:** >= 16

### Environment Management

```
.env.development
  - API_URL=http://localhost:3000
  - LOG_LEVEL=debug

.env.production
  - API_URL=https://api.chineseword.app
  - LOG_LEVEL=error
```

---

## Technical Decisions & Rationale

### Decision 1: Complete Module Isolation

**Decision:** Games are completely isolated (own stores, no shared state)

**Rationale:**
- ✅ Prevents bugs (no side effects from other modules)
- ✅ Enables parallel development (teams don't interfere)
- ✅ Easy to add/remove games (just plug/unplug a module)
- ✅ Easier testing (mocked stores for each game)

**Alternative Considered:** Shared game state with mutations from learning progress
- ❌ Would couple games to learning system
- ❌ Would be harder to develop games independently
- ❌ Would risk learning progress affecting game state

### Decision 2: Pinia for State Management

**Decision:** Use Pinia (Vue 3 official state management)

**Rationale:**
- ✅ Built for Vue 3 Composition API
- ✅ Simple, lightweight, zero-boilerplate
- ✅ Great DevTools support
- ✅ Excellent TypeScript support
- ✅ No learning curve (coming from Vuex)

**Alternative Considered:** useState composables only
- ❌ No centralized state management
- ❌ Harder to debug state changes
- ❌ No DevTools support

### Decision 3: localStorage for Persistence

**Decision:** Use localStorage abstracted through composables

**Rationale:**
- ✅ Works offline
- ✅ No backend dependency
- ✅ Built-in browser API
- ✅ Abstracted through `useStorage()` for easy migration

**Migration Path:** If data grows, migrate to IndexedDB (only change `useStorage.ts`)

### Decision 4: Component Library First

**Decision:** Build shared component library before building features

**Rationale:**
- ✅ Ensures consistency across features
- ✅ Reduces code duplication
- ✅ Faster development once library is ready
- ✅ Easy onboarding for new developers

**Timeline:** Library ready by end of Phase 1

### Decision 5: Feature-Based Organization

**Decision:** Organize code by feature (games/, learning/) not by function

**Rationale:**
- ✅ Easier to find related code
- ✅ Easier to isolate features
- ✅ Easier to extract/move features
- ✅ Clear module boundaries

**Alternative Considered:** Function-based (components/, stores/, types/)
- ❌ Scatters feature code across directories
- ❌ Harder to understand feature scope
- ❌ Harder to extract/move features

---

## Migration Path

### Phase 1: Foundation (Weeks 1-3) - CURRENT

**Objective:** Establish patterns and refactor existing code

**Steps:**
1. ✅ Define architecture (this document)
2. ✅ Create component library
3. ✅ Create composable hooks library
4. Refactor existing games to new structure
5. Refactor existing learning modules to new structure

**Deliverables:**
- Refactored Gomoku, Snake, Claw Machine
- Refactored Words, Idioms learning modules
- All using new architecture patterns
- Zero regressions (all games still work)

### Phase 2: Enhancement (Weeks 4-6)

**Objective:** Add productivity tools and quality gates

**Steps:**
1. Add game analytics integration
2. Add A/B testing framework
3. Set up CI/CD quality gates
4. Create performance monitoring

**Deliverables:**
- Automated tests catch bugs pre-deployment
- Performance stays consistent as features added

### Phase 3: Scale (Weeks 7-8)

**Objective:** Prove architecture scales with new features

**Steps:**
1. Build 2 new games using standardized process
2. Build 1 new learning mode
3. Validate time estimates (should take 2-3 days)

**Deliverables:**
- New games built in 2-3 days each
- No regressions in existing features
- Codebase is maintainable at 5+ games

---

## Architecture Review Checklist

- [ ] Module isolation maintained (no cross-store mutations)
- [ ] All modules have own Pinia store
- [ ] Component library used consistently
- [ ] No hardcoded colors (use theme system)
- [ ] All components responsive and accessible
- [ ] Performance benchmarks met (load time, FPS, bundle size)
- [ ] Documentation updated
- [ ] New modules follow template structure
- [ ] Type safety (no `any` types)
- [ ] Tests written for critical logic

---

**Document Version:** 1.0 Draft
**Last Updated:** 2025-11-07
**Next Review:** After Phase 1 Implementation Completion

---

## Sign-Off

- [ ] Architect Approval
- [ ] Technical Lead Review
- [ ] Development Team Agreement
- [ ] PM Concurrence

*This architecture document will evolve as implementation progresses and we learn what works best.*
