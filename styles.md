# Quizzie — Design System & Stylesheet

This document describes the complete styling system for the Quizzie application. Use this as a reference when building or modifying the frontend.

---

## Typography

**Fonts:**
- Display/Headings: `'Syne', sans-serif` (weights: 400, 600, 700, 800)
- Body/UI: `'DM Sans', sans-serif` (weights: 300, 400, 500)

**Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
```

---

## Color Palette

```css
--bg:         #0d0d14    /* Main background - very dark blue-black */
--bg2:        #13131e    /* Secondary background - slightly lighter */
--bg3:        #1a1a28    /* Tertiary background - lighter still */
--surface:    #1f1f30    /* Surface elements like cards */
--border:     rgba(255,255,255,0.08)  /* Subtle borders */

--accent:     #b8ff3c    /* Primary accent - bright lime green */
--accent-dim: rgba(184,255,60,0.12)  /* Dimmed accent for backgrounds */
--accent2:    #ff6b35    /* Secondary accent - orange (not heavily used) */

--text:       #f0f0f5    /* Primary text - near white */
--text-muted: #7b7b96    /* Muted text - grayish purple */
--text-faint: #3d3d56    /* Faint text - very subtle purple-gray */
```

---

## Design Tokens

```css
--radius:     16px       /* Standard border radius */
--radius-sm:  10px       /* Small border radius */
--transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1)  /* Smooth easing */
```

---

## Layout

**Container:**
- Max-width: 1100px
- Horizontal padding: 32px (20px on mobile)
- Centered with auto margins

**Section Spacing:**
- Default padding: 120px vertical (80px on mobile)

---

## Components

### 1. Navigation Bar

**Structure:**
- Fixed position at top
- Becomes sticky with backdrop blur on scroll
- Logo on left, nav links on right

**States:**
- Default: Transparent background
- Scrolled: `backdrop-filter: blur(20px)` + semi-transparent background + bottom border

**Nav Links:**
- Ghost style by default (`color: --text-muted`)
- Hover: `background: --surface` + `color: --text`
- Active: `background: --accent` + `color: --bg`
- Border-radius: 100px (pill shape)

**Logo:**
- Font: Syne 800
- Size: 1.5rem
- Includes animated dot that pulses

---

### 2. Buttons

**Base Button (.btn):**
- Padding: 14px 28px
- Border-radius: 100px
- Font-size: 0.95rem, weight 500
- Hover: `translateY(-2px)`
- Active: `translateY(0)`

**Primary Button (.btn-primary):**
- Background: `--accent` (bright lime)
- Text color: `--bg` (dark)
- Hover: Box shadow with accent glow

**Ghost Button (.btn-ghost):**
- Transparent background
- Border: 1.5px solid `--border`
- Text: `--text-muted`
- Hover: `background: --surface`, border becomes more visible

---

### 3. Hero Section

**Layout:**
- Full viewport height (min-height: 100vh)
- Flexbox centered content
- Padding-top: 100px to clear fixed nav

**Background Effect:**
- Grain texture overlay on entire body (SVG noise filter, opacity 0.025)
- Radial gradient glow blob (accent color, very subtle)

**Hero Title:**
- Font: Syne 800
- Size: clamp(3.5rem, 9vw, 8rem)
- Line-height: 0.95
- Letter-spacing: -0.04em
- Accent word has underline animation

**Animations:**
- Staggered fade-up entrance for all elements
- Accent underline slides in from left
- All use cubic-bezier easing

**Scroll Indicator:**
- Positioned at bottom center
- Animated mouse with scrolling wheel effect
- Fades in after 1.5s delay

---

### 4. Section Headers

**Section Label:**
- Uppercase, small size (0.75rem)
- Letter-spacing: 0.14em
- Color: `--text-faint`
- Has decorative line before it

**Section Title:**
- Font: Syne 700
- Size: clamp(2rem, 4vw, 3.2rem)
- Letter-spacing: -0.03em

---

### 5. Info/How It Works Section

**Layout:**
- Two-column grid (text + visual)
- Background: `--bg2` with top/bottom borders
- Collapses to single column on mobile

**Steps:**
- Vertical list with border separators
- Each step has number (accent color) + title + description
- Minimal padding for clean look

**Visual Card:**
- Aspect ratio 4:3
- Background: `--surface` with border
- Contains animated placeholder elements (shimmer effect)
- Can show fake progress bars or score display

---

### 6. Quiz Cards

**Layout:**
- Grid: 2 columns on desktop, 1 on mobile
- Gap: 20px

**Card Structure:**
- Background: `--bg2`
- Border: 1px solid `--border`
- Padding: 32px
- Border-radius: 16px

**Hover State:**
- Lifts up: `translateY(-4px)`
- Border becomes accent-tinted
- Overlay with accent-dim appears
- Box shadow intensifies

**Card Elements:**
- Number tag (small, uppercase, faint)
- Icon (48x48, accent-dim background)
- Title (Syne 700, 1.35rem)
- Description (muted text)
- Meta tags (pills with question count, difficulty, etc.)
- Action buttons

**Meta Tags:**
- Background: `--bg3`
- Border: 1px solid `--border`
- Pill-shaped (border-radius: 100px)
- Small text with icons

---

### 7. Team Cards

**Layout:**
- Grid: 3 columns on desktop, 2 on tablet, 1 on mobile
- Gap: 20px

**Card Structure:**
- Background: `--surface`
- Padding: 32px 28px
- Border-radius: 16px

**Elements:**
- Avatar: Circle, 60x60, displays initials (accent color)
- Name: Syne 700, 1.15rem
- Role: Uppercase, small, accent color
- Bio: Muted text, smaller
- Quiz link: Inline with arrow icon, accent on hover

**Hover:**
- Subtle lift: `translateY(-3px)`
- Border becomes more visible

---

### 8. Footer

**Structure:**
- Top border only
- Flexbox: logo left, copyright center, badge right
- Wraps on mobile

**Footer Badge:**
- Pill-shaped container
- Includes animated green dot
- Shows status or info

---

## Animations & Effects

### Keyframe Animations:

1. **fadeUp:** Opacity 0→1, translate Y(24px)→0
2. **fadeIn:** Simple opacity 0→1
3. **pulse:** Scale and opacity oscillation for logo dot
4. **lineIn:** ScaleX 0→1 for accent underline
5. **scrollWheel:** Scroll indicator animation
6. **shimmer:** Opacity pulse for skeleton loaders

### Reveal on Scroll:

- Class `.reveal` starts invisible and shifted down
- Becomes `.reveal.visible` when in viewport
- Delay classes available: `.reveal-delay-1` through `.reveal-delay-4`

### Transitions:

- All interactive elements use: `--transition` (0.3s cubic-bezier)
- Properties: transform, box-shadow, background, border-color, opacity

---

## Responsive Breakpoints

**900px and below:**
- Info grid becomes single column
- Quiz grid becomes single column
- Team grid becomes 2 columns

**600px and below:**
- Container padding reduces to 20px
- Nav links hidden (consider hamburger menu)
- Team grid becomes single column
- Section padding reduces to 80px
- Ghost buttons hidden in hero

---

## Visual Effects

### Grain Texture:
- SVG fractal noise filter applied to body::before
- Fixed position, covers entire viewport
- Opacity: 0.025
- Pointer-events: none, z-index: 9999

### Background Glows:
- Radial gradients with accent color at very low opacity
- Positioned absolutely, large size (700px+)
- Creates ambient lighting effect

### Backdrop Blur:
- Used on scrolled nav: `backdrop-filter: blur(20px)`
- Combined with semi-transparent background

---

## Best Practices for Claude

1. **Use CSS Variables:** Always reference colors and tokens via var(--name)
2. **Maintain Hierarchy:** Display font for headings, DM Sans for body
3. **Consistent Spacing:** Use multiples of 4px or 8px
4. **Smooth Transitions:** Always add transitions to interactive elements
5. **Hover States:** Every clickable element should have hover feedback
6. **Mobile-First:** Consider responsive behavior for all components
7. **Accessibility:** Maintain contrast ratios (accent on dark works well)
8. **Animation Performance:** Use transform and opacity for animations
9. **Layering:** Use subtle borders and backgrounds to create depth
10. **Consistency:** Reuse border-radius, padding patterns, and spacing

---

## Quick Reference

**Accent Color Usage:**
- Primary CTAs (buttons, links)
- Active states
- Highlighting important text
- Icon backgrounds (at low opacity)
- Glows and focus states

**Border Usage:**
- Always use `--border` variable
- Layer backgrounds with borders for depth
- Increase opacity on hover (0.08 → 0.15 → 0.3)

**Typography Scale:**
- Hero: 3.5rem–8rem (clamp)
- Section Title: 2rem–3.2rem (clamp)
- Card Title: 1.15rem–1.35rem
- Body: 0.9rem–1.15rem
- Small/Meta: 0.75rem–0.82rem

**Shadows:**
- Minimal by default
- Appear on hover: `0 24px 48px rgba(0,0,0,0.3)`
- Accent-colored for primary buttons

---

This design system creates a modern, dark-themed quiz application with a vibrant lime accent color. The style is clean, smooth, and emphasizes smooth animations and depth through layering.
