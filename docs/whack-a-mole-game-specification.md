# Whack-a-Mole Math Game Specification
## ChineseWord - New Game Module

**Document Status:** Design Specification
**Game Name:** Math Whack-a-Mole (数学打地鼠)
**Game Type:** Interactive Educational Game
**Target Age:** 6+ years old
**Date Created:** 2025-11-07

---

## 📋 Executive Summary

**Math Whack-a-Mole** is an educational game that combines the fun of the classic whack-a-mole mechanic with basic mathematics learning (addition and number recognition) designed specifically for 6-year-old children.

### Game Concept
- Cute moles pop up from holes with math problems displayed on their heads
- Player must tap the correct mole to answer the question
- Wrong taps result in score penalties
- Game progresses from simple number recognition to basic addition problems
- 60-second time limit with progressive difficulty

---

## 🎮 Game Overview

### Core Mechanics
1. **Pop-up System**: Moles appear randomly in 6-9 holes on the board
2. **Math Problem Display**: Each mole shows a problem (e.g., "2+1" or "What's 3?")
3. **Player Interaction**: Tap the mole with the correct answer
4. **Scoring System**: Correct tap = points, wrong tap = -1 point
5. **Difficulty Progression**: Problems get harder as time passes
6. **Time Limit**: 60 seconds total gameplay

### Game Flow
```
1. Start Screen
   ↓
2. Difficulty Selection (Easy/Medium/Hard)
   ↓
3. Game Board (Moles pop up)
   ↓
4. Player Taps Moles
   ↓
5. Score Updates
   ↓
6. Time Runs Out
   ↓
7. Game Over Screen with Results
```

---

## 🎯 Game Modes

### Difficulty Levels

#### Easy (Levels 1-2)
- **Duration:** 0-30 seconds
- **Problems:**
  - Number recognition: "Find 1", "Find 3", "Find 5"
  - Simple counting: Show 2 dots, "Which is 2?"
  - Basic addition: "1+1", "1+2"
- **Mole Pop Rate:** 1 mole every 1 second
- **Point Value:** +5 points for correct, -1 for wrong

#### Medium (Levels 3-4)
- **Duration:** 30-50 seconds (triggered by time milestone)
- **Problems:**
  - Number recognition: "Find 7", "Find 9"
  - Addition: "2+1", "2+2", "1+3"
  - Subtraction intro: "3-1", "2-1"
  - Visual counting: Show dots, count them
- **Mole Pop Rate:** 1.5 moles per second
- **Point Value:** +10 points for correct, -1 for wrong

#### Hard (Level 5)
- **Duration:** 50-60 seconds (final 10 seconds)
- **Problems:**
  - Mixed operations: "3+2", "4-1", "2+3"
  - Larger numbers: "5+3", "8-2"
  - Two-digit recognition: "Find 10"
- **Mole Pop Rate:** 2 moles per second (more holes active)
- **Point Value:** +15 points for correct, -1 for wrong

---

## 🐭 Mole Character Design

### Visual Appearance
- **Base Design:** Cute, round brown mole with large eyes and smile
- **Size:** 60-80px on mobile, scales with screen size
- **Animations:**
  - Pop-up: Slide up from hole (200ms ease-out)
  - Idle: Gentle bounce animation (600ms)
  - Hit: Shrink and disappear (100ms), show celebration particle
  - Wrong: Shake head side-to-side (200ms)

### Problem Display on Mole
- **Location:** Above mole head
- **Format:** Large text (28-32px on mobile)
- **Examples:**
  - "2+1" (addition)
  - "Find 3" (recognition)
  - "●●●" (visual counting)

### Interactive States
- **Normal:** Waiting for tap
- **Correct:** Green glow + celebration animation
- **Wrong:** Red shake + sad face briefly

---

## 🎨 Game Board Layout

### Board Structure
- **Number of Holes:** 6 on Easy, 8 on Medium, 9 on Hard
- **Layout:** 3x2, 2x4, 3x3 grid (varies by screen size)
- **Hole Design:** Green circular hole with shadow depth

