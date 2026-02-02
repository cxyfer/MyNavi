## ADDED Requirements

### Requirement: Hashtag prefix display
The system SHALL render tags with a leading hash (#) symbol prefix.

#### Scenario: Tag is displayed
- **WHEN** a tag component renders with label "react"
- **THEN** it SHALL display as "#react" with the # symbol in accent color

### Requirement: Selected state visual indication
The system SHALL provide clear visual distinction for selected tags using consistent styling.

#### Scenario: Tag is selected
- **WHEN** a tag is in selected state
- **THEN** it SHALL have:
  - 2px solid neon border using var(--cyber-accent)
  - Background fill using var(--cyber-accent-20) (20% opacity)
  - Box shadow glow: 0 0 5px #00ff88, 0 0 10px #00ff8840
  - Text color using var(--cyber-accent)
  - Chamfered corners via clip-path

#### Scenario: Tag is unselected
- **WHEN** a tag is not selected
- **THEN** it SHALL have:
  - 1px solid border using var(--cyber-border) (#2a2a3a)
  - Transparent background
  - No glow effect
  - Text color using var(--cyber-muted) (#6b7280)
  - Chamfered corners via clip-path

### Requirement: Tag hover interaction
The system SHALL provide visual feedback on tag hover using consistent transitions.

#### Scenario: Hovering unselected tag
- **WHEN** user hovers over an unselected tag
- **THEN** the border SHALL transition to var(--cyber-accent-50) (50% opacity accent)
- **AND** the transition duration SHALL be 150ms with ease-out timing

#### Scenario: Hovering selected tag
- **WHEN** user hovers over a selected tag
- **THEN** the glow effect SHALL intensify to cyber-glow-lg (larger spread)
- **AND** the transition duration SHALL be 150ms with ease-out timing

#### Scenario: Reduced motion on hover
- **WHEN** user has `prefers-reduced-motion: reduce` enabled
- **THEN** hover state changes SHALL be instant (transition: none)
- **AND** target glow state SHALL still be applied

### Requirement: Tag chamfered corners
The system SHALL render tags with chamfered corners instead of rounded corners.

#### Scenario: Tag renders
- **WHEN** any tag component is displayed
- **THEN** it SHALL have 45-degree chamfered corners using clip-path

### Requirement: Tag keyboard accessibility
The system SHALL maintain keyboard accessibility for tag selection with proper focus management.

#### Scenario: Tag is focusable
- **WHEN** a tag component is rendered
- **THEN** it SHALL be a `<button>` element or have `role="button"` and `tabIndex={0}`
- **AND** it SHALL be reachable via keyboard Tab navigation

#### Scenario: Tag is focused via keyboard
- **WHEN** a tag receives keyboard focus
- **THEN** it SHALL display a visible 2px focus outline using var(--cyber-accent)
- **AND** the outline SHALL have 2px offset from the element
- **AND** the outline SHALL use outline-style (not border) to avoid layout shift

#### Scenario: Tag is toggled via keyboard
- **WHEN** user presses Enter or Space on a focused tag
- **THEN** the tag SHALL toggle its selected state
- **AND** the onClick handler SHALL be triggered

#### Scenario: Focus visible state is distinguished from selected state
- **WHEN** a tag is both selected AND focused
- **THEN** it SHALL display both the selected styling AND the focus outline
- **AND** the focus outline SHALL be visually distinct (e.g., dashed or thicker)
