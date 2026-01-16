<script lang="ts">
    import type { StrokePoint } from "$lib/stores/stroke.svelte";

    interface Props {
        points: StrokePoint[];
        width: number;
        height: number;
    }

    let { points, width, height }: Props = $props();

    // Build SVG path data
    let pathData = $derived.by(() => {
        if (points.length < 1) return "";

        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            d += ` L ${points[i].x} ${points[i].y}`;
        }
        return d;
    });
</script>

<svg
    {width}
    {height}
    viewBox="0 0 {width} {height}"
    class="absolute inset-0 pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
>
    {#if points.length > 0}
        <path
            d={pathData}
            stroke="#ffffff"
            stroke-width="3"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    {/if}
</svg>
