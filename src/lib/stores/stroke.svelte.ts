// Stroke recording state using Svelte 5 runes

import { getKeyPixelPosition, isValidKey, normalizeKey } from '$lib/keyboard';

export interface StrokePoint {
    key: string;
    x: number;
    y: number;
    timestamp: number;
}

// Create a stroke store with runes
function createStrokeStore() {
    let points = $state<StrokePoint[]>([]);
    let activeKey = $state<string | null>(null);
    let keySize = $state(60);
    let keyGap = $state(6);
    let offsetX = $state(0);
    let offsetY = $state(0);

    // Timeout for key highlight
    let highlightTimeout: ReturnType<typeof setTimeout> | null = null;

    function addPoint(key: string) {
        if (!isValidKey(key)) return;

        const normalized = normalizeKey(key);
        const position = getKeyPixelPosition(normalized, keySize, keyGap, offsetX, offsetY);

        if (!position) return;

        const point: StrokePoint = {
            key: normalized,
            x: position.x,
            y: position.y,
            timestamp: Date.now(),
        };

        points = [...points, point];

        // Set active key for highlight
        activeKey = normalized;

        // Clear previous timeout
        if (highlightTimeout) {
            clearTimeout(highlightTimeout);
        }

        // Remove highlight after 150ms
        highlightTimeout = setTimeout(() => {
            activeKey = null;
        }, 150);
    }

    function reset() {
        points = [];
        activeKey = null;
    }

    function updateLayout(size: number, gap: number, ox: number, oy: number) {
        keySize = size;
        keyGap = gap;
        offsetX = ox;
        offsetY = oy;

        // Recalculate all point positions
        points = points.map(p => {
            const position = getKeyPixelPosition(p.key, keySize, keyGap, offsetX, offsetY);
            if (!position) return p;
            return { ...p, x: position.x, y: position.y };
        });
    }

    return {
        get points() { return points; },
        get activeKey() { return activeKey; },
        get keySize() { return keySize; },
        get keyGap() { return keyGap; },
        addPoint,
        reset,
        updateLayout,
    };
}

export const strokeStore = createStrokeStore();
