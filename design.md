# Yatra AI Design

## Product Direction

Yatra AI is a calm, intelligent travel companion for discovering India and turning inspiration into a practical trip plan. The experience should feel more like a trusted local guide than a booking marketplace: warm, useful, and easy to scan.

## Design Principles

- **Guide, do not overwhelm:** Keep the next useful action obvious.
- **Inspiration with context:** Pair destinations with region, category, map location, and a short description.
- **Practical intelligence:** Make itinerary, budget, safety, and local advice feel like connected parts of one trip.
- **Trust through clarity:** Use plain language, visible loading states, and honest fallback messages.
- **Progressive detail:** Show a concise overview first; reveal deeper planning tools when requested.

## Visual Language

### Color

- Primary teal: `#147d73` for actions, links, and selected states.
- Deep evergreen: `#173b3a` for headings and primary text.
- Muted sage: `#607a78` and `#6a807e` for supporting text.
- Soft mint: `#e3f5f1` and `#edf8f6` for badges, hover states, and quiet surfaces.
- Warm accent: pale sand tones for travel warmth and secondary highlights.
- Page background: `#f7fbfa` with white surfaces and subtle borders.

Avoid using saturated colors for decoration. Color should communicate hierarchy, state, or category.

### Typography

- **Display:** Playfair Display for the hero and major editorial moments.
- **Interface:** DM Sans for navigation, controls, body copy, cards, and forms.
- Use generous line height for descriptions and compact line height for labels and controls.
- Keep headings dark evergreen and reserve teal for emphasis rather than entire blocks of text.

### Shape and Depth

- Use rounded controls and compact cards with restrained shadows.
- Keep borders light and warm rather than gray and heavy.
- Use soft radial background accents sparingly to suggest landscape and sunlight.
- Avoid dense card nesting; related content should share a section or panel.

## Information Architecture

1. **Navigation**
   - Yatra AI brand mark
   - Destinations
   - Smart Planner
   - Travel Tools
   - Login or account state

2. **Discovery**
   - Hero introduction
   - Primary action to start planning
   - Secondary action to explore destinations
   - Destination search and category filters
   - Destination cards and map view

3. **Planning**
   - Destination and trip preferences
   - AI itinerary generation
   - Budget breakdown
   - Local insights

4. **Travel Tools**
   - Safety guidance
   - Scam or message checker
   - Smart guide assistance

5. **Account**
   - Login and registration modal
   - Current user state
   - Stored account identity where available

## Core Screens and States

### Home and Discovery

The first viewport should establish Yatra AI, explain its value in one short paragraph, and expose planning and exploration actions immediately. The destination section should support scanning by category and searching by destination or state.

Each destination card should show:

- Destination name
- State or region
- Category
- Short description
- Recognizable visual cue
- Action to open or use the destination in planning

The map should reinforce geographic understanding without replacing the cards. A missing coordinate must show a useful fallback rather than an empty map.

### Smart Planner

The planner should collect only the information needed to produce a useful first itinerary. Keep the form focused and group related inputs. After submission:

- Disable or clearly mark the active action while loading.
- Show the generated itinerary in a readable, scannable layout.
- Keep budget and local insight actions available as follow-up steps.
- Preserve the selected destination and user inputs when possible.

### Travel Tools

Travel tools should open in focused panels or modals so they do not interrupt discovery. Safety and scam-checking results must distinguish between loading, successful guidance, and unavailable or invalid input states.

### Authentication

Authentication should be lightweight and task-oriented. The modal needs clear labels, visible validation, loading feedback, and an obvious way to switch between login and registration. After authentication, the navigation should reflect the current account without changing the rest of the page layout.

## Interaction Rules

- Primary buttons use teal with white text and a clear hover state.
- Secondary actions use white or mint surfaces with teal borders or text.
- Selected category filters must be visually distinct from unselected filters.
- Buttons should communicate loading and should not allow accidental duplicate requests.
- Every modal must have an obvious close action and preserve a logical keyboard focus order.
- Errors should explain what the user can do next.
- Empty states should include a short explanation and a useful recovery action.

## Responsive Behavior

- Desktop uses a generous two-column hero and a balanced discovery layout.
- Tablet reduces horizontal padding and allows cards to reflow without shrinking text excessively.
- Mobile stacks hero content, actions, filters, cards, and map sections vertically.
- Navigation should remain readable and usable at narrow widths; do not allow controls to overlap.
- Maps, cards, and form panels need stable minimum heights so loading or result content does not cause layout jumps.
- Keep touch targets comfortably sized and leave spacing between adjacent controls.

## Accessibility

- Maintain readable contrast for text, controls, and selected states.
- Use semantic headings in page order.
- Provide accessible names for icon-only controls and meaningful labels for form inputs.
- Do not rely on emoji, color, or map markers alone to communicate meaning.
- Ensure modals can be closed with the keyboard and that focus returns to the triggering control.
- Respect reduced-motion preferences for entrance and hover animations.

## Content Tone

Yatra AI speaks like a knowledgeable, welcoming travel companion:

- Specific rather than promotional
- Warm but not overly casual
- Concise and action-oriented
- Honest about unavailable data or uncertainty
- Grounded in Indian destinations, culture, food, nature, and practical travel needs

Prefer: “Build a practical 5-day route through Kerala.”

Avoid: “Unlock the ultimate once-in-a-lifetime adventure.”

## Success Criteria

The design is working when a new visitor can:

1. Understand what Yatra AI does within a few seconds.
2. Find a destination by category or search.
3. See where the destination is on the map.
4. Generate an itinerary without unnecessary setup.
5. Move from itinerary to budget, local insight, and safety guidance naturally.
6. Recover gracefully from missing data, invalid input, or a failed request.