### Responsive Design
- **Mobile (0-639px):** 3x2 grid, 60px moles, tap-friendly spacing
- **Tablet (640-1023px):** 3x3 grid, 70px moles
- **Desktop (1024+px):** 3x3 grid, 80px moles

### Game Board Background
- **Color:** Grass green (#4CAF50) with lighter grass texture
- **Theme:** Playful garden environment with trees and clouds
- **Score Display:** Top-left corner, large readable font
- **Timer Display:** Top-center, countdown visible
- **Lives/Penalty:** Show current score prominently

---

## 📊 Scoring System

### Points Calculation
```
Correct Answer:
- Easy:   +5 points
- Medium: +10 points
- Hard:   +15 points

Wrong Tap:
- Any:    -1 point

Bonus:
- No mistakes in round: +20 bonus
- Rapid consecutive hits: +2x multiplier for 3 hits in a row
```

### Score Thresholds
- **Bronze:** 50-99 points
- **Silver:** 100-199 points
- **Gold:** 200+ points
- **Perfect Game:** All correct, no wrong taps

### Leaderboard / Progress
- Save best score in localStorage
- Show improvement between games
- Display streak (consecutive correct answers)

---

## ⏱️ Time and Difficulty Progression

### Timeline
```
0-30s:   Easy mode (Level 1-2)
         - Simple problems
         - 1 mole/second
         - +5 points each

30-50s:  Medium mode (Level 3-4)
         - Medium problems
         - 1.5 moles/second
         - +10 points each

50-60s:  Hard mode (Level 5)
         - Complex problems
         - 2 moles/second
         - +15 points each
```

### Difficulty Triggers
- **Time-based:** Automatically increase at 30s and 50s marks
- **Visual Feedback:** Screen flash or sound effect when level changes
- **Problem Pool:** Expand problem difficulty as time increases

---

## 🎵 Audio & Feedback

### Sound Effects
- **Correct tap:** Cheerful "ding" sound (500ms)
- **Wrong tap:** Soft "buzz" sound (200ms)
- **Mole pop:** Cute "pop" sound
- **Level up:** Fanfare sound at 30s and 50s
- **Game over:** End music (2-3 seconds)
- **Background:** Gentle loop music (optional, can be muted)

### Visual Feedback
- **Score change:** Floating "+5" text that fades up
- **Combo indicator:** "Great! 3 in a row!" message
- **Level change:** "Level 2!" screen flash
- **Countdown:** Timer changes color (yellow at 10s, red at 5s)

---

## 📱 Responsive Design

### Mobile (Portrait)
- Full-width board
- 60x60px moles
- 3x2 grid (6 holes)
- Large touch targets (60px minimum)
- Score and timer above board
- Bottom area for feedback text

### Tablet (Landscape)
- Centered board
- 70x70px moles
- 3x3 grid (9 holes)
- Comfortable spacing for touch

### Desktop
- Centered board
- 80x80px moles
- 3x3 grid (9 holes)
- Mouse hover effects optional
- Keyboard support (arrow keys to select, space to hit)

---

## ♿ Accessibility

### WCAG 2.1 AA Compliance
- **Color Contrast:** All text meets AA standards
- **Touch Targets:** Minimum 44px touch targets
- **Screen Reader:** Game can be played with audio feedback
- **Keyboard Navigation:** Tab through moles, Enter/Space to hit
- **Motion:** Prefers-reduced-motion support (disable animations)

### 6-Year-Old Friendly
- **Simple Instructions:** 3-step explanation with visuals
- **Clear Feedback:** Immediate visual/audio confirmation
- **No Complex Controls:** Single tap action only
- **Forgiving Mechanics:** Wrong taps don't end game, just lose 1 point
- **Short Sessions:** 60 seconds matches attention span

---

## 🏗️ Technical Architecture

### Game State (Pinia Store)
```typescript
interface WhackAMoleGameState {
  // Game status
  status: 'idle' | 'playing' | 'paused' | 'finished'

  // Scoring
  score: number
  bestScore: number
  combo: number

  // Timing
  remainingTime: number
  currentLevel: 1 | 2 | 3 | 4 | 5

  // Board state
  activeMoles: MoleInstance[]
  problemQueue: MathProblem[]

  // Player interaction
  lastAction: {
    moleId: string
    correct: boolean
    timestamp: number
  }
}

interface MoleInstance {
  id: string
  position: { x: number, y: number }
  problem: MathProblem
  isActive: boolean
  createdAt: number
}

interface MathProblem {
  id: string
  difficulty: 'easy' | 'medium' | 'hard'
  type: 'addition' | 'number-recognition' | 'visual-counting' | 'subtraction'
  question: string
  correctAnswerId: string // Which mole has the answer
  options: { id: string, value: string | number }[]
}
```

### Components
1. **WhackAMoleGame.vue** - Main game container
2. **GameBoard.vue** - 6/8/9 hole grid layout
3. **MoleHole.vue** - Individual hole with mole
4. **MoleCharacter.vue** - Animated mole with problem
5. **GameUI.vue** - Score, timer, level display
6. **ProblemDisplay.vue** - Math problem rendering
7. **GameOverScreen.vue** - Results and replay
8. **StartScreen.vue** - Instructions and start button

### Composables
- **useGameLoop** - Game tick and timing
- **useGameLogic** - Game state management
- **useProblemGenerator** - Create math problems
- **useMoleSpawner** - Mole pop-up timing
- **useScore** - Score calculation

---

## 🎮 Game Controls

### Touch/Mouse
- **Tap Mole:** Single tap on mole to answer
- **Tap Hole:** Tapping empty hole doesn't score

### Keyboard (Optional)
- **Arrow Keys:** Navigate to next mole
- **Space:** Hit selected mole
- **Enter:** Hit selected mole
- **Esc:** Pause game

### Mobile Gestures
- **Tap:** Primary interaction
- **Swipe:** Could dismiss mole if missed (optional)

---

## 📊 Problem Sets by Difficulty

### Level 1-2 (Easy: 0-30s)
**Number Recognition:**
- "Find 1", "Find 2", "Find 3", "Find 4", "Find 5"

**Visual Counting:**
- Show 2 dots, "How many?" (click mole with 2)
- Show 3 dots, "How many?" (click mole with 3)

**Addition:**
- "1+1" = 2
- "1+2" = 3
- "2+1" = 3
- "1+3" = 4

### Level 3-4 (Medium: 30-50s)
**Number Recognition:**
- "Find 6", "Find 7", "Find 8", "Find 9"

**Visual Counting:**
- Show 4-5 dots, count them
- Show dots and 1 number, select the matching count

**Addition:**
- "2+2" = 4
- "2+3" = 5
- "3+2" = 5
- "3+3" = 6
- "4+1" = 5

**Subtraction Intro:**
- "3-1" = 2
- "2-1" = 1
- "4-1" = 3

### Level 5 (Hard: 50-60s)
**Advanced Addition:**
- "3+2" = 5
- "4+2" = 6
- "5+2" = 7
- "4+3" = 7

**Subtraction:**
- "5-2" = 3
- "5-1" = 4
- "6-2" = 4
- "6-3" = 3

**Mixed:**
- "2+3+1" = 6 (optional, harder)
- Larger numbers: "8+1" = 9, "10-1" = 9

---

## 🎯 Success Criteria

### For the Game
- ✅ Responsive on mobile/tablet/desktop
- ✅ Accessibility (WCAG 2.1 AA)
- ✅ 60 FPS gameplay on target devices
- ✅ Load time < 2 seconds
- ✅ All 5 levels functioning correctly
- ✅ Score tracking and persistence
- ✅ No console errors or warnings

### For the Player (6-Year-Old)
- ✅ Can understand game in < 2 minutes
- ✅ Enjoys playing for full 60 seconds
- ✅ Experiences clear progress (score increasing)
- ✅ Gets immediate feedback (correct/wrong)
- ✅ Wants to play again (replay button works)
- ✅ Learns number recognition and basic addition

### Educational Outcomes
- ✅ Child recognizes numbers 1-10
- ✅ Child can add 1-5 using basic numbers
- ✅ Child understands simple subtraction
- ✅ Child improves with repeated play

---

## 🗺️ Development Roadmap

### Phase 1: MVP (Week 1-2)
- [ ] Game state management (Pinia store)
- [ ] Game board and mole UI
- [ ] Problem generator
- [ ] Basic game loop (pop-up and timing)
- [ ] Scoring system
- [ ] Game over screen

### Phase 2: Polish (Week 3)
- [ ] Animations and transitions
- [ ] Sound effects and music
- [ ] Difficulty progression
- [ ] Performance optimization
- [ ] Mobile responsiveness testing
- [ ] Accessibility review

### Phase 3: Launch (Week 4)
- [ ] Integration with routing
- [ ] Save score to localStorage
- [ ] Leaderboard/best score display
- [ ] User testing with 6-year-olds
- [ ] Bug fixes from testing
- [ ] Documentation completion

---

## 📚 Integration with ChineseWord App

### Routing
- **Route:** `/games/whack-a-mole`
- **Menu Link:** Home → Games → Whack-a-Mole (Math)
- **Icon:** Mole emoji or custom icon

### Store Integration
- Save score to localStorage: `whack-a-mole-game`
- Share theme system with existing games
- Use same BaseCard patterns if applicable

### Data Structure
```
games/whackAMole/
├── components/
│   ├── WhackAMoleGame.vue
│   ├── GameBoard.vue
│   ├── MoleHole.vue
│   ├── MoleCharacter.vue
│   ├── GameUI.vue
│   ├── ProblemDisplay.vue
│   ├── GameOverScreen.vue
│   └── StartScreen.vue
├── stores/
│   └── whackAMoleStore.ts
├── types/
│   └── whackAMole.ts
├── hooks/
│   ├── useGameLoop.ts
│   ├── useGameLogic.ts
│   ├── useProblemGenerator.ts
│   ├── useMoleSpawner.ts
│   └── useScore.ts
├── assets/
│   ├── mole.png (sprite or SVG)
│   ├── hole.png
│   ├── sounds/
│   │   ├── correct.mp3
│   │   ├── wrong.mp3
│   │   ├── pop.mp3
│   │   ├── levelup.mp3
│   │   └── music-bg.mp3
│   └── styles/
│       └── whack-a-mole.css
├── utils/
│   └── problemGenerator.ts
└── README.md
```

---

## ✅ Acceptance Criteria

- [ ] Game loads without errors
- [ ] Moles appear at correct intervals
- [ ] Math problems display correctly
- [ ] Scoring system works (correct/wrong)
- [ ] Timer counts down from 60 to 0
- [ ] Difficulty increases at 30s and 50s marks
- [ ] Game Over screen shows final score
- [ ] Best score saved and retrieved
- [ ] Responsive on mobile (portrait and landscape)
- [ ] Touch interactions work smoothly
- [ ] Animations are smooth (60 FPS)
- [ ] Accessibility: Keyboard navigation works
- [ ] Accessibility: WCAG 2.1 AA compliance verified
- [ ] Sound effects play correctly (optional toggle)
- [ ] Documentation is complete

---

## 📝 Notes

### Design Decisions
1. **60 seconds duration:** Appropriate for 6-year-old attention span
2. **Progressive difficulty:** Keeps engagement high as game progresses
3. **Positive feedback emphasis:** Wrong taps only -1 point, correct is +5-15
4. **Cute aesthetic:** Friendly mole character encourages continued play
5. **No game-over on mistakes:** Missing questions doesn't end game, just penalizes slightly

### Future Enhancements
- Multiplayer mode (two-player tap race)
- Power-ups (2x score, slow time)
- Seasonal themes (Christmas, Halloween moles)
- Progression to harder math (multiplication basics)
- Voice feedback ("Great job!")
- Parental dashboard to track progress

---

**Game Design Complete!** Ready for implementation phase.

*Created by AI Assistant | 2025-11-07*
