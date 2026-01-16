<script lang="ts">
    import Controls from "$lib/components/Controls.svelte";
    import StrokeRecorder from "$lib/components/StrokeRecorder.svelte";
    import { KEYBOARD_WIDTH, KEYBOARD_HEIGHT } from "$lib/constants";

    let strokeRecorder: StrokeRecorder;

    function handleReset() {
        strokeRecorder?.showKeyboard();
    }
</script>

<svelte:head>
    <title>KeySign - QWERTY Stroke Path</title>
    <meta
        name="description"
        content="Visualize typing patterns by drawing stroke paths on a virtual QWERTY keyboard"
    />
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
