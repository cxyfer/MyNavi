# Cyberpunk Design System

> Source: https://www.designprompts.dev/cyberpunk

## Core Philosophy

**"High-Tech, Low-Life"** - 數位反烏托邦美學，融合高科技黑色電影元素。界面應該感覺像是故障的 CRT 監視器，在霓虹燈浸泡的城市或地下避難所的終端機上運作。

**The Vibe**: Dangerous, electric, rebellious, aggressively futuristic-retro.

---

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#0a0a0f` | Deep void black with slight blue undertone |
| `--foreground` | `#e0e0e0` | Primary text |
| `--card` | `#12121a` | Card background, deep purple-black |
| `--muted` | `#1c1c2e` | UI chrome/elevated backgrounds |
| `--muted-foreground` | `#6b7280` | Secondary text |
| `--accent` | `#00ff88` | PRIMARY NEON - Electric green |
| `--accent-secondary` | `#ff00ff` | SECONDARY NEON - Hot magenta/pink |
| `--accent-tertiary` | `#00d4ff` | TERTIARY NEON - Cyan |
| `--border` | `#2a2a3a` | Subtle borders |
| `--destructive` | `#ff3366` | Error/danger |

### Typography

| Element | Font Stack | Styling |
|---------|-----------|---------|
| Headings | Orbitron, Share Tech Mono, monospace | Uppercase, tracking-widest |
| Body | JetBrains Mono, Fira Code, Consolas, monospace | Normal case, wide tracking |
| UI Labels | Share Tech Mono, monospace | Uppercase, tracking-[0.2em] |

**Scale (Responsive):**
| Element | Mobile | Tablet (md) | Desktop (lg+) |
|---------|--------|-------------|---------------|
| H1 | `text-5xl` | `text-7xl` | `text-8xl` |
| H2 | `text-4xl` | `text-5xl` | `text-5xl` |
| H3 | `text-xl` | `text-2xl` | `text-2xl` |
| Body | `text-base` | `text-base` | `text-base` |
| Code/Labels | `text-sm` | `text-sm` | `text-sm` |

**Styling:**
- H1: `font-black`, `uppercase`, `tracking-widest`
- H2: `font-bold`, `uppercase`, `tracking-wide`
- H3: `font-semibold`, `uppercase`
- Body: `font-normal`, `tracking-wide`, `leading-relaxed`
- Code/Labels: `uppercase`, `tracking-[0.2em]`

### Shadows & Glow

**Box Shadows:**
```css
--box-shadow-neon: 0 0 5px #00ff88, 0 0 10px #00ff8840;
--box-shadow-neon-sm: 0 0 3px #00ff88, 0 0 6px #00ff8830;
--box-shadow-neon-lg: 0 0 10px #00ff88, 0 0 20px #00ff8860, 0 0 40px #00ff8830;
--box-shadow-neon-secondary: 0 0 5px #ff00ff, 0 0 20px #ff00ff60;
--box-shadow-neon-tertiary: 0 0 5px #00d4ff, 0 0 20px #00d4ff60;
```

**Text Shadows (for depth):**
```css
/* Glitch effect text shadow (hero headlines) */
--text-shadow-glitch: drop-shadow(0 0 10px rgba(0, 255, 136, 0.5));

/* Gradient text glow */
--text-shadow-glow: drop-shadow(0 0 20px rgba(0, 255, 136, 0.3));

/* Static chromatic aberration */
--text-shadow-chromatic: -2px 0 #ff00ff, 2px 0 #00d4ff;
```

### Border & Radius

- Default: `0px` (sharp corners)
- Small: `2px`
- Base: `4px`
- **Chamfered corners**: Use `clip-path` instead of `border-radius`

**Chamfer Pattern (10px cut):**
```css
clip-path: polygon(
  0 10px, 10px 0,
  calc(100% - 10px) 0, 100% 10px,
  100% calc(100% - 10px), calc(100% - 10px) 100%,
  10px 100%, 0 calc(100% - 10px)
);
```

---

## Visual Signatures (Required)

### 1. Chromatic Aberration
RGB 色偏效果 - 使用 `::before` 和 `::after` 偽元素實作

