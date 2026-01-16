<script lang="ts">
    import type { StrokePoint } from "$lib/stores/stroke.svelte";
    import { onMount } from "svelte";

    interface Props {
        points: StrokePoint[];
        width: number;
        height: number;
    }

    let { points, width, height }: Props = $props();

    let canvas: HTMLCanvasElement;
    let ratio = 1;

    onMount(() => {
        ratio = window.devicePixelRatio || 1;
    });

    // Redraw when points or dimensions change
    $effect(() => {
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size for retina displays
        const canvasWidth = width * ratio;
        const canvasHeight = height * ratio;

        // Only resize if needed
        if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
        }

        // Reset transform and clear
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        ctx.clearRect(0, 0, width, height);

        if (points.length < 1) return;

        // Draw stroke path - white color
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }

        ctx.stroke();

        // Draw dots at each point - white color
        ctx.fillStyle = "#ffffff";
        for (const point of points) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    export function getCanvas(): HTMLCanvasElement {
        return canvas;
    }
</script>

<canvas bind:this={canvas} class="absolute inset-0 pointer-events-none"
></canvas>
