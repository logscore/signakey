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

    // Text display ref for auto-scroll
    let textDisplayRef: HTMLDivElement;

    // Auto-scroll to cursor when text changes
    $effect(() => {
        // Trigger on typed text change
        strokeStore.typedText;
        if (textDisplayRef) {
            textDisplayRef.scrollLeft = textDisplayRef.scrollWidth;
        }
    });

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

        // Handle Backspace
        if (key === "Backspace") {
            event.preventDefault();
            strokeStore.removeLastPoint();

            // Show keyboard when typing
            keyboardVisible = true;

            // Reset fade timer
            if (fadeTimeout) {
                clearTimeout(fadeTimeout);
            }
            if (strokeStore.points.length > 0) {
                fadeTimeout = setTimeout(() => {
                    keyboardVisible = false;
                }, 3000);
            }
            return;
        }

        // Only accept A-Z (and optionally space)
        if (!isValidKey(key)) return;

        event.preventDefault();
        strokeStore.addPoint(key);

        // Show keyboard when typing
        keyboardVisible = true;

        // Reset fade timer - only fade if there's typed content
        if (fadeTimeout) {
            clearTimeout(fadeTimeout);
        }
        // Only fade after typing, not when empty
        if (strokeStore.points.length > 0) {
            fadeTimeout = setTimeout(() => {
                keyboardVisible = false;
            }, 3000);
        }
    }

    // Show keyboard on click
    function handleWrapperClick() {
        keyboardVisible = true;
        // Reset fade timer only if there's content
        if (fadeTimeout) {
            clearTimeout(fadeTimeout);
        }
        if (strokeStore.points.length > 0) {
            fadeTimeout = setTimeout(() => {
                keyboardVisible = false;
            }, 3000);
        }
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

<div class="stroke-recorder flex flex-col items-center gap-12">
    <!-- Text Display -->
    <div
        bind:this={textDisplayRef}
        class="text-display"
        style="width: {KEYBOARD_WIDTH}px;"
    >
        <p class="typed-text capitalize">
            {strokeStore.typedText}<span class="cursor invisible">|</span>
        </p>
    </div>

    <!-- Keyboard with SVG overlay -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="keyboard-wrapper relative cursor-pointer"
        style="width: {KEYBOARD_WIDTH}px; height: {KEYBOARD_HEIGHT}px;"
        onclick={handleWrapperClick}
    >
        <div class="keyboard-fade" class:faded-out={!keyboardVisible}>
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
    .text-display {
        text-align: center;
        min-height: 3rem;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none;
    }

    .text-display::-webkit-scrollbar {
        display: none;
    }

    .typed-text {
        font-family: "Geist", sans-serif;
        font-size: 3rem;
        font-weight: 500;
        color: #ffffff;
        letter-spacing: 0.05em;
        margin: 0;
        line-height: 1.2;
        white-space: nowrap;
    }
    /* 
    .cursor {
        animation: blink 1s step-end infinite;
        color: #ffffff;
    }

    @keyframes blink {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
    } */

    .keyboard-fade {
        transition: opacity 0s;
        opacity: 1;
    }

    .keyboard-fade.faded-out {
        transition: opacity 1s ease;
        opacity: 0;
        pointer-events: none;
    }
</style>
