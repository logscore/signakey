// Export utilities for stroke paths

import type { StrokePoint } from '$lib/stores/stroke.svelte';

/**
 * Generate SVG string from points - black and white theme, no dots
 */
export function generateSvg(
    points: StrokePoint[],
    width: number,
    height: number,
    strokeColor: string = '#ffffff',
    strokeWidth: number = 3
): string {
    if (points.length < 2) {
        return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#000000"/>
</svg>`;
    }

    // Build path data
    let pathData = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        pathData += ` L ${points[i].x} ${points[i].y}`;
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#000000"/>
  <path d="${pathData}" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;
}

/**
 * Export as SVG file using File System Access API
 */
export async function exportAsSvg(
    points: StrokePoint[],
    width: number,
    height: number,
    filename: string = 'keystroke.svg'
) {
    try {
        const svgContent = generateSvg(points, width, height);
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });

        // Try to use File System Access API (opens save dialog)
        if ('showSaveFilePicker' in window) {
            const handle = await (window as any).showSaveFilePicker({
                suggestedName: filename,
                types: [
                    {
                        description: 'SVG Image',
                        accept: { 'image/svg+xml': ['.svg'] },
                    },
                ],
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
        } else {
            // Fallback for browsers without File System Access API
            fallbackDownload(blob, filename);
        }
    } catch (err: any) {
        // User cancelled the save dialog
        if (err.name === 'AbortError') return;
        console.error('Export failed:', err);
    }
}

/**
 * Fallback download for browsers without File System Access API
 */
function fallbackDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
