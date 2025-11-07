# ChineseWord Project - Comprehensive Documentation
**Generated:** 2025-11-07
**Scan Type:** Quick Scan
**Project Type:** Web Application with Game Modules
**Framework:** Vue 3 + TypeScript + Vite

---

## 📋 Executive Summary

**ChineseWord** is an Elsa/Frozen-themed Chinese character learning application for children. It combines interactive flashcard learning with mini-games to create an engaging, educational experience.

### Core Features
- 📚 **3 Learning Modes**: Study (sequential), Test (random), Review (targeted)
- 🎮 **3 Mini-Games**: Gomoku (五子棋), Snake (贪吃蛇), Claw Machine (夹娃娃机)
- 📖 **2 Content Types**: Chinese Characters & Idioms
- 💾 **Local Storage**: All progress saved to browser storage
- 🎨 **Elsa Theme**: Ice blue, light purple, silver color scheme
- 📱 **Responsive**: Mobile-first design with Tailwind CSS

---

## 🏗️ Architecture Overview

### Technology Stack
| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | Vue 3 (Composition API) |
| **Language** | TypeScript 5.3 |
| **Build Tool** | Vite 5.0 |
| **State Management** | Pinia 2.1 |
| **Routing** | Vue Router 4.2 |
| **Styling** | Tailwind CSS 3.4 |
| **Data Storage** | localStorage (no backend) |
| **Data Format** | JSON files + TypeScript types |

### Project Structure
```
ChineseWord/
├── src/
│   ├── components/         # Vue components
│   │   ├── WordCard.vue           # Card flip component
│   │   └── IdiomCard.vue          # Idiom card component
│   │
│   ├── views/              # Page/route components
│   │   ├── Home.vue               # Home page (feature selection)
│   │   ├── WordHome.vue           # Words feature home
│   │   ├── IdiomHome.vue          # Idioms feature home
│   │   ├── StudyMode.vue          # Word study mode
│   │   ├── TestMode.vue           # Word test mode
│   │   ├── ReviewMode.vue         # Word review mode
│   │   ├── IdiomStudyMode.vue     # Idiom study mode
│   │   ├── IdiomTestMode.vue      # Idiom test mode
│   │   ├── IdiomReviewMode.vue    # Idiom review mode
│   │   ├── GomokuGame.vue         # Gomoku game
│   │   ├── SnakeGame.vue          # Snake game
│   │   └── ClawMachineGame.vue    # Claw machine game
│   │
│   ├── composables/        # Composition API hooks
│   │   ├── useWordData.ts        # Load & manage word data
│   │   ├── useIdiomData.ts       # Load & manage idiom data
│   │   └── useStorage.ts         # localStorage persistence
│   │
│   ├── stores/             # Pinia state stores
│   │   ├── progressStore.ts      # Word learning progress
│   │   ├── idiomProgressStore.ts # Idiom learning progress
│   │   ├── gomokuStore.ts        # Gomoku game state
│   │   ├── snakeStore.ts         # Snake game state
│   │   └── clawMachineStore.ts   # Claw machine game state
│   │
│   ├── types/              # TypeScript type definitions
│   │   ├── word.ts               # Word & Progress interfaces
│   │   ├── idiom.ts              # Idiom & Progress interfaces
│   │   ├── gomoku.ts             # Gomoku game types
│   │   ├── snake.ts              # Snake game types
│   │   └── clawMachine.ts        # Claw machine game types
│   │
│   ├── data/               # Data files
│   │   ├── word.json             # Word data (limited)
│   │   ├── allWord.json          # Extended word data
│   │   ├── allWord.ts            # Word data backup/reference
│   │   └── idioms.json           # Idiom data
│   │
│   ├── router/             # Vue Router configuration
│   │   └── index.ts              # Route definitions
│   │
│   ├── styles/             # Global styles
│   │   └── main.css              # Theme & animations
│   │
│   ├── App.vue             # Root component
│   └── main.ts             # Application entry point
│
├── public/                 # Static assets
├── docs/                   # Documentation
├── package.json            # Dependencies & scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # User-facing documentation
```

---

## 📊 Data Models

### Word Model
```typescript
interface Word {
  id: string              // Unique ID (e.g., "word-001")
  character: string       // Chinese character (e.g., "爱")
  pinyin: string         // Pinyin with tone marks (e.g., "ài")
  meaning: string        // Definition in Chinese
  words?: string[]       // Example phrases (e.g., ["爱心", "热爱"])
  category?: string      // Grade level (e.g., "一年级")
  difficulty?: number    // Difficulty rating (1-5)
}
```

### Progress Model
```typescript
interface Progress {
  wordId: string         // Reference to word ID
  learned: boolean       // User marked as learned
  mastered: boolean      // User marked as mastered
  reviewed: number       // Count of reviews
  lastReview?: number    // Timestamp of last review
  difficulty?: number    // User's perceived difficulty (1-5)
}
```

### Similar structures for:
- **Idiom & IdiomProgress** (types/idiom.ts)
- **Gomoku Game State** (types/gomoku.ts)
- **Snake Game State** (types/snake.ts)
- **Claw Machine State** (types/clawMachine.ts)

