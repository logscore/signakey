Design Document: QWERTY Stroke Path Web App (Visual Keyboard Only)


1. Overview

The app visualizes typing behavior by mapping physical keyboard input onto a fixed, on screen QWERTY keyboard layout. Each key press records a point corresponding to the visual position of that key. Consecutive key presses are connected by straight line segments, forming a continuous stroke path.

The on screen keyboard is purely representational and does not accept pointer input.


1. Core Requirements

Functional


- Render a standard QWERTY keyboard as a visual reference

- Capture physical keyboard input only

- Map each valid key press to a predefined coordinate

- Draw a line between consecutive key presses

- Maintain stroke order until reset or completion

Non functional


- Low latency keyboard handling

- Deterministic layout across browsers

- Desktop focused


1. Explicit Non Goals


- No clickable keys

- No mobile virtual keyboard support

- No text input or text rendering

- No IME or international layout handling


1. Keyboard Layout Rendering


- Keyboard is rendered using CSS Grid or absolute positioning

- Keys are non interactive divs

- Each key displays its label only

- Keys visually highlight when their corresponding physical key is pressed

Layout:


- Static QWERTY layout

- Fixed row offsets to match real keyboards

- Spacebar optional and visually centered


1. Key Mapping and Normalization

Input handling is entirely keyboard driven.


- Listen to keydown events on window

- Use event.key

- Normalize to uppercase

- Accept only A–Z (optionally space)

- Ignore:
	- Modifiers (Shift, Alt, Ctrl, Meta)

	- Function keys

	- Punctuation


Key map:


- A dictionary mapping normalized key values to logical x, y coordinates

Example:


- Q = (0, 0)

- W = (1, 0)

- A = (0.5, 1)

- Z = (1, 2)

Logical coordinates are later scaled to pixels.


1. Coordinate System

Single shared coordinate system for:


- visual keyboard

- canvas drawing

Design:


- Keyboard defined in logical units

- Each key has a center point

- Row horizontal offsets approximate real keyboard stagger

At render time:


- Calculate scale factor

- Convert logical units to pixels

- Canvas and keyboard share the same transform

This guarantees drawn lines align with keys.


1. Stroke Recording Logic

State:


- points: ordered array of points

Point structure:


- key: string

- x: number (logical or pixel, choose one and be consistent)

- y: number

- timestamp: number

Behavior:


- First valid key press starts the stroke

- Each subsequent valid key press appends a point

- A line is drawn from previous to current point

- event.repeat can be ignored to avoid long key holds


1. Rendering

Canvas


- Canvas overlays or underlays the keyboard

- Canvas is transparent

- Lines are drawn incrementally

- On resize, canvas is cleared and stroke is replayed from stored points

Keyboard Visual Feedback


- When a key is pressed:
	- corresponding key element highlights briefly


- This is driven by the same key map used for stroke recording


1. Reset and Completion

Controls:


- Reset clears points and canvas

- Optional Done disables keyboard listener

No text buffer is maintained.


1. Edge Cases


- Rapid typing must not drop keydown events

- Resize should dynamically shrink and grow the virtual keyboard layout

- Repeated same key presses create overlapping lines. This is acceptable.

- Holding a key can be filtered via event.repeat

- Has the option to export the drawn stroke as a svg file or png file.

- Has a button to clear the stokes.

Tech stack
 - Sveltekit (use svelte mcp server for information) + vite
 - Bun
 - SQLite (drizzle))if needed, there will be no sign ups or anything like that. Pleas asses if SQLite is needed
 - TailwindCSS
 - tanstack query

- Use clis to generate boilerplate instead of writing it
- Use bash and linux commands for moving renaming, and any other tasks that it applies to so you save tokens.
- Run linters (biome) to check with each change