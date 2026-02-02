# Capability: Cyberpunk Theme

## Purpose

Provide a Cyberpunk design system with neon aesthetics, including color palette, glow effects, chamfered corners, and CRT scanline effects for dark mode.

## Requirements

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
  - `--cyber-border: #1a1a2e` (未選中邊框)
  - `--cyber-muted: #16213e` (次要背景)

### Requirement: Neon glow box shadow utilities
The system SHALL provide utility classes for neon glow effects using the accent color.

#### Scenario: Glow utilities are applied
- **WHEN** an element has class `cyber-glow`
- **THEN** it SHALL have `box-shadow: 0 0 8px var(--cyber-accent-50), 0 0 16px var(--cyber-accent-20)`

#### Scenario: Large glow utility is applied
- **WHEN** an element has class `cyber-glow-lg`
- **THEN** it SHALL have larger glow spread with multiple shadow layers

### Requirement: Chamfered corner with glow utility
The system SHALL provide utility classes for 45-degree chamfered corners with neon glow effect.

#### Scenario: Chamfer utility is applied
- **WHEN** an element has class `cyber-chamfer`
- **THEN** it SHALL have a clip-path creating 8px chamfered corners on all sides

#### Scenario: Chamfer with glow is applied to selected element
- **WHEN** an element has class `cyber-chamfer-selected`
- **THEN** it SHALL use a ::before pseudo-element with clip-path to create a neon border glow
- **AND** the glow color SHALL be var(--cyber-accent)

#### Scenario: Reduced motion preference is respected
- **WHEN** user has `prefers-reduced-motion: reduce` enabled
- **THEN** all glow animations SHALL be disabled
- **AND** static glow state SHALL still be visible

### Requirement: Monospace font stack
The system SHALL apply monospace font family to UI elements in dark mode.

#### Scenario: Font is rendered in dark mode
- **WHEN** the application renders in dark mode
- **THEN** the body SHALL use font stack: `'JetBrains Mono', 'Orbitron', 'Fira Code', 'Consolas', monospace`

### Requirement: Scanline background overlay
The system SHALL provide a scanline effect for CRT monitor aesthetic in dark mode.

#### Scenario: Scanlines are visible
- **WHEN** the application renders in dark mode
- **THEN** a subtle horizontal line pattern SHALL overlay the background with low opacity
