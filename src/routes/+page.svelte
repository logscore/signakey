<script lang="ts">
  import Controls from "$lib/components/controls.svelte";
  import StrokeRecorder from "$lib/components/stroke-recorder.svelte";
  import { KEYBOARD_HEIGHT, KEYBOARD_WIDTH } from "$lib/constants";

  // biome-ignore lint/suspicious/noUnassignedVariables: Svelte bind:this
  let strokeRecorder: StrokeRecorder;

  function handleReset() {
    strokeRecorder?.showKeyboard();
  }
</script>

<svelte:head>
  <title>Logan Reeder - Sigkey</title>
  <meta name="description" content="Visualize your name on a QWERTY keyboard">
</svelte:head>

<main
  class="min-h-screen bg-black flex flex-col items-center justify-center p-8 pb-32"
>
  <!-- Main visualization area -->
  <div>
    <StrokeRecorder bind:this={strokeRecorder} />
  </div>

  <!-- Floating controls toolbar -->
  <Controls
    keyboardWidth={KEYBOARD_WIDTH}
    keyboardHeight={KEYBOARD_HEIGHT}
    onReset={handleReset}
  />
</main>
