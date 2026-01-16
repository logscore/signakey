<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import Keyboard from "./Keyboard.svelte";
    import Canvas from "./Canvas.svelte";
    import { strokeStore } from "$lib/stores/stroke.svelte";
    import { isValidKey } from "$lib/keyboard";
    import {
        KEY_SIZE,
        KEY_GAP,
        KEYBOARD_WIDTH,
        KEYBOARD_HEIGHT,
    } from "$lib/constants";

    // Keyboard visibility state
    let keyboardVisible = $state(true);
    let fadeTimeout: ReturnType<typeof setTimeout> | null = null;

    // Expose reset function for external control
    export function showKeyboard() {
        keyboardVisible = true;
        if (fadeTimeout) {
            clearTimeout(fadeTimeout);
            fadeTimeout = null;
        }
    }

    // Handle keyboard input
    function handleKeyDown(event: KeyboardEvent) {
        // Ignore repeats, modifiers, function keys
        if (event.repeat) return;
        if (event.metaKey || event.ctrlKey || event.altKey) return;

        const key = event.key;

        // Only accept A-Z (and optionally space)
        if (!isValidKey(key)) return;

        event.preventDefault();
        strokeStore.addPoint(key);

        // Show keyboard when typing
        keyboardVisible = true;

        // Reset fade timer - keyboard fades after typing stops
        if (fadeTimeout) {
            clearTimeout(fadeTimeout);
        }
        fadeTimeout = setTimeout(() => {
            keyboardVisible = false;
        }, 2500);
    }

    // Show keyboard on click
    function handleWrapperClick() {
        keyboardVisible = true;
        // Reset fade timer
        if (fadeTimeout) {
            clearTimeout(fadeTimeout);
        }
        fadeTimeout = setTimeout(() => {
            keyboardVisible = false;
        }, 2500);
    }

    onMount(() => {
        // Update layout in store
        strokeStore.updateLayout(KEY_SIZE, KEY_GAP, 0, 0);

        // Add keyboard listener
        window.addEventListener("keydown", handleKeyDown);
    });

    onDestroy(() => {
        if (browser) {
            window.removeEventListener("keydown", handleKeyDown);
            if (fadeTimeout) {
                clearTimeout(fadeTimeout);
            }
        }
    });
</script>

<div class="stroke-recorder flex flex-col items-center gap-8">
    <!-- Keyboard with SVG overlay -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="keyboard-wrapper relative cursor-pointer"
        style="width: {KEYBOARD_WIDTH}px; height: {KEYBOARD_HEIGHT}px;"
        onclick={handleWrapperClick}
    >
        <div class="keyboard-fade" class:hidden={!keyboardVisible}>
            <Keyboard
                activeKey={strokeStore.activeKey}
                keySize={KEY_SIZE}
                keyGap={KEY_GAP}
            />
        </div>
        <Canvas
            points={strokeStore.points}
            width={KEYBOARD_WIDTH}
            height={KEYBOARD_HEIGHT}
        />
    </div>
</div>

<style>
    .keyboard-fade {
        transition: opacity 3s ease;
        opacity: 1;
    }

    .keyboard-fade.hidden {
        opacity: 0;
        pointer-events: none;
    }
</style>
