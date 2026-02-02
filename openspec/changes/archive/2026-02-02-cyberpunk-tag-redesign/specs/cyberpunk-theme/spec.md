## ADDED Requirements

### Requirement: Cyberpunk color palette CSS variables
The system SHALL define Cyberpunk design system colors as CSS custom properties in the root scope.

#### Scenario: Color variables are accessible
- **WHEN** the application renders in dark mode
- **THEN** the following CSS variables SHALL be available:
  - `--cyber-background: #0a0a0f` (主背景)
  - `--cyber-foreground: #e0e0e0` (主文字)
  - `--cyber-accent: #00ff88` (主要強調色 - 電光綠)
  - `--cyber-accent-20: rgba(0, 255, 136, 0.2)` (選中背景)
  - `--cyber-accent-50: rgba(0, 255, 136, 0.5)` (hover 邊框)
  - `--cyber-accent-secondary: #ff00ff` (次要強調色)
  - `--cyber-accent-tertiary: #00d4ff` (第三強調色)
  - `--cyber-border: #2a2a3a` (未選中邊框)
  - `--cyber-muted: #6b7280` (未選中文字)

### Requirement: Neon glow box shadow utilities
The system SHALL provide utility classes for neon glow effects using the accent color.

#### Scenario: Glow utilities are applied
- **WHEN** an element has class `cyber-glow`
- **THEN** it SHALL have `box-shadow: 0 0 5px #00ff88, 0 0 10px #00ff8840`

#### Scenario: Large glow utility is applied
- **WHEN** an element has class `cyber-glow-lg`
- **THEN** it SHALL have `box-shadow: 0 0 10px #00ff88, 0 0 20px #00ff8860, 0 0 40px #00ff8830`

### Requirement: Chamfered corner with glow utility
The system SHALL provide utility classes for 45-degree chamfered corners with neon glow effect.

#### Scenario: Chamfer utility is applied
- **WHEN** an element has class `cyber-chamfer`
- **THEN** it SHALL have a clip-path creating 8px chamfered corners on all sides

#### Scenario: Chamfer with glow is applied to selected element
- **WHEN** an element has class `cyber-chamfer` and is in selected state
- **THEN** it SHALL use a ::before pseudo-element with the same clip-path to create a 2px neon border glow
- **AND** the glow color SHALL be var(--cyber-accent)

#### Scenario: Reduced motion preference is respected
- **WHEN** user has `prefers-reduced-motion: reduce` enabled
- **THEN** all glow animations SHALL be disabled (no transition on box-shadow)
- **AND** static glow state SHALL still be visible

### Requirement: Monospace font stack
The system SHALL apply monospace font family to all UI elements.

#### Scenario: Font is rendered
- **WHEN** the application loads
- **THEN** the body SHALL use font stack: `'JetBrains Mono', 'Fira Code', Consolas, monospace`

### Requirement: Scanline background overlay
The system SHALL provide a scanline effect for CRT monitor aesthetic.

#### Scenario: Scanlines are visible
- **WHEN** the application renders
- **THEN** a subtle horizontal line pattern SHALL overlay the background with 30% opacity
