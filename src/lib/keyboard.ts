// Keyboard layout mapping with logical coordinates
// Each key has a center point in logical units
// Row offsets approximate real keyboard stagger

export interface KeyPosition {
  key: string;
  x: number;
  y: number;
  width?: number; // in units, default 1
}

// Row horizontal offsets for realistic stagger
const ROW_OFFSETS = [0, 0.25, 0.75];

// Standard QWERTY rows
const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

// Build key positions map
export const KEY_POSITIONS: Map<string, KeyPosition> = new Map();

ROWS.forEach((row, rowIndex) => {
  const offset = ROW_OFFSETS[rowIndex];
  row.forEach((key, colIndex) => {
    KEY_POSITIONS.set(key, {
      key,
      x: colIndex + offset,
      y: rowIndex,
    });
  });
});

// Add spacebar (optional but useful)
KEY_POSITIONS.set(" ", {
  key: " ",
  x: 4.5, // Centered under the keyboard
  y: 3,
  width: 6,
});

// Get keyboard dimensions in logical units
export const KEYBOARD_WIDTH = 10; // 10 keys wide (top row)
export const KEYBOARD_HEIGHT = 3; // 3 rows (excluding spacebar)

// Convert logical coordinates to pixel coordinates
export function logicalToPixel(
  logicalX: number,
  logicalY: number,
  keySize: number,
  keyGap: number,
  offsetX = 0,
  offsetY = 0
): { x: number; y: number } {
  const unit = keySize + keyGap;
  return {
    x: offsetX + logicalX * unit + keySize / 2,
    y: offsetY + logicalY * unit + keySize / 2,
  };
}

// Get the position for a key press
export function getKeyPixelPosition(
  key: string,
  keySize: number,
  keyGap: number,
  offsetX = 0,
  offsetY = 0
): { x: number; y: number } | null {
  const normalized = key.toUpperCase();
  const position = KEY_POSITIONS.get(normalized);

  if (!position) {
    return null;
  }

  return logicalToPixel(
    position.x,
    position.y,
    keySize,
    keyGap,
    offsetX,
    offsetY
  );
}

// Valid keys for stroke recording
export function isValidKey(key: string): boolean {
  const normalized = key.toUpperCase();
  return KEY_POSITIONS.has(normalized);
}

// Normalize key to uppercase
export function normalizeKey(key: string): string {
  return key.toUpperCase();
}
