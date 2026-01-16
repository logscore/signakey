<script lang="ts">
  import { KEY_POSITIONS, type KeyPosition } from "$lib/keyboard";

  interface Props {
    activeKey: string | null;
    keySize?: number;
    keyGap?: number;
  }

  let { activeKey, keySize = 60, keyGap = 6 }: Props = $props();

  // Build rows for rendering
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  // Row offsets in units
  const rowOffsets = [0, 0.25, 0.75];

  function getKeyStyle(
    key: string,
    rowIndex: number,
    colIndex: number,
  ): string {
    const offset = rowOffsets[rowIndex];
    const left = (colIndex + offset) * (keySize + keyGap);
    const top = rowIndex * (keySize + keyGap);

    return `left: ${left}px; top: ${top}px; width: ${keySize}px; height: ${keySize}px;`;
  }

  function getSpacebarStyle(): string {
    // Center the spacebar under the keyboard
    const spaceWidth = 6 * keySize + 5 * keyGap; // 6 keys wide
    const totalWidth = 10 * keySize + 9 * keyGap;
    const left = (totalWidth - spaceWidth) / 2;
    const top = 3 * (keySize + keyGap);

    return `left: ${left}px; top: ${top}px; width: ${spaceWidth}px; height: ${keySize}px;`;
  }

  function getKeyboardWidth(): number {
    return 10 * keySize + 9 * keyGap;
  }

  function getKeyboardHeight(): number {
    return 4 * keySize + 3 * keyGap; // 4 rows now (including spacebar)
  }
</script>

<div
  class="keyboard-container relative"
  style="width: {getKeyboardWidth()}px; height: {getKeyboardHeight()}px;"
>
  {#each rows as row, rowIndex}
    {#each row as key, colIndex}
      <div
        class="key absolute flex items-center justify-center rounded-lg font-semibold text-lg select-none transition-all duration-100"
        class:active={activeKey === key}
        style={getKeyStyle(key, rowIndex, colIndex)}
      >
        {key}
      </div>
    {/each}
  {/each}

  <!-- Spacebar -->
  <div
    class="key absolute flex items-center justify-center rounded-lg font-semibold text-sm select-none transition-all duration-100"
    class:active={activeKey === " "}
    style={getSpacebarStyle()}
  >
    SPACE
  </div>
</div>

<style>
  .key {
    background: #1a1a1a;
    color: #888888;
    border: 1px solid #333333;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.3),
      0 2px 4px -2px rgba(0, 0, 0, 0.2);
  }

  .key.active {
    background: #ffffff;
    color: #000000;
    border-color: #ffffff;
    box-shadow:
      0 0 20px rgba(255, 255, 255, 0.3),
      0 4px 6px -1px rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
</style>