---

## 🔄 Data Flow Architecture

```
Data Files (JSON)
    ↓
useWordData/useIdiomData (Composables)
    ↓
Pinia Store (progressStore/idiomProgressStore)
    ↓
useStorage (localStorage persistence)
    ↓
Vue Components (Views & Cards)
    ↓
User Interactions → Updates stores → Saves to localStorage
```

### State Management Pattern

**Pinia Stores Involved:**
1. **progressStore.ts** - Words learning progress
   - Methods: `markLearned()`, `markMastered()`, `incrementReview()`, `setDifficulty()`, `getReviewWords()`
   - Computed: `stats` (total, learned, mastered, reviewed counts)

2. **idiomProgressStore.ts** - Idioms learning progress
   - Same pattern as progressStore

3. **gomokuStore.ts** - Gomoku game state
4. **snakeStore.ts** - Snake game state
5. **clawMachineStore.ts** - Claw machine game state

---

## 🎯 Feature Breakdown

### Learning Module (Words)
| Feature | Status | Location |
|---------|--------|----------|
| Sequential study | ✅ Active | StudyMode.vue |
| Random testing | ✅ Active | TestMode.vue |
| Targeted review | ✅ Active | ReviewMode.vue |
| Progress tracking | ✅ Active | progressStore.ts |
| Category filtering | ✅ Active | Home.vue, WordHome.vue |
| Card flip animation | ✅ Active | WordCard.vue, main.css |
| localStorage sync | ✅ Active | useStorage.ts |

### Learning Module (Idioms)
| Feature | Status | Location |
|---------|--------|----------|
| Sequential study | ✅ Active | IdiomStudyMode.vue |
| Random testing | ✅ Active | IdiomTestMode.vue |
| Targeted review | ✅ Active | IdiomReviewMode.vue |
| Progress tracking | ✅ Active | idiomProgressStore.ts |
| Card flip animation | ✅ Active | IdiomCard.vue, main.css |

### Game Modules
| Game | Status | Location | State |
|------|--------|----------|-------|
| Gomoku (Five-in-a-row) | ✅ Active | GomokuGame.vue | gomokuStore.ts |
| Snake | ✅ Active | SnakeGame.vue | snakeStore.ts |
| Claw Machine | ✅ Active | ClawMachineGame.vue | clawMachineStore.ts |

---

## 🔀 Routing Structure

```
/                              # Home (feature selection)
├── /word                      # Words feature home
│   ├── /words/study           # Study mode
│   ├── /words/test            # Test mode
│   └── /words/review          # Review mode
│
├── /idiom                     # Idioms feature home
│   ├── /idioms/study          # Study mode
│   ├── /idioms/test           # Test mode
│   └── /idioms/review         # Review mode
│
├── /gomoku                    # Gomoku game
├── /snake                     # Snake game
└── /claw-machine              # Claw machine game
```

---

## 💾 Data Persistence Strategy

### Storage Keys
- `word-progress` - Serialized word learning progress (JSON)
- `idiom-progress` - Serialized idiom learning progress (JSON)
- `gomoku-state` - Gomoku game state
- `snake-state` - Snake game state
- `claw-machine-state` - Claw machine game state

### Sync Mechanism
- **useStorage.ts** composable watches Pinia stores
- On any store change → automatically saves to localStorage
- On app load → restores from localStorage

---

## 🎨 Design System

### Theme Colors
| Element | Color | Usage |
|---------|-------|-------|
| Primary | Ice Blue (`#4DD0E1`) | Cards, buttons, accents |
| Secondary | Light Purple (`#CE93D8`) | Highlights, interactive |
| Accent | Silver (`#ECEFF1`) | Backgrounds, text |
| Text | Dark Gray (`#263238`) | Main content |
| Success | Green (`#66BB6A`) | Correct answers, completion |
| Warning | Orange (`#FFA726`) | Difficult items |

### Key Animations
- **Card Flip** - CSS transform animation (main.css)
- **Smooth Transitions** - 0.3s ease on all interactive elements
- **Mobile Optimized** - Reduced motion on mobile devices

### Responsive Breakpoints (Tailwind)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

---

## 📦 Dependencies

### Production Dependencies
```json
{
  "vue": "^3.4.15",
  "vue-router": "^4.2.5",
  "pinia": "^2.1.7"
}
```

### Dev Dependencies
- **Build**: vite@^5.0.11, @vitejs/plugin-vue@^5.0.2
- **Styling**: tailwindcss@^3.4.1, autoprefixer@^10.4.16, postcss@^8.4.33
- **Language**: typescript@^5.3.3, vue-tsc@^3.1.2
- **Config**: @vue/tsconfig@^0.5.1, @types/node@^24.9.2

---

## 🚀 Build & Deployment

### Development
```bash
npm install           # Install dependencies
npm run dev          # Start dev server (http://localhost:3000)
npm run type-check   # Check TypeScript types
```

