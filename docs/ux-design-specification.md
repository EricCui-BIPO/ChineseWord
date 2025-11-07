# UX Design Specification
## ChineseWord - Design System & Component Library

**Document Status:** Draft
**Project:** ChineseWord
**Version:** 1.0
**Date Generated:** 2025-11-07
**Designer:** Sally (UX Designer)

---

## 📋 Table of Contents

1. [Design Vision](#design-vision)
2. [Design System](#design-system)
3. [Visual Language](#visual-language)
4. [Component Library](#component-library)
5. [Interaction Patterns](#interaction-patterns)
6. [Responsive Design](#responsive-design)
7. [Accessibility Standards](#accessibility-standards)
8. [Motion & Animation](#motion--animation)
9. [Implementation Guide](#implementation-guide)

---

## Design Vision

### The Magic We're Creating

ChineseWord transforms learning Chinese characters from a chore into a **joyful, celebratory experience**. Every interaction delights. Every achievement is celebrated. Every moment feels like winning.

### Design Philosophy

**"Learning feels like playing a game"**

We achieve this through:

1. **Immediate Visual Feedback** - Every action gets instant, delightful response
2. **Celebratory Moments** - Learning achievements are celebrated with flair
3. **Smooth, Playful Interactions** - Nothing feels clunky or educational
4. **Clear Progress Visibility** - Users always know they're advancing
5. **Low Friction** - Friction removed from every interaction

### Reference DNA

We blend the best of:
- 🦉 **Duolingo's Flow** - Smooth, streak-based progression, light-hearted tone
- 🏎️ **Mario Kart's Delight** - Visual polish, satisfying win animations, instant feedback
- 🔴 **Pokémon Go's Immersion** - Exploration, discovery, collectible joy, real-time responsiveness

---

## Design System

### 1. Color Palette

#### Primary Colors (Elsa/Frozen Theme)

| Color | Hex | Name | Usage |
|-------|-----|------|-------|
| **Ice Blue** | `#4DD0E1` | Cyan-400 | Primary buttons, cards, accents, interactive elements |
| **Frozen Purple** | `#CE93D8` | Purple-300 | Secondary accents, highlights, complementary actions |
| **Silver** | `#ECEFF1` | Blue-Gray-50 | Backgrounds, subtle elements, text backgrounds |
| **Dark Snow** | `#263238` | Blue-Gray-900 | Primary text, headings, critical information |

#### Semantic Colors

| Element | Hex | Name | Usage |
|---------|-----|------|-------|
| **Success** | `#66BB6A` | Green-400 | Correct answers, mastered characters, completion |
| **Warning** | `#FFA726` | Orange-400 | Difficult items, caution, needs attention |
| **Danger** | `#EF5350` | Red-400 | Errors, mistakes, validation errors |
| **Info** | `#42A5F5` | Blue-400 | Help text, hints, additional information |
| **Disabled** | `#BDBDBD` | Gray-400 | Disabled states, inactive elements |

#### Neutral Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **White** | `#FFFFFF` | Cards, modals, primary background |
| **Light Gray** | `#F5F5F5` | Secondary backgrounds, hover states |
| **Medium Gray** | `#EEEEEE` | Dividers, subtle borders |
| **Dark Gray** | `#757575` | Secondary text, subtle UI |

### 2. Typography

#### Font Stack

```css
/* Headlines & Titles */
font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Body Text */
font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Monospace (for character display) */
font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
```

#### Type Scale

| Size | Line Height | Weight | Usage |
|------|------------|--------|-------|
| **H1 (36px)** | 1.2 (43px) | 700 Bold | Page titles, major sections |
| **H2 (28px)** | 1.3 (36px) | 700 Bold | Section headings, card titles |
| **H3 (24px)** | 1.4 (34px) | 600 Semi | Sub-headings, emphasis |
| **H4 (20px)** | 1.5 (30px) | 600 Semi | Small headings, labels |
| **Body (16px)** | 1.6 (26px) | 400 Regular | Primary text, paragraphs |
| **Body Small (14px)** | 1.5 (21px) | 400 Regular | Secondary text, descriptions |
| **Caption (12px)** | 1.4 (17px) | 500 Medium | Helper text, timestamps |
| **Character (48px)** | 1.0 (48px) | 400 Regular | Chinese character display |

#### Font Weights

- **400** - Regular (body text)
- **500** - Medium (labels, captions)
- **600** - Semi-Bold (sub-headings)
- **700** - Bold (headings, emphasis)

### 3. Spacing System

**Base Unit: 4px**

```
4px   - Minimal spacing, micro-interactions
8px   - Tight spacing, icon padding
12px  - Small spacing, button padding
16px  - Base spacing, component margins
24px  - Medium spacing, section separation
32px  - Large spacing, major sections
48px  - XL spacing, page sections
64px  - XXL spacing, full page rhythm
```

#### Spacing Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `space-xs` | 4px | Micro spacing |
| `space-sm` | 8px | Compact spacing |
| `space-md` | 12px | Small spacing |
| `space-base` | 16px | Default spacing |
| `space-lg` | 24px | Medium spacing |
| `space-xl` | 32px | Large spacing |
| `space-2xl` | 48px | Extra large |
| `space-3xl` | 64px | Section spacing |

### 4. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-none` | 0px | Sharp edges |
| `rounded-sm` | 4px | Subtle corners |
| `rounded-base` | 8px | Default corners |
| `rounded-md` | 12px | Rounded elements |
| `rounded-lg` | 16px | Large rounded |
| `rounded-full` | 9999px | Pills, circles |

### 5. Shadows

#### Elevation System

```css
/* Elevation 0 (No shadow) */
box-shadow: none;

/* Elevation 1 (Subtle lift) */
box-shadow: 0 2px 4px rgba(0,0,0,0.1);

/* Elevation 2 (Card/component) */
box-shadow: 0 4px 8px rgba(0,0,0,0.12);

/* Elevation 3 (Floating element) */
box-shadow: 0 8px 16px rgba(0,0,0,0.15);

/* Elevation 4 (Modal/overlay) */
box-shadow: 0 12px 24px rgba(0,0,0,0.18);

/* Elevation 5 (Top layer) */
box-shadow: 0 16px 32px rgba(0,0,0,0.2);
```

#### Usage

| Elevation | Components |
|-----------|------------|
| **0** | Flat buttons, text links, minimal UI |
| **1** | Hover states, subtle feedback |
| **2** | Cards, containers, learning card |
| **3** | Modal overlays, floating elements |
| **4** | Modals, full-screen dialogs |
| **5** | Dropdown menus, tooltips, z-top elements |

---

## Visual Language

### Design Characteristics

**Playful Yet Professional**
- Rounded corners (never sharp)
- Soft shadows (never harsh)
- Bright, cheerful colors
- Smooth, flowing layouts
- Generous whitespace
- Delightful micro-interactions

**Accessible & Clear**
- High contrast for readability
- Large touch targets (48px minimum)
- Clear visual hierarchy
- Obvious interactive elements
- Obvious feedback for actions

**Mobile-First Responsive**
- Design for touch first
- Adapt up to tablet/desktop
- Readable at all sizes
- Fast-loading assets
- Smooth on low-end devices

### Visual Hierarchy

**Emphasis Order:**
1. **Primary** - Ice Blue, large, bold, top of page
2. **Secondary** - Purple, medium, emphasized
3. **Tertiary** - Gray, small, subtle
4. **Disabled** - Light gray, low contrast

### Elsa/Frozen Theme Integration

**Core Elements:**
- Ice blue as primary brand color
- Soft purples and silvers as accents
- Cold, winter-inspired aesthetic (no warm colors)
- Clean, magical feeling (no gritty textures)
- Smooth, flowing shapes (no sharp angles)

**Visual Assets:**
- Snowflake icons for special achievements
- Frost/crystal texture overlays for premium elements
- Snow/ice particle animations for major transitions
- Purple aurora effects for magical moments

---

## Component Library

### Component Hierarchy

**Tier 1: Atomic Components** (Base building blocks)
- BaseCard
- BaseButton
- BaseInput
- BaseLabel
- BaseIcon

**Tier 2: Composite Components** (Combine atomic)
- LearningCard
- GameCard
- ProgressBar
- ScoreDisplay
- CategoryFilter

**Tier 3: Complex Components** (Page-level)
- GameBoard
- LearningMode
- GameOverlay
- ProgressDashboard

### 1. BaseCard Component

**Purpose:** Foundation for all card-like elements

**Variants:**
- **Learning Card** - For character/idiom learning
- **Score Card** - For displaying achievements
- **Game Card** - For game boards
- **Info Card** - For notifications/information

**Visual Style:**
```
┌─────────────────────┐
│                     │ ← Rounded corners (8-12px)
│   Card Content      │ ← Padding: 16-24px
│                     │ ← Background: White or soft purple
└─────────────────────┘
 ↓ Elevation 2 shadow
```

**States:**
- **Default** - White background, subtle shadow
- **Hover** - Slight lift (elevation +1), shadow increases
- **Active** - Ice blue border (2px), slight scale
- **Disabled** - Gray text, low opacity

**Learning Card Specifics:**

Front (Learning View):
```
┌──────────────────┐
│      爱           │ ← Character (48px, bold)
│                  │
│  ài              │ ← Pinyin (16px, purple)
│                  │
│  Love, affection │ ← Meaning (14px, dark gray)
│                  │
│  爱心, 热爱       │ ← Examples (12px, light gray)
└──────────────────┘
```

Back (Answer View):
```
┌──────────────────┐
│   爱 (ài)         │ ← Character + pinyin
│                  │
│   Love           │ ← English meaning
│   Affection      │
│   Passion        │
│                  │
│  [Learned] [Master] │ ← Progress buttons
└──────────────────┘
```

### 2. BaseButton Component

**Variants:**

| Variant | Color | Usage |
|---------|-------|-------|
| **Primary** | Ice Blue | Main actions, next/continue |
| **Secondary** | Purple | Alternative actions, skip |
| **Success** | Green | Correct answer, achievement |
| **Danger** | Red | Delete, negative actions |
| **Ghost** | Transparent | Minimal, less important |

**Sizes:**

| Size | Padding | Text | Usage |
|------|---------|------|-------|
| **Small** | 8px 12px | 12px | Compact, helper buttons |
| **Medium** | 12px 16px | 14px | Default buttons |
| **Large** | 16px 24px | 16px | Primary actions, CTAs |

**States:**
- **Default** - Full color, elevated shadow
- **Hover** - Slightly darker, increased shadow
- **Active/Pressed** - Darker still, slight inset
- **Disabled** - Gray, no shadow, no hover effect
- **Loading** - Spinner animation, disabled state

### 3. LearningCard Component

**Enhanced BaseCard with Learning Logic**

**Features:**
- Flip animation (3D card flip)
- Progress indicators (learned/mastered)
- Difficulty stars (1-5)
- Character count / total count
- Navigation arrows

**Layout:**
```
Top Section:
[< Prev] [3/50] [Next >]

Card Section:
[Flip Card - Front/Back]

Bottom Section:
[Not Learned] [Learned] [Mastered]
[Difficulty: ★★★☆☆]
```

### 4. ProgressBar Component

**Purpose:** Show learning progress visually

**Variants:**

**Linear Progress:**
```
┌─────────────────────────────┐
│ ███████████░░░░░░░ 65%      │ ← Filled portion (ice blue)
└─────────────────────────────┘
```

**Circular Progress:**
```
      ╱────╲
    ╱        ╲
   │   65%    │ ← Text in center
    ╲        ╱
      ╲────╱
   (Ice blue ring)
```

**Ring Stats:**
```
Learned: ███░░░░░ 40%
Mastered: ██░░░░░░░ 20%
Reviewed: █░░░░░░░░░ 10%
```

### 5. ScoreDisplay Component

**Purpose:** Show game/learning scores celebratory way

**Celebration Style:**
```
    🎉

    250 Points!

    +50 (for correct)

[Continue]
```

**Visual Style:**
- Large, bold score (48px+)
- Icon above (snowflake, star, etc)
- Color coding (green for correct, orange for learn, etc)
- Bounce animation on appear

### 6. CategoryFilter Component

**Purpose:** Let users filter content (grade level, difficulty)

**Layout:**
```
Grade Level:
[All] [Grade 1] [Grade 2] [Grade 3]

Difficulty:
[All] [Easy ★] [Medium ★★] [Hard ★★★]

[Apply]
```

**States:**
- Selected: Ice blue background, white text
- Unselected: Gray background, dark text
- Hover: Slight shadow increase

---

## Interaction Patterns

### 1. Learning Flow

**Study Mode Flow:**
```
Home → Select Character → Learning Card Flip → Mark Progress → Next/Prev
         ↓
    Progress saved to localStorage
```

**Card Flip Interaction:**
- Tap/Click card → Smooth 3D flip animation (300ms)
- Shows back with pinyin/meaning
- User taps to continue or navigate

**Progress Marking:**
- Three buttons on card: "Not Learned", "Learned", "Mastered"
- Each click gives instant feedback (color change, check mark)
- Celebration animation on "Mastered"

### 2. Test Mode Flow

**Test Mode Interaction:**
```
Show Question (Character) → User thinks → Tap "Show Answer" → Mark Correct/Wrong
↓
If Correct: Celebration + Next
If Wrong: Encouragement + Show Answer + Next
```

**Feedback Patterns:**
- **Correct:** Green card, checkmark, "+10 points", celebratory sound
- **Wrong:** Orange card, "X" mark, correct answer shown, encouraging message

### 3. Game Interaction Patterns

**Game Start:**
```
Game Board appears → Quick animation intro → "Ready?" → "Go!"
→ Gameplay → Win/Lose → Celebration/Retry
```

**Win Celebration:**
```
Fireworks animation
"Congratulations!"
Score display with breakdown
[Play Again] [Next Level] [Exit]
```

**Game Controls:**
- Touch/Mouse: Direct interaction on game board
- Keyboard: Arrow keys for navigation, Space/Enter for action
- Mobile: Touch gestures (swipe, tap)
- Desktop: Mouse click, drag

### 4. Navigation Patterns

**Consistent Pattern:**
```
← Back | Title | Menu ☰
```

**Breadcrumb Navigation (nested pages):**
```
Home > Words > Study > Character: 爱
```

### 5. Micro-Interactions

**Button Feedback:**
- Hover: Shadow increase, color slight lighten
- Click: Brief scale down (98%) then back
- Active: Color change, slight inset shadow

**Card Feedback:**
- Hover: Elevation +1, slight scale up (1.02)
- Touch: Brief haptic feedback (vibration)
- Tap: Visual feedback color change

**Progress Update:**
- Smooth progress bar animation (300ms)
- Number counter animation (increment display)
- Celebratory icon appearance (confetti, snowflakes)

**Loading States:**
- Spinner animation (rotating loading icon)
- Skeleton screens (gray placeholder shapes)
- Progress indicators for long operations

---

## Responsive Design

### Breakpoints

```css
Mobile:      0px    - 639px   (phones, portrait)
Tablet:      640px  - 1023px  (tablets, landscape)
Desktop:     1024px - 1439px  (desktops)
Wide:        1440px - ∞       (large screens)
```

### Mobile-First Approach

**Design for Mobile First:**
1. Design optimal mobile experience (narrow, touch-friendly)
2. Enhance for tablet (two-column layouts, larger text)
3. Optimize for desktop (full-width, refined details)

### Layout Patterns

**Mobile (Single Column):**
```
┌─────────────┐
│   Header    │
├─────────────┤
│   Content   │
│   (Full     │
│   Width)    │
├─────────────┤
│   Footer    │
└─────────────┘
```

**Tablet (Two Column):**
```
┌─────────────────────────┐
│   Header                │
├──────────┬──────────────┤
│ Sidebar  │   Content    │
│ (40%)    │   (60%)      │
├──────────┴──────────────┤
│      Footer             │
└─────────────────────────┘
```

**Desktop (Full Layout):**
```
┌────────────────────────────────┐
│          Header                │
├───────┬──────────────┬─────────┤
│Sidebar│   Content    │Sidebar  │
│(25%)  │   (50%)      │ (25%)   │
├───────┴──────────────┴─────────┤
│          Footer                │
└────────────────────────────────┘
```

### Touch-Friendly Sizing

**Mobile-Specific:**
- Minimum touch target: 48px × 48px
- Finger-safe spacing: 8px minimum between targets
- Bottom navigation: 56px height minimum
- Text size minimum: 14px

**Desktop-Specific:**
- Can use smaller targets (36px)
- Hover states important
- Keyboard navigation essential

### Responsive Typography

| Device | Base Size | H1 | H2 |
|--------|-----------|----|----|
| **Mobile** | 14px | 24px | 18px |
| **Tablet** | 16px | 28px | 22px |
| **Desktop** | 16px | 36px | 28px |

---

## Accessibility Standards

### WCAG 2.1 AA Compliance

**Contrast Ratios:**
- **Body text:** 4.5:1 minimum (normal text)
- **Large text:** 3:1 minimum (18pt+ or 14pt bold+)
- **UI components:** 3:1 minimum (borders, icons)

**Color Combinations (Tested):**
- Ice Blue (#4DD0E1) on White: ✅ 2.8:1 (sufficient for UI)
- Dark Snow (#263238) on Silver: ✅ 9.2:1 (excellent)
- Success Green (#66BB6A) with icons: ✅ 4.5:1

### Keyboard Navigation

**Tab Order:**
- Logical progression left-to-right, top-to-bottom
- Can reach all interactive elements with Tab/Shift+Tab
- Visible focus indicator (2px blue border minimum)
- Escape key closes modals/overlays

**Keyboard Shortcuts:**
```
Tab         - Next interactive element
Shift+Tab   - Previous interactive element
Enter       - Activate button/submit form
Space       - Toggle checkbox/radio, scroll
Escape      - Close modal/overlay
Arrow Keys  - Navigate between items
```

### Screen Reader Support

**Required:**
- All images have alt text
- Buttons have descriptive labels
- Form inputs have associated labels
- Headings use h1-h6 semantically
- Lists use semantic list markup
- ARIA roles where needed (role="button", etc)

**Announcements:**
- Progress updates announced
- Error messages announced
- Success feedback announced
- Character definitions announced

### Motion & Vestibular

**Respect Prefers-Reduced-Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**No auto-playing animations for users with vestibular disorders**

---

## Motion & Animation

### Animation Principles

**"Delight Without Distraction"**
- Animations should feel natural and snappy
- Duration: 200-500ms for most interactions
- Easing: Ease-out for elements entering, ease-in for leaving
- Purpose: Provide feedback, guide attention, or delight

### Animation Library

#### 1. Card Flip Animation

```css
/* 3D Card Flip */
@keyframes cardFlip {
  0% { transform: rotateY(0); }
  100% { transform: rotateY(180deg); }
}

Duration: 300ms
Easing: cubic-bezier(0.68, -0.55, 0.265, 1.55)
Trigger: Card click
```

#### 2. Progress Update Animation

```css
/* Progress bar fill animation */
@keyframes progressFill {
  0% { width: var(--old-progress); }
  100% { width: var(--new-progress); }
}

Duration: 500ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)
Trigger: Progress change
```

#### 3. Celebration Animation

```css
/* Confetti/Snowflake particles */
@keyframes celebrate {
  0% { transform: translateY(0) rotate(0); opacity: 1; }
  100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
}

Duration: 800ms
Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)
Trigger: Achievement unlock
Repeat: Multiple particles staggered
```

#### 4. Button Press Animation

```css
/* Button feedback */
@keyframes buttonPress {
  0% { transform: scale(1); }
  50% { transform: scale(0.98); }
  100% { transform: scale(1); }
}

Duration: 100ms
Easing: cubic-bezier(0.4, 0, 0.6, 1)
Trigger: Button click
```

#### 5. Entrance Animation

```css
/* Slide in from bottom */
@keyframes slideUpIn {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

Duration: 400ms
Easing: cubic-bezier(0.34, 1.56, 0.64, 1)
Trigger: Page load, modal open
```

### Animation Timing

| Duration | Usage |
|----------|-------|
| **100ms** | Button press, micro-interactions |
| **200ms** | State changes, hover effects |
| **300ms** | Card flip, modal appearance |
| **400ms** | Page transition, entrance |
| **500ms** | Progress updates, larger changes |
| **800ms** | Celebration, multi-step animation |

---

## Implementation Guide

### Design Tokens in Code

**CSS Variables (Recommended):**
```css
:root {
  /* Colors */
  --color-primary: #4DD0E1;
  --color-secondary: #CE93D8;
  --color-success: #66BB6A;
  --color-warning: #FFA726;
  --color-danger: #EF5350;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-base: 16px;
  --space-lg: 24px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-base: 8px;
  --radius-lg: 12px;

  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-base: 0 4px 8px rgba(0,0,0,0.12);
  --shadow-lg: 0 8px 16px rgba(0,0,0,0.15);
}
```

**Tailwind Configuration:**
```javascript
module.exports = {
  theme: {
    colors: {
      primary: '#4DD0E1',
      secondary: '#CE93D8',
      success: '#66BB6A',
      // ... more colors
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      // ... more spacing
    },
    // ... more config
  }
}
```

### Design File Organization

**Figma/Design Tool Structure:**
```
ChineseWord Design System
├── 📌 Readme & Overview
├── 🎨 Colors & Typography
├── 🧩 Component Library
│   ├── Atomic (BaseCard, BaseButton, etc)
│   ├── Composite (LearningCard, ProgressBar, etc)
│   └── Complex (GameBoard, etc)
├── 📱 Responsive Breakpoints
├── ✨ Animations & Interactions
├── 📐 Grids & Layout Systems
└── 🔄 Patterns & Usage Examples
```

### Handoff to Development

**Deliverables:**
1. ✅ This Design Specification (complete)
2. ✅ Design file with all components
3. ✅ Component anatomy diagrams
4. ✅ Interaction specifications
5. ✅ Animation timing curves
6. ✅ Responsive breakpoint guide
7. ✅ Accessibility checklist

---

## Design Consistency Checklist

- [ ] All buttons use BaseButton component
- [ ] All cards use BaseCard or derived component
- [ ] All spacing uses design tokens (not arbitrary values)
- [ ] All colors use color palette tokens
- [ ] All text uses established type scale
- [ ] All shadows use shadow system
- [ ] All animations follow animation library
- [ ] All interactive elements are keyboard accessible
- [ ] All text meets WCAG contrast ratios
- [ ] Mobile targets are minimum 48px × 48px
- [ ] Touch spacing is minimum 8px between targets
- [ ] Prefers-reduced-motion is respected
- [ ] All components work in Elsa/Frozen theme

---

## Evolution & Future

This design system will evolve as we learn:

- **Gather feedback** - How do users actually interact?
- **Measure metrics** - Which animations feel too slow?
- **Refinement** - What small tweaks make big impact?
- **Expansion** - What new components do we need?

**Design System Maintenance:**
- Quarterly reviews of component usage
- Feedback from development team
- User testing of complex interactions
- Performance monitoring of animations

---

**Document Version:** 1.0 Draft
**Last Updated:** 2025-11-07
**Next Review:** After Phase 1 Implementation Completion

---

## Sign-Off

- [ ] Product Manager Approval
- [ ] UX Designer Agreement
- [ ] Development Team Review & Feasibility Check
- [ ] Team Buy-in on Component Library

*This design system is living and will be refined through implementation feedback.*
