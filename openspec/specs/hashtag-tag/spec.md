# Capability: Hashtag Tag

## Purpose

Provide hashtag-style tag components with Cyberpunk aesthetics, including prefix symbols, selected/unselected states, and keyboard accessibility.

## Requirements

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
  - 1px solid neon border using var(--cyber-accent)
  - Background fill using var(--cyber-accent-20) (20% opacity)
  - Box shadow glow via cyber-glow class
  - Text color using var(--cyber-accent)
  - Chamfered corners via clip-path

#### Scenario: Tag is unselected
- **WHEN** a tag is not selected
- **THEN** it SHALL have:
  - 1px solid border using var(--cyber-border)
  - Transparent background
  - No glow effect
  - Text color using var(--cyber-foreground)
  - Chamfered corners via clip-path

### Requirement: Tag hover interaction
The system SHALL provide visual feedback on tag hover using consistent transitions.

#### Scenario: Hovering unselected tag
- **WHEN** user hovers over an unselected tag
- **THEN** the border SHALL transition to var(--cyber-accent-50) (50% opacity accent)
- **AND** the text color SHALL transition to var(--cyber-accent)
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
- **WHEN** a tag component is rendered in TagFilter
- **THEN** it SHALL be a `<button>` element with type="button"
- **AND** it SHALL be reachable via keyboard Tab navigation

#### Scenario: Tag in LinkCard is clickable
- **WHEN** a tag component is rendered in LinkCard
- **THEN** it SHALL be a `<span>` with role="button" to avoid nested interactive elements
- **AND** it SHALL handle click events with stopPropagation

#### Scenario: Tag is focused via keyboard
- **WHEN** a tag receives keyboard focus
- **THEN** it SHALL display a visible 2px focus ring using var(--cyber-accent)
- **AND** the ring SHALL have 2px offset from the element

#### Scenario: Focus visible state is distinguished from selected state
- **WHEN** a tag is both selected AND focused
- **THEN** it SHALL display both the selected styling AND the focus ring
