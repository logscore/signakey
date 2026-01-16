<script lang="ts">
    import StrokeRecorder from "$lib/components/StrokeRecorder.svelte";
</script>

<svelte:head>
    <title>KeySign - QWERTY Stroke Path</title>
    <meta
        name="description"
        content="Visualize typing patterns by drawing stroke paths on a virtual QWERTY keyboard"
    />
</svelte:head>

<main
    class="min-h-screen bg-black flex flex-col items-center justify-center p-8"
>
    <!-- Header -->
    <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-3">KeySign</h1>
        <p class="text-neutral-500 text-lg">Visualize your typing patterns</p>
    </div>

    <!-- Main App -->
    <div
        class="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 shadow-2xl"
    >
        <StrokeRecorder />
    </div>

    <!-- Footer -->
    <footer class="mt-12 text-neutral-600 text-sm">
        Type letters A-Z to create stroke paths
    </footer>
</main>