```css
.cyber-glitch {
  position: relative;
}

.cyber-glitch::before,
.cyber-glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.cyber-glitch::before {
  text-shadow: -2px 0 #ff00ff;
  clip-path: inset(0 0 0 0);
  animation: glitch-1 2s infinite linear alternate-reverse;
}

.cyber-glitch::after {
  text-shadow: 2px 0 #00d4ff;
  clip-path: inset(0 0 0 0);
  animation: glitch-2 3s infinite linear alternate-reverse;
}

@keyframes glitch-1 {
  0%, 100% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 0); }
  20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, 0); }
  40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 0); }
  60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, 0); }
  80% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 0); }
}

@keyframes glitch-2 {
  0%, 100% { clip-path: inset(10% 0 60% 0); transform: translate(2px, 0); }
  20% { clip-path: inset(30% 0 20% 0); transform: translate(-2px, 0); }
  40% { clip-path: inset(70% 0 10% 0); transform: translate(2px, 0); }
  60% { clip-path: inset(20% 0 50% 0); transform: translate(-2px, 0); }
  80% { clip-path: inset(50% 0 30% 0); transform: translate(1px, 0); }
}
```

### 2. Scanlines
CRT 掃描線覆蓋層
```css
background: repeating-linear-gradient(
  0deg,
  transparent,
  transparent 2px,
  rgba(0, 0, 0, 0.3) 2px,
  rgba(0, 0, 0, 0.3) 4px
);
```

### 3. Glitch Effects
偶然的閃爍/錯位動畫

### 4. Neon Glow
多層 box-shadow 發光效果

### 5. Chamfered Corners
45度切角（clip-path），非圓角

### 6. Circuit Patterns
電路板風格背景紋理
```css
background-image:
  linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px);
background-size: 50px 50px;
```

---

## Component Styles

### Button

