import * as config from "./config";
import schematic from "./schematic";

export const methods = 6;
export const seriesPerMethod = 4;
export const drawingsPerSeries = 24;

// Whether methods are rendered as b,b,b,c,c,c (false) or b,c,b,c,b,c (true).
export const alternateMethods = false;

export const drawingCols = 6;
export const drawingRows = drawingsPerSeries / drawingCols;

export const seriesSize = {
  w: config.drawingSize * drawingCols + config.drawingGap * (drawingCols - 1),
  h: config.drawingSize * drawingRows + config.drawingGap * (drawingRows - 1),
};

export const seriesCols = 2;
export const seriesRows = seriesPerMethod / seriesCols;

export const methodSize = {
  w: seriesSize.w * seriesCols + config.seriesGap * (seriesCols - 1),
  h: seriesSize.h * seriesRows + config.seriesGap * (seriesRows - 1),
};

export const methodCols = 3;
export const methodRows = methods / methodCols;

export const mapSize = {
  w: methodSize.w * methodCols + config.methodGap * (methodCols - 1),
  h: methodSize.h * methodRows + config.methodGap * (methodRows - 1),
};

export class Region {
  x!: number;
  y!: number;
  l!: number;
  t!: number;
  r!: number;
  b!: number;
}

export class Method extends Region {
  method!: number;
  color!: number;
  series!: Series[];
}

export class Series extends Region {
  drawings!: Drawing[];
}

export class Drawing extends Region {
  quads!: Quad[];
  method?: number;
  series?: number;
  color?: number;
  drawing?: number;
}

export class Quad extends Region {
  tiles!: Tile[];
}

export class Tile extends Region {
  dir!: number;
}

export const data: Method[] = [];
for (let m = 0; m < methods; m++) {
  const method = new Method();

  if (alternateMethods) {
    method.method = Math.floor(m / 2);
    method.color = m % 2 ? 1 : 0;
  } else {
    method.method = m % 3;
    method.color = Math.floor(m / 3) ? 1 : 0;
  }

  method.x = (methodSize.w + config.methodGap) * (m % methodCols);
  method.y = (methodSize.h + config.methodGap) * Math.floor(m / methodCols);
  method.l = method.x;
  method.t = method.y;
  method.r = method.l + methodSize.w;
  method.b = method.t + methodSize.h;
  method.series = [];
  data.push(method);

  for (let s = 0; s < schematic.length; s++) {
    const series = new Series();
    series.x = (seriesSize.w + config.seriesGap) * (s % seriesCols);
    series.y = (seriesSize.h + config.seriesGap) * Math.floor(s / seriesCols);
    series.l = method.l + series.x;
    series.t = method.t + series.y;
    series.r = series.l + seriesSize.w;
    series.b = series.t + seriesSize.h;
    series.drawings = [];
    method.series.push(series);

    for (let d = 0; d < schematic[s].length; d++) {
      const drawing = new Drawing();
      drawing.x = (config.drawingSize + config.drawingGap) * (d % drawingCols);
      drawing.y =
        (config.drawingSize + config.drawingGap) * Math.floor(d / drawingCols);
      drawing.l = series.l + drawing.x;
      drawing.t = series.t + drawing.y;
      drawing.r = drawing.l + config.drawingSize;
      drawing.b = drawing.t + config.drawingSize;
      drawing.quads = [];
      series.drawings.push(drawing);

      for (let q = 0; q < schematic[s][d].length; q++) {
        const quad = new Quad();
        quad.x = (config.quadSize + config.quadGap) * (q % 2);
        quad.y = (config.quadSize + config.quadGap) * Math.floor(q / 2);
        quad.l = drawing.l + quad.x;
        quad.t = drawing.t + quad.y;
        quad.r = quad.l + config.quadSize;
        quad.b = quad.t + config.quadSize;
        quad.tiles = [];

        drawing.quads.push(quad);

        for (let t = 0; t < schematic[s][d][q].length; t++) {
          const tile = new Tile();
          tile.dir = schematic[s][d][q][t];
          tile.x = config.tileSize * (t % 2);
          tile.y = config.tileSize * Math.floor(t / 2);
          tile.l = quad.l + tile.x;
          tile.t = quad.t + tile.y;
          tile.r = tile.l + config.tileSize;
          tile.b = tile.t + config.tileSize;
          quad.tiles.push(tile);
        }
      }
    }
  }
}
