// Number of gaps between lines in a tile.
export const density = 18;

export const tileSize = 120;
export const quadSize = tileSize * 2;

export const quadGap = 5; // (size / density) * 2;
export const drawingSize = quadSize * 2 + quadGap;

export const drawingGap = quadGap * 5;
export const seriesGap = drawingGap * 2;
export const methodGap = seriesGap * 2;
