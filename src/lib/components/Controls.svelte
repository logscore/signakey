<script lang="ts">
    import { strokeStore } from "$lib/stores/stroke.svelte";
    import { exportAsSvg } from "$lib/utils/export";

    interface Props {
        keyboardWidth: number;
        keyboardHeight: number;
        onReset?: () => void;
    }

    let { keyboardWidth, keyboardHeight, onReset }: Props = $props();

    function handleReset() {
        strokeStore.reset();
        onReset?.();
    }

    async function handleExportSvg() {
        await exportAsSvg(
            strokeStore.points,
            keyboardWidth,
            keyboardHeight,
            "keystroke.svg",
        );
    }
</script>

<div
    class="controls-toolbar flex items-center justify-center gap-3 fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-neutral-900/90 backdrop-blur-md border border-neutral-800 shadow-2xl z-50 transition-all hover:border-neutral-700"
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
    </button>

    <div class="h-4 w-px bg-neutral-800"></div>

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
        <span class="text-xs">Export SVG</span>
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
        color: #a3a3a3;
        border: 1px solid transparent;
    }

    .btn-secondary:hover:not(:disabled) {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.1);
    }
</style>
