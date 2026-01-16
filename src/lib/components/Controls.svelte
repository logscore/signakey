<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import { strokeStore } from "$lib/stores/stroke.svelte";
    import { exportAsSvg } from "$lib/utils/export";

    interface Props {
        keyboardWidth: number;
        keyboardHeight: number;
        onReset?: () => void;
    }

    let { keyboardWidth, keyboardHeight, onReset }: Props = $props();

    // Detect OS for shortcut display
    let isMac = $state(false);

    function handleReset() {
        strokeStore.reset();
        onReset?.();
    }

    async function handleExportSvg() {
        if (strokeStore.points.length < 2) return;
        await exportAsSvg(
            strokeStore.points,
            keyboardWidth,
            keyboardHeight,
            "keystroke.svg",
        );
    }

    function handleKeyDown(event: KeyboardEvent) {
        const isModifier = event.metaKey || event.ctrlKey;

        if (isModifier && event.key.toLowerCase() === "c") {
            event.preventDefault();
            handleReset();
        }

        if (isModifier && event.key.toLowerCase() === "s") {
            event.preventDefault();
            handleExportSvg();
        }
    }

    onMount(() => {
        isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
        window.addEventListener("keydown", handleKeyDown);
    });

    onDestroy(() => {
        if (browser) {
            window.removeEventListener("keydown", handleKeyDown);
        }
    });
</script>

<div
    class="controls-toolbar flex items-center justify-center gap-3 fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-neutral-900 backdrop-blur-md border border-neutral-800 shadow-2xl z-50 transition-all"
>
    <button
        onclick={handleReset}
        class="btn btn-secondary"
        aria-label="Clear strokes"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
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
        <span class="text-xs">Clear</span>
        <kbd class="shortcut">{isMac ? "⌘" : "Ctrl"}+C</kbd>
    </button>

    <div class="h-4 w-px bg-neutral-600"></div>

    <button
        onclick={handleExportSvg}
        class="btn btn-primary"
        disabled={strokeStore.points.length < 2}
        aria-label="Export as SVG"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
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
        <span class="text-xs">Save</span>
        <kbd class="shortcut">{isMac ? "⌘" : "Ctrl"}+S</kbd>
    </button>
</div>

<style>
    .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.375rem 0.75rem;
        border-radius: 0.375rem;
        font-weight: 500;
        font-size: 0.75rem;
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
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .btn-primary:hover:not(:disabled) {
        background: #f5f5f5;
        transform: translateY(-1px);
    }

    .btn-secondary {
        background: transparent;
        color: #e2e2e2;
        border: 1px solid transparent;
    }

    .btn-secondary:hover:not(:disabled) {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.1);
    }

    .shortcut {
        font-family: system-ui, sans-serif;
        font-size: 0.75rem;
        padding: 0.125rem 0.25rem;
        border-radius: 0.25rem;
        background: rgba(255, 255, 255, 0.1);
        color: #a3a3a3;
        margin-left: 0.25rem;
    }

    .btn-primary .shortcut {
        background: rgba(79, 79, 79, 0.1);
        color: #6d6c6c;
    }
</style>
