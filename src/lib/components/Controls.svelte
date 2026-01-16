<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import { createMutation } from "@tanstack/svelte-query";
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
    let statusMessage = $state("");
    let statusType = $state<"success" | "error">("success");
    let statusTimeout: ReturnType<typeof setTimeout>;

    const claimMutation = createMutation(() => ({
        mutationFn: async (text: string) => {
            const res = await fetch("/api/signatures/claim", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to claim");
            return data;
        },
        onSuccess: () => {
            handleExportSvg();
            showStatus("Signature Claimed!", "success");
        },
        onError: (error: Error) => {
            showStatus(error.message, "error");
        },
    }));

    function showStatus(message: string, type: "success" | "error") {
        statusMessage = message;
        statusType = type;
        if (statusTimeout) clearTimeout(statusTimeout);
        statusTimeout = setTimeout(() => {
            statusMessage = "";
        }, 3000);
    }

    function handleReset() {
        strokeStore.reset();
        onReset?.();
        statusMessage = "";
        claimMutation.reset();
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

    function handleClaim() {
        if (strokeStore.points.length < 2) return;
        claimMutation.mutate(strokeStore.typedText);
    }

    function handleKeyDown(event: KeyboardEvent) {
        const isModifier = event.metaKey || event.ctrlKey;

        if (isModifier && event.key.toLowerCase() === "c") {
            event.preventDefault();
            handleReset();
        }

        if (isModifier && event.key.toLowerCase() === "s") {
            event.preventDefault();
            handleClaim();
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

<!-- Status Toast -->
<div
    class="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300"
    class:opacity-0={!statusMessage}
    class:translate-y-4={!statusMessage}
>
    <div
        class="px-4 py-2 rounded-lg backdrop-blur-md shadow-lg border text-sm font-medium"
        class:bg-green-500-20={statusType === "success"}
        class:text-green-200={statusType === "success"}
        class:border-green-500-30={statusType === "success"}
        class:bg-red-500-20={statusType === "error"}
        class:text-red-200={statusType === "error"}
        class:border-red-500-30={statusType === "error"}
        style="background: {statusType === 'success'
            ? 'rgba(34, 197, 94, 0.2)'
            : 'rgba(239, 68, 68, 0.2)'}; 
                border-color: {statusType === 'success'
            ? 'rgba(34, 197, 94, 0.3)'
            : 'rgba(239, 68, 68, 0.3)'};"
    >
        {statusMessage}
    </div>
</div>

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
        onclick={handleClaim}
        class="btn btn-primary"
        disabled={strokeStore.points.length < 2 || claimMutation.isPending}
        aria-label="Claim Signature"
    >
        {#if claimMutation.isPending}
            <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                ></circle>
                <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
            <span class="text-xs">Claiming...</span>
        {:else}
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
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span class="text-xs">Claim</span>
            <kbd class="shortcut">{isMac ? "⌘" : "Ctrl"}+S</kbd>
        {/if}
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
        white-space: nowrap;
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
