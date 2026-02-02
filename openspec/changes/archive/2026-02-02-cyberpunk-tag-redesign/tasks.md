## 1. Cyberpunk Theme CSS Foundation

- [x] 1.1 Add Cyberpunk color CSS variables to `index.css` (dark mode only)
  - --cyber-background, --cyber-foreground, --cyber-accent, --cyber-accent-20, --cyber-accent-50, --cyber-border, --cyber-muted
- [x] 1.2 Create `.cyber-glow` and `.cyber-glow-lg` utility classes
- [x] 1.3 Create `.cyber-chamfer` clip-path utility class (8px chamfer)
- [x] 1.4 Implement `.cyber-chamfer-selected` pseudo-element glow for selected state
- [x] 1.5 Add `prefers-reduced-motion` media query to disable glow animations
- [x] 1.6 Update body font-family to monospace stack (dark mode only)
 [x] 1.7 Add scanline background effect to dark mode

## 2. TagFilter Component Redesign

- [x] 2.1 Add hashtag (#) prefix to tag labels with accent color
- [x] 2.2 Implement selected state: neon border + bg-accent/20 + glow + chamfer
- [x] 2.3 Implement unselected state: subtle border + transparent bg + chamfer
- [x] 2.4 Add hover transitions (150ms ease-out) for border and glow effects
- [x] 2.5 Ensure tag buttons use proper `<button>` elements for keyboard accessibility
- [x] 2.6 Add visible focus outline (2px accent color with offset)
- [x] 2.7 Update "清除" button styling to match theme

## 3. LinkCard Component Tag Styling

- [x] 3.1 Convert LinkCard tags to `<span role="button">` elements (avoid nested interactive elements)
- [x] 3.2 Add hashtag (#) prefix to card tags
- [x] 3.3 Apply hover glow effect to card tags
- [x] 3.4 Remove redundant keyboard handlers (click events sufficient)

## 4. Accessibility & Theme Scope

- [x] 4.1 Verify all interactive tags are keyboard focusable and operable
- [x] 4.2 Test focus visible state vs selected state distinction
- [x] 4.3 Test with `prefers-reduced-motion: reduce` enabled
- [x] 4.4 Ensure monospace font and scanline only apply in dark mode
- [x] 4.5 Verify light mode remains unchanged (if applicable)

## 5. Verification & Quality Assurance

- [x] 5.1 Verify contrast ratios meet WCAG AA (文字 4.5:1, UI 3:1)
- [x] 5.2 Test keyboard navigation flow (Tab, Enter, Space)
- [x] 5.3 Test on mobile viewport sizes (touch targets ≥ 44px)
- [x] 5.4 Test chamfered corners with long tag labels
- [x] 5.5 Verify no visual regressions in light mode