**Default Variant:**
- Background: transparent
- Border: 2px solid accent (#00ff88)
- Text: accent color
- Clip-path: chamfered corners
- Hover: accent fill, dark text, neon glow

**Secondary Variant:**
- Border: 2px solid accentSecondary (#ff00ff)
- Text: accentSecondary
- Hover: magenta fill, neon-secondary glow

**Glitch Variant (CTAs):**
- Background: solid accent
- Text: background color
- Glitch animation on hover

### Card

**Default:**
- Background: card (#12121a)
- Border: 1px solid border (#2a2a3a)
- Clip-path: chamfered corners
- Hover: translateY(-2px), border accent, neon glow

**Terminal Variant:**
- Decorative header bar with traffic light dots
- Monospace text
- Used for: content panels, info boxes

**Holographic Variant:**
- 30% opacity background
- Backdrop-filter: blur
- Corner accents at edges

### Input

- Wrapper: relative positioning
- Prefix: ">" symbol in accent color
- Background: input (#12121a)
- Border: 1px solid border
- Clip-path: chamfered (smaller cut)
- Text: monospace, accent color
- Focus: border accent, neon glow

---

## Transitions & Motion

### Timing Functions
```css
/* Smooth digital transition (default) */
--ease-digital: cubic-bezier(0.4, 0, 0.2, 1);

/* Sharp mechanical snap */
--ease-snap: cubic-bezier(0.16, 1, 0.3, 1);

/* Step animation for glitch feel */
--ease-glitch: steps(4);

/* Standard transition durations */
--duration-fast: 100ms;
--duration-normal: 150ms;
--duration-slow: 300ms;
```

### Standard Transition Pattern
```css
.cyber-transition {
  transition: all var(--duration-normal) var(--ease-digital);
}

.cyber-transition-snap {
  transition: all var(--duration-fast) var(--ease-snap);
}
```

## Animations

```css
/* Glitch */
@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(2px, -2px); }
  60% { transform: translate(-1px, -1px); }
  80% { transform: translate(1px, 1px); }
}

/* Blink cursor */
@keyframes blink {
  50% { opacity: 0; }
}

/* RGB chromatic shift */
@keyframes rgbShift {
  0%, 100% { text-shadow: -2px 0 #ff00ff, 2px 0 #00d4ff; }
  50% { text-shadow: 2px 0 #ff00ff, -2px 0 #00d4ff; }
}

/* Scanline scroll */
@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
```

---

## Global Effects

### Scanlines Overlay (Full Page)
```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.3) 2px,
    rgba(0, 0, 0, 0.3) 4px
  );
  pointer-events: none;
  z-index: 9999;
}
```

### Circuit Background
Apply to main container or sections

---

## Layout

### Container
- **Max-width**: `max-w-7xl` for main content
- **Full-bleed**: Sections with `w-full`, contained inner content

### Grid Patterns
| Layout | Grid Class | Notes |
|--------|------------|-------|
| Features | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` | Apply `-skew-y-1` on container |
| Pricing | `grid-cols-1 md:grid-cols-3` | Middle card scaled up |
| Stats | Horizontal flex | `divide-x divide-border` |

### Asymmetry Requirements (MANDATORY)
- **Hero Split**: Minimum 60/40 (content / visual)
- **Overlapping Elements**: At least one section with negative margins
- **Section Transforms**: Use `rotate-1` or `skew-y-1` on section containers
- **Staggered Heights**: Vary card heights in grid where content allows

### Spacing
- **Base grid**: 8px
- **Section padding**: `py-24` to `py-32`
- **Internal spacing**: Dense component spacing

**Example Asymmetric Hero:**
```html
<section class="relative overflow-hidden">
  <div class="max-w-7xl mx-auto px-6 py-24">
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
      <!-- Content: 60% -->
      <div class="lg:col-span-3">
        <h1 class="text-5xl lg:text-8xl font-black uppercase tracking-widest">
          <span class="cyber-glitch" data-text="CYBER">CYBER</span>
        </h1>
      </div>
      <!-- Visual: 40% with overlap -->
      <div class="lg:col-span-2 relative">
        <div class="absolute -right-20 -top-10 w-64 h-64 bg-accent/10 blur-3xl"></div>
        <!-- Content -->
      </div>
    </div>
  </div>
</section>
```

---

## Responsive Strategy

**Mobile:**
- Typography scales down but maintains uppercase/tracking
- Maintain scanlines and chamfered corners
- Reduce glow intensity for performance
- Touch targets: minimum 44px

**Breakpoints:**
- xs: 320px
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1440px

---

## Accessibility

- Contrast: 7.5:1 ratio (accent green on dark)
- Focus states: 2px accent ring with glow
- `prefers-reduced-motion`: Disable glitch animations
- Scanlines at 30% opacity

---

## Iconography

**Lucide Icons Configuration:**
- Stroke width: `1.5px` (thin, technical feel)
- Size: Generally `h-5 w-5` or `h-6 w-6`
- Color: Inherit from text (usually accent or foreground)
- Style: Add subtle glow on hover via filter: `drop-shadow(0 0 4px currentColor)`

**Icon Containers:**
```html
<!-- Bordered square container with glow -->
<div class="w-10 h-10 border border-accent flex items-center justify-center
            hover:shadow-[0_0_10px_#00ff8840] transition-all">
  <Icon class="h-5 w-5 text-accent" />
</div>

<!-- Hexagonal container (using clip-path) -->
<div class="w-12 h-12 bg-accent/10 flex items-center justify-center
            [clip-path:polygon(50%_0%,_100%_25%,_100%_75%,_50%_100%,_0%_75%,_0%_25%)]">
  <Icon class="h-5 w-5 text-accent" />
</div>
```

**Hover Glow Effect:**
```css
.cyber-icon:hover {
  filter: drop-shadow(0 0 4px currentColor);
}
```

---

## Font Loading

**CDN (index.html):**
```html
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Share+Tech+Mono&display=swap" rel="stylesheet">
```

**Or npm:**
```bash
npm install @fontsource/orbitron @fontsource/jetbrains-mono
```

---

## Implementation Notes

1. Extend Tailwind config with custom colors/fonts/shadows
2. Create utility classes: `.cyber-chamfer`, `.cyber-glow`, `.cyber-glitch`
3. Customize shadcn/ui variants in `components/ui/`
4. Add scanlines in global CSS (`body::after`)
5. Import Lucide icons with `stroke-width={1.5}`
6. Test glow effects on different displays
7. Add `data-text` attribute to glitch elements
8. Use `will-change: transform` sparingly for performance