### Production
```bash
npm run build        # Build for production
npm run preview      # Preview production build
npm run build:check  # Type check + build
```

### Deployment
- **Platform**: Vercel (vercel.json configured)
- **Build Output**: `dist/` directory
- **Environment**: Node.js compatible

---

## 🔑 Key Code Patterns

### 1. Composition API + Pinia
```typescript
// In components
import { useStore } from '@/stores/progressStore'
const store = useStore()
const learned = computed(() => store.stats.learned)
```

### 2. Data Composables
```typescript
const { words, getWordById } = useWordData()
const { storeProgress } = useStorage()
```

### 3. Reactive Progress Updates
```typescript
function markAsLearned(wordId: string) {
  store.markLearned(wordId)
  // useStorage watches store, auto-saves
}
```

### 4. Review Algorithm
```typescript
// Review words: not mastered OR reviewed < 3 times
const reviewWords = computed(() => store.getReviewWords())
```

---

## 📈 Performance Considerations

### Current State
- **Data Loading**: All words loaded at startup (fast for current size ~3000 items)
- **Storage**: localStorage (5-10MB browser limit)
- **Rendering**: Vue 3 reactivity handles updates efficiently
- **Build Size**: Optimized with Vite (tree-shaking enabled)

### Scalability Notes
- **No pagination needed yet** (current dataset < 5000 items)
- **Consider pagination** if words exceed 10,000
- **localStorage limits**: May need IndexedDB migration if data grows significantly
- **API migration path**: Can add backend API without major refactoring (composables abstract data)

---

## 🔐 Security Notes

### Current Implementation
- **No backend** - All data client-side (safe for educational app)
- **No user authentication** - Designed for local use
- **No sensitive data** - Learning progress is non-sensitive

### Future Considerations
- **If adding user accounts**: Implement authentication (JWT, OAuth)
- **If adding cloud sync**: Encrypt progress data in transit
- **If monetizing**: Add payment security measures

---

## 📝 Known Patterns & Conventions

### File Naming
- Components: PascalCase (e.g., `WordCard.vue`)
- Composables: camelCase with `use` prefix (e.g., `useWordData.ts`)
- Stores: camelCase with `Store` suffix (e.g., `progressStore.ts`)
- Types: camelCase (e.g., `word.ts`)

### ID Generation
- Words: `word-####` (e.g., `word-0001`)
- Idioms: `idiom-####`

### Progress Initialization
- Progress objects created on-demand (first interaction)
- Default values: learned=false, mastered=false, reviewed=0

### Mode Navigation
- Each mode (study/test/review) manages its own navigation state
- Routes determine which mode is active

---

## 🎓 Recent Development History

### Latest Additions (Last 5 commits)
1. **Mobile Responsiveness Optimization** - Snake & Claw Machine games
2. **Claw Machine Game Module** - New interactive game
3. **Snake Game Module** - New interactive game
4. **Words Data Updates** - Vocabulary expansion
5. **Character Card Enhancements** - Pinyin & phrase display

### Active Development Areas
- Game module expansion
- Mobile optimization
- Data vocabulary growth (3000+ characters)

---

## 🔄 API Integration Points

### Current (No Backend)
- Data: JSON files loaded at startup
- State: Pinia + localStorage
- No external API calls

### Future Integration Points
```typescript
// Composables already abstract data source
// Can add API calls here without changing components
useWordData() → {
  // Could become: async fetch from API
  // Components unchanged
}
```

---

## 📚 Documentation Resources

### In-Repository Docs
- **CLAUDE.md** - Development instructions for Claude Code
- **README.md** - User-facing documentation
- **PROJECT_PLAN.md** - Product & feature planning
- **HOW_TO_EXTEND_WORDS.md** - Guide for adding words
- **WORDS_EXTENSION_GUIDE.md** - Extended data guide
- **WORDS_DATA_GUIDE.md** - Data management guide
- **QUICK_START.md** - Getting started guide

---

## ✅ Documentation Completion Checklist

- [x] Project overview & objectives
- [x] Architecture & technology stack
- [x] Project structure & file organization
- [x] Data models & types
- [x] State management (Pinia stores)
- [x] Routing structure
- [x] Key components & their purposes
- [x] Data persistence strategy
- [x] Build & deployment process
- [x] Known patterns & conventions
- [x] Performance & scalability notes
- [x] Security considerations
- [x] Recent development history
- [x] Future integration points

---

## 🎯 Next Steps for BMAD Planning

With this documentation, your team is ready for:

1. **PRD Workflow** (PM Agent)
   - Use this doc to understand scope
   - Define new features/games to add

2. **Architecture Workflow** (Architect Agent)
   - Reference existing patterns
   - Design how new features integrate
   - Distill this 300-line doc into focused solution design

3. **Implementation Workflow** (SM & DEV Agents)
   - Reference component patterns
   - Use state management examples
   - Follow established conventions

---

**Generated by:** BMad Method document-project workflow
**Scan Level:** Quick (pattern-based, no deep code analysis)
**Estimated Preparation Time:** 10-15 minutes for PR/Architect to review
