<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import Keyboard from "./Keyboard.svelte";
    import Canvas from "./Canvas.svelte";
    import { strokeStore } from "$lib/stores/stroke.svelte";
    import { isValidKey, normalizeKey } from "$lib/keyboard";
    import { exportAsPng, exportAsSvg } from "$lib/utils/export";

    let keySize = 60;
    let keyGap = 6;

    // Calculate dimensions
    let keyboardWidth = $derived(10 * keySize + 9 * keyGap);
    let keyboardHeight = $derived(4 * keySize + 3 * keyGap); // 4 rows including spacebar

    // Canvas component reference
    let canvasComponent: Canvas;

    // Keyboard visibility state
    let keyboardVisible = $state(true);
    let fadeTimeout: ReturnType<typeof setTimeout> | null = null;

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

        // Reset fade timer - keyboard fades after 7 seconds of typing
        if (fadeTimeout) {
            clearTimeout(fadeTimeout);
        }
        fadeTimeout = setTimeout(() => {
            keyboardVisible = false;
        }, 7000);
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
        }, 7000);
    }

    function handleReset() {
        strokeStore.reset();
        keyboardVisible = true;
        if (fadeTimeout) {
            clearTimeout(fadeTimeout);
            fadeTimeout = null;
        }
    }

    async function handleExportPng() {
        const canvas = canvasComponent?.getCanvas();
        if (canvas) {
            await exportAsPng(canvas, "keystroke.png");
        }
    }

    async function handleExportSvg() {
        await exportAsSvg(
            strokeStore.points,
            keyboardWidth,
            keyboardHeight,
            "keystroke.svg",
        );
    }

    onMount(() => {
        // Update layout in store
        strokeStore.updateLayout(keySize, keyGap, 0, 0);

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
    <!-- Keyboard with canvas overlay -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="keyboard-wrapper relative cursor-pointer"
        style="width: {keyboardWidth}px; height: {keyboardHeight}px;"
        onclick={handleWrapperClick}
    >
        <div class="keyboard-fade" class:hidden={!keyboardVisible}>
            <Keyboard activeKey={strokeStore.activeKey} {keySize} {keyGap} />
        </div>
        <Canvas
            bind:this={canvasComponent}
            points={strokeStore.points}
            width={keyboardWidth}
            height={keyboardHeight}
        />
    </div>

    <!-- Controls -->
    <div class="controls flex gap-4">
        <button onclick={handleReset} class="btn btn-secondary">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
            </svg>
            Clear
        </button>

        <button
            onclick={handleExportPng}
            class="btn btn-primary"
            disabled={strokeStore.points.length < 2}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Export PNG
        </button>

        <button
            onclick={handleExportSvg}
            class="btn btn-primary"
            disabled={strokeStore.points.length < 2}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Export SVG
        </button>
    </div>

    <!-- Instructions -->
    <p class="text-neutral-500 text-sm">
        Type on your keyboard to draw stroke paths •
        <span class="text-neutral-400 font-mono">
            {strokeStore.points.length}
        </span>
        points recorded
    </p>
</div>

<style>
    .keyboard-fade {
        transition: opacity 0.5s ease;
        opacity: 1;
    }

    .keyboard-fade.hidden {
        opacity: 0;
        pointer-events: none;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        border-radius: 0.5rem;
        font-weight: 500;
        font-size: 0.875rem;
        transition: all 150ms ease;
        cursor: pointer;
    }

    .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .btn-primary {
        background: #ffffff;
        color: #000000;
        border: 1px solid #d4d4d4;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .btn-primary:hover:not(:disabled) {
        background: #f5f5f5;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        transform: translateY(-1px);
    }

    .btn-secondary {
        background: #1a1a1a;
        color: #ffffff;
        border: 1px solid #333333;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .btn-secondary:hover:not(:disabled) {
        background: #2a2a2a;
        transform: translateY(-1px);
    }
</style>
