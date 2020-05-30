import * as config from "./config";
import { Drawing, Method, Quad, Region, Series, Tile } from "./map";
import schematic from "./schematic";

export interface DrawingInfo {
  title: string;
  subtitle: string;
  medium: string;
  date: string | null;
  number: string;
  diagram: number[][][][][];
  methods?: Method[];
  region?: Region;
}

const drawings: DrawingInfo[] = [
  {
    title: "Wall Drawing #1",
    subtitle: "Drawing Series II 14 (A & B)",
    medium: "Black pencil",
    date: "1968-10-01T07:00:00.000Z",
    number: "#1",
    diagram: [
      [
        [
          [
            [1, 0, 1, 13],
            [2, 0, 1, 13],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1A",
    subtitle: "Drawing Series II 14 (A & B)",
    medium: "Red, yellow, blue, and black pencil",
    date: "2002-01-01T08:00:00.000Z",
    number: "#1A",
    diagram: [
      [
        [
          [
            [1, 1, 1, 13],
            [2, 1, 1, 13],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #2",
    subtitle: "Drawing Series II (A) (24 drawings)",
    medium: "Black pencil",
    date: "1968-11-01T08:00:00.000Z",
    number: "#2",
    diagram: [
      [
        [0, 1, 2].map((r) => {
          return [0, 1, 2, 3, 4, 5, 6, 7].map((c) => {
            return [1, 0, 1, r * 8 + c];
          });
        }),
      ],
    ],
  },
  {
    title: "Wall Drawing #12",
    subtitle: "Drawing Series I 1 (A & B) and III 1 (A & B)",
    medium: "Black pencil",
    date: "1969-03-01T08:00:00.000Z",
    number: "#12",
    diagram: [
      [
        [
          [
            [1, 0, 0, 0],
            [2, 0, 0, 0],
          ],
          [
            [1, 0, 2, 0],
            [2, 0, 2, 0],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #12A",
    subtitle: "Drawing Series I 1 (A & B) and III 1 (A & B) (Color)",
    medium: "Red, yellow, blue, and black pencil",
    date: "1998-01-01T08:00:00.000Z",
    number: "#12A",
    diagram: [
      [
        [
          [
            [1, 1, 0, 0],
            [2, 1, 0, 0],
          ],
          [
            [1, 1, 2, 0],
            [2, 1, 2, 0],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #22",
    subtitle: "Drawing Series III 1 (A & B)",
    medium: "Black pencil",
    date: "1969-09-01T07:00:00.000Z",
    number: "#22",
    diagram: [
      [
        [
          [
            [1, 0, 2, 0],
            [2, 0, 2, 0],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #23",
    subtitle: "Drawing Series A on aluminum box. One series on each face",
    medium: "Black pencil, white painted aluminum box",
    date: "1969-09-01T07:00:00.000Z",
    number: "#23",
    diagram: [
      [0, 1, 2, 3].map((s) => {
        return [0, 1, 2, 3, 4, 5].map((r) => {
          return [0, 1, 2, 3].map((c) => {
            return [1, 0, s, c * 6 + r];
          });
        });
      }),
    ],
  },
  {
    title: "Wall Drawing #24",
    subtitle: "Drawing Series B on aluminum box. One series on each face",
    medium: "Black pencil, white painted aluminum box",
    date: "1969-09-01T07:00:00.000Z",
    number: "#24",
    diagram: [
      [0, 1, 2, 3].map((s) => {
        return [0, 1, 2, 3, 4, 5].map((r) => {
          return [0, 1, 2, 3].map((c) => {
            return [2, 0, s, c * 6 + r];
          });
        });
      }),
    ],
  },
  {
    title: "Wall Drawing #27",
    subtitle: "Drawing Series I 6 (A & B)",
    medium: "Black pencil",
    date: "1969-11-01T08:00:00.000Z",
    number: "#27",
    diagram: [
      [
        [
          [
            [1, 0, 0, 5],
            [2, 0, 0, 5],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #34",
    subtitle: "Drawing Series IV 16 (A & B)",
    medium: "Black pencil",
    date: "1969-06-01T07:00:00.000Z",
    number: "#34",
    diagram: [
      [
        [
          [
            [1, 0, 3, 15],
            [2, 0, 3, 15],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #413",
    subtitle: "Drawing Series IV (A) (24 Drawings)",
    medium: "India ink and color ink wash",
    date: "1984-03-01T08:00:00.000Z",
    number: "#413",
    diagram: [
      [
        [0, 1].map((r) => {
          return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((c) => {
            return [3, 1, 3, r * 12 + c]; // special method 3
          });
        }),
      ],
    ],
  },
  {
    title: "Wall Drawing #414",
    subtitle: "Drawing Series IV (B) (24 Drawings)",
    medium: "India ink wash",
    date: "1984-03-01T08:00:00.000Z",
    number: "#414",
    diagram: [
      [
        [0, 1].map((r) => {
          return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((c) => {
            return [3, 0, 3, r * 12 + c]; // special method 3
          });
        }),
      ],
    ],
  },
  {
    title: "Wall Drawing #949",
    subtitle: "Drawing Series III 18 (B)",
    medium: "Red, yellow, blue, and black pencil",
    date: "2000-08-01T07:00:00.000Z",
    number: "#949",
    diagram: [[[[[2, 1, 2, 17]]]]],
  },
  {
    title: "Wall Drawing #966",
    subtitle: "Drawing Series I 24 (B)",
    medium: "Black pencil",
    date: "2001-03-01T08:00:00.000Z",
    number: "#966",
    diagram: [[[[[2, 0, 0, 23]]]]],
  },
  {
    title: "Wall Drawing #967",
    subtitle: "Drawing Series I 24 (B)",
    medium: "Red, yellow, blue, and black pencil",
    date: "2001-03-01T08:00:00.000Z",
    number: "#967",
    diagram: [[[[[2, 1, 0, 23]]]]],
  },
  {
    title: "Wall Drawing #1001",
    subtitle: "Drawing Series III 19 (B)",
    medium: "Red, yellow, blue, and black pencil",
    date: "2001-09-01T07:00:00.000Z",
    number: "#1001",
    diagram: [[[[[2, 1, 2, 18]]]]],
  },
  {
    title: "Wall Drawing #1030",
    subtitle: "Drawing Series III 9 (A & B)",
    medium: "Black pencil",
    date: "2002-04-01T08:00:00.000Z",
    number: "#1030",
    diagram: [
      [
        [
          [
            [1, 0, 2, 8],
            [2, 0, 2, 8],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1031",
    subtitle: "Drawing Series III 9 (A & B)",
    medium: "Red, yellow, blue, and black pencil",
    date: "2002-04-01T08:00:00.000Z",
    number: "#1031",
    diagram: [
      [
        [
          [
            [1, 1, 2, 8],
            [2, 1, 2, 8],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1040",
    subtitle: "Drawing Series III 2 (A & B)",
    medium: "Black pencil",
    date: "2002-04-01T08:00:00.000Z",
    number: "#1040",
    diagram: [
      [
        [
          [
            [1, 0, 2, 1],
            [2, 0, 2, 1],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1041",
    subtitle: "Drawing Series III 2 (A & B)",
    medium: "Red, yellow, blue, and black pencil",
    date: "2002-04-01T08:00:00.000Z",
    number: "#1041",
    diagram: [
      [
        [
          [
            [1, 1, 2, 1],
            [2, 1, 2, 1],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1052",
    subtitle: "Drawing Series IV 24 (A & B)",
    medium: "Black pencil",
    date: "2002-07-01T07:00:00.000Z",
    number: "#1052",
    diagram: [
      [
        [
          [
            [1, 0, 3, 23],
            [2, 0, 3, 23],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1053",
    subtitle: "Drawing Series IV 24 (A & B)",
    medium: "Red, yellow, blue, and black pencil",
    date: "2002-07-01T07:00:00.000Z",
    number: "#1053",
    diagram: [
      [
        [
          [
            [1, 1, 3, 23],
            [2, 1, 3, 23],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1062",
    subtitle: "Drawing Series IV 2 (A & B)",
    medium: "Black pencil",
    date: "2003-01-01T08:00:00.000Z",
    number: "#1062",
    diagram: [
      [
        [
          [
            [1, 0, 3, 1],
            [2, 0, 3, 1],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1063",
    subtitle: "Drawing Series IV 2 (A & B)",
    medium: "Red, yellow, blue, and black pencil",
    date: "2003-01-01T08:00:00.000Z",
    number: "#1063",
    diagram: [
      [
        [
          [
            [1, 1, 3, 1],
            [2, 1, 3, 1],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1085",
    subtitle: "Drawing Series I-IV 1-24 (A & B) (Composite)",
    medium: "Black pencil",
    date: "2003-05-01T07:00:00.000Z",
    number: "#1085",
    diagram: [
      [0, 1, 2, 3, 4, 5, 6, 7].map((s) => {
        return [0, 1, 2, 3].map((r) => {
          return [0, 1, 2, 3, 4, 5].map((c) => {
            return [s < 4 ? 1 : 2, 1, s < 4 ? s : s - 4, r * 6 + c];
          });
        });
      }),
    ],
  },
  {
    title: "Wall Drawing #1107",
    subtitle: "Drawing Series III 12 (A & B)",
    medium: "Black pencil",
    date: "2003-10-01T07:00:00.000Z",
    number: "#1107",
    diagram: [
      [
        [
          [
            [1, 0, 2, 11],
            [2, 0, 2, 11],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1108",
    subtitle: "Drawing Series III 12 (A & B)",
    medium: "Red, yellow, blue, and black pencil",
    date: "2003-10-01T07:00:00.000Z",
    number: "#1108",
    diagram: [
      [
        [
          [
            [1, 1, 2, 11],
            [2, 1, 2, 11],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1164",
    subtitle: "Drawing Series I 2 (A & B)",
    medium: "Black pencil",
    date: "2005-07-01T07:00:00.000Z",
    number: "#1164",
    diagram: [
      [
        [
          [
            [1, 0, 0, 1],
            [2, 0, 0, 1],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1165",
    subtitle: "Drawing Series I 2 (A & B)",
    medium: "Red, yellow, blue, and black pencil",
    date: "2005-07-01T07:00:00.000Z",
    number: "#1165",
    diagram: [
      [
        [
          [
            [1, 1, 0, 1],
            [2, 1, 0, 1],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1169",
    subtitle: "Drawing Series II 6 (A & B)",
    medium: "Black pencil",
    date: "2005-07-01T07:00:00.000Z",
    number: "#1169",
    diagram: [
      [
        [
          [
            [1, 0, 1, 5],
            [2, 0, 1, 5],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1170",
    subtitle: "Drawing Series II 6 (A & B)",
    medium: "Red, yellow, blue, and black pencil",
    date: "2005-07-01T07:00:00.000Z",
    number: "#1170",
    diagram: [
      [
        [
          [
            [1, 1, 1, 5],
            [2, 1, 1, 5],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1172",
    subtitle: "Drawing Series I 14 (A & B)",
    medium: "Red, yellow, blue, and black pencil",
    date: "2005-08-01T07:00:00.000Z",
    number: "#1172",
    diagram: [
      [
        [
          [
            [1, 1, 0, 13],
            [2, 1, 0, 13],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1194",
    subtitle: "Drawing Series III 21 (A & B)",
    medium: "Red, yellow, blue, and black pencil",
    date: "2005-10-01T07:00:00.000Z",
    number: "#1194",
    diagram: [
      [
        [
          [
            [1, 1, 2, 20],
            [2, 1, 2, 20],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1199",
    subtitle: "Drawing Series IV 14 (A)",
    medium: "Black pencil",
    date: "2006-02-01T08:00:00.000Z",
    number: "#1199",
    diagram: [[[[[1, 0, 3, 13]]]]],
  },
  {
    title: "Wall Drawing #1200",
    subtitle: "Drawing Series IV 14 (A)",
    medium: "Red, yellow, blue, and black pencil",
    date: "2006-02-01T08:00:00.000Z",
    number: "#1200",
    diagram: [[[[[1, 1, 3, 13]]]]],
  },
  {
    title: "Wall Drawing #1205",
    subtitle: "Drawing Series I 5 (A & B)",
    medium: "Black pencil",
    date: "2006-04-01T08:00:00.000Z",
    number: "#1205",
    diagram: [
      [
        [
          [
            [1, 0, 0, 4],
            [2, 0, 0, 4],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1206",
    subtitle: "Drawing Series I 5 (A & B)",
    medium: "Red, yellow, blue, and black pencil",
    date: "2006-04-01T08:00:00.000Z",
    number: "#1206",
    diagram: [
      [
        [
          [
            [1, 1, 0, 4],
            [2, 1, 0, 4],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1207",
    subtitle: "Drawing Series II 1 (A & B)",
    medium: "Black pencil",
    date: "2006-05-01T07:00:00.000Z",
    number: "#1207",
    diagram: [
      [
        [
          [
            [1, 0, 1, 0],
            [2, 0, 1, 0],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1211",
    subtitle: "Drawing Series I-IV 1-24 (A & B) (Composite)",
    medium: "Red, yellow, blue, and black pencil",
    date: "2006-08-01T07:00:00.000Z",
    number: "#1211",
    diagram: [
      [0, 1, 2, 3, 4, 5, 6, 7].map((s) => {
        return [0, 1, 2, 3].map((r) => {
          return [0, 1, 2, 3, 4, 5].map((c) => {
            return [s < 4 ? 1 : 2, 1, s < 4 ? s : s - 4, r * 6 + c];
          });
        });
      }),
    ],
  },
  {
    title: "Wall Drawing #1219",
    subtitle: "Drawing Series I 8 (A & B)",
    medium: "Black pencil",
    date: "2007-01-01T08:00:00.000Z",
    number: "#1219",
    diagram: [
      [
        [
          [
            [1, 0, 0, 7],
            [2, 0, 0, 7],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1220",
    subtitle: "Drawing Series I 8 (A & B)",
    medium: "Red, yellow, blue, and black pencil",
    date: "2007-01-01T08:00:00.000Z",
    number: "#1220",
    diagram: [
      [
        [
          [
            [1, 1, 0, 7],
            [2, 1, 0, 7],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1224",
    subtitle: "Drawing Series I 13 (A & B)",
    medium: "Black pencil",
    date: "2007-01-01T08:00:00.000Z",
    number: "#1224",
    diagram: [
      [
        [
          [
            [1, 0, 0, 12],
            [2, 0, 0, 12],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1225",
    subtitle: "Drawing Series I 13 (A & B)",
    medium: "Red, yellow, blue, and black pencil",
    date: "2007-01-01T08:00:00.000Z",
    number: "#1225",
    diagram: [
      [
        [
          [
            [1, 1, 0, 12],
            [2, 1, 0, 12],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1228",
    subtitle: "Drawing Series II 17 (A & B)",
    medium: "Black pencil",
    date: "2007-03-01T08:00:00.000Z",
    number: "#1228",
    diagram: [
      [
        [
          [
            [1, 0, 1, 16],
            [2, 0, 1, 16],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1229",
    subtitle: "Drawing Series II 17 (A & B)",
    medium: "Red, yellow, blue, and black pencil",
    date: "2007-03-01T08:00:00.000Z",
    number: "#1229",
    diagram: [
      [
        [
          [
            [1, 1, 1, 16],
            [2, 1, 1, 16],
          ],
        ],
      ],
    ],
  },
  {
    title: "Wall Drawing #1276",
    subtitle: "Drawing Series II 15 (A & B)",
    medium: "Red, yellow, blue, and black pencil",
    date: null,
    number: "#1276",
    diagram: [
      [
        [
          [
            [1, 1, 1, 14],
            [2, 1, 1, 14],
          ],
        ],
      ],
    ],
  },
];

// Sort "1A" and "2B" correctly
drawings.sort((a, b) => {
  const aMatch = a.number.toString().match(/(\d+?)(\D+?)/);
  const aNum = aMatch ? parseInt(aMatch[1]) : parseInt(a.number);
  const aStr = aMatch ? aMatch[2] : null;

  const bMatch = b.number.toString().match(/(\d+?)(\D+?)/);
  const bNum = bMatch ? parseInt(bMatch[1]) : parseInt(b.number);
  const bStr = bMatch ? bMatch[2] : null;

  if (aNum == bNum && aStr && bStr) {
    return aStr.localeCompare(bStr);
  }

  return aNum - bNum;
});

// Build a data object that's the same schema as the map file.
export const data: DrawingInfo[] = [];
for (let wd = 0; wd < drawings.length; wd++) {
  const wallDrawing: DrawingInfo = Object.assign({}, drawings[wd]);
  delete wallDrawing.diagram;
  wallDrawing.methods = [];
  data.push(wallDrawing);

  const diagram = drawings[wd].diagram[0];
  for (let m = 0; m < diagram.length; m++) {
    const method = new Method();
    method.x =
      m *
        (diagram[0][0].length * config.drawingSize +
          (diagram[0][0].length - 1) * config.drawingGap) +
      m * config.methodGap;
    method.y = 0;
    method.l = method.x;
    method.t = method.y;
    method.r =
      method.l +
      diagram[0][0].length * config.drawingSize +
      (diagram[0][0].length - 1) * config.drawingGap;
    method.b =
      method.t +
      diagram[0].length * config.drawingSize +
      (diagram[0].length - 1) * config.drawingGap;
    method.series = [];
    wallDrawing.methods.push(method);

    if (drawings[wd].number === "#1211") {
      const { y, t, b, x, l, r } = method;
      // console.log("method", m, { y, t, b, x, l, r });
    }

    for (let s = 0; s < diagram[m].length; s++) {
      const series = new Series();
      series.x = 0;
      series.y = s * (config.drawingSize + config.drawingGap);
      series.l = method.l + series.x;
      series.t = method.t + series.y;
      series.r = method.r;
      series.b = series.t + config.drawingSize;
      series.drawings = [];
      method.series.push(series);

      if (drawings[wd].number === "#1211") {
        const { y, t, b, x, l, r } = series;
        // console.log("series", s, { y, t, b, x, l, r });
      }

      for (let d = 0; d < diagram[m][s].length; d++) {
        const [dm, dc, ds, dd] = diagram[m][s][d];

        const drawing = new Drawing();
        drawing.x = d * (config.drawingSize + config.drawingGap);
        drawing.y = 0;
        drawing.l = series.l + drawing.x;
        drawing.t = series.t + drawing.y;
        drawing.r = drawing.l + config.drawingSize;
        drawing.b = drawing.t + config.drawingSize;
        drawing.method = dm;
        drawing.series = ds;
        drawing.color = dc;
        drawing.drawing = dd;
        drawing.quads = [];
        series.drawings.push(drawing);

        if (drawings[wd].number === "#1211") {
          const { y, t, b, x, l, r } = drawing;
          // console.log("drawing", d, { y, t, b, x, l, r });
        }

        const quads = schematic[ds][dd];
        for (let q = 0; q < quads.length; q++) {
          const quad = new Quad();
          quad.x = (config.quadSize + config.quadGap) * (q % 2);
          quad.y = (config.quadSize + config.quadGap) * Math.floor(q / 2);
          quad.l = drawing.l + quad.x;
          quad.t = drawing.t + quad.y;
          quad.r = quad.l + config.quadSize;
          quad.b = quad.t + config.quadSize;
          quad.tiles = [];
          drawing.quads.push(quad);

          if (drawings[wd].number === "#1211") {
            const { y, t, b, x, l, r } = quad;
            // console.log("quad", q, { y, t, b, x, l, r });
          }

          for (let t = 0; t < quads[q].length; t++) {
            const tile = new Tile();
            tile.dir = quads[q][t];
            tile.x = config.tileSize * (t % 2);
            tile.y = config.tileSize * Math.floor(t / 2);
            tile.l = quad.l + tile.x;
            tile.t = quad.t + tile.y;
            tile.r = tile.l + config.tileSize;
            tile.b = tile.t + config.tileSize;
            quad.tiles.push(tile);

            if (drawings[wd].number === "#1211") {
              const { y, t, b, x, l, r } = tile;
              // console.log("tile", t, { y, t, b, x, l, r });
            }
          }
        }
      }
    }
  }

  wallDrawing.region = {
    x: 0,
    y: 0,
    l: 0,
    t: 0,
    b: Math.max(...wallDrawing.methods.map((m) => m.b)),
    r: Math.max(...wallDrawing.methods.map((m) => m.r)),
  };
}

export default drawings;
