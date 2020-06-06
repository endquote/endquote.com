const start = Date.now();

const fs = require("fs-extra");
const path = require("path");
const util = require("util");
const childProcess = require("child_process");
const readdir = require("recursive-readdir");

// set up SVG.js
const { createSVGWindow } = require("svgdom");
const window = createSVGWindow();
const document = window.document;
const { SVG, registerWindow } = require("@svgdotjs/svg.js");

// register window and document
registerWindow(window, document);
const SVGO = require("svgo");

const svg2img = require("svg2img");
fs.outputFile = util.promisify(fs.outputFile);

// Appearance
const strokeWidth = 1;
const colors = ["#000", "#ff0", "#f00", "#00f"];

// Data
const map = JSON.parse(fs.readFileSync("temp/map.json"));
const config = JSON.parse(fs.readFileSync("temp/config.json"));
const drawings = JSON.parse(fs.readFileSync("temp/drawings.json"));
const symbols = {};

// You should be able to pass a config objet to SVGO(), but I can't get it to work...
const svgo = new SVGO();
svgo.config.plugins.forEach((p) =>
  p.forEach((p) => {
    if (
      p.name === "prefixIds" ||
      p.name === "collapseGroups" ||
      p.name === "moveGroupAttrsToElems"
    ) {
      p.active = false;
    }
  })
);

const outDir = path.join(__dirname, "../tiles");

async function buildMap() {
  const svg = buildNode();

  buildMapBg(svg);

  for (let m = 0; m < map.data.length; m++) {
    const method = map.data[m];
    const colorFile = method.color ? "c" : "b";
    const methodNode = svg.group();
    methodNode.translate(method.x, method.y);
    buildMethodBg(methodNode);

    for (let s = 0; s < method.series.length; s++) {
      const series = method.series[s];
      const seriesNode = methodNode.group();
      seriesNode.translate(series.x, series.y);
      buildSeriesBg(seriesNode);

      for (let d = 0; d < series.drawings.length; d++) {
        const drawing = series.drawings[d];
        const drawingNode = seriesNode.group();
        drawingNode.translate(drawing.x, drawing.y);
        buildDrawingBg(drawingNode);
        buildDrawing(drawingNode, drawing, method.method, method.color);

        const drawingFile = `map/custom/${method.method}/${s}/${d}/${colorFile}`;
        await writeNode(
          drawingNode,
          config.drawingSize,
          drawingFile,
          true,
          true
        );
      }

      const seriesFile = `map/custom/${method.method}/${s}/${colorFile}`;
      await writeNode(seriesNode, map.seriesSize, seriesFile, false, false);
    }

    const methodFile = `map/custom/${method.method}/${colorFile}`;
    await writeNode(methodNode, map.methodSize, methodFile, false, false);
  }

  await writeNode(svg, map.mapSize, "map/custom/map", false, true);
}

async function buildDrawings() {
  for (let wd = 0; wd < drawings.data.length; wd++) {
    const wallDrawing = drawings.data[wd];
    const wallDrawingNode = buildNode();

    const size = { w: wallDrawing.region.r, h: wallDrawing.region.b };
    wallDrawingNode.rect(size.w, size.h).fill("#FFF");

    for (let m = 0; m < wallDrawing.methods.length; m++) {
      const method = wallDrawing.methods[m];
      const methodNode = wallDrawingNode.group();
      methodNode.translate(method.x, method.y);

      for (let s = 0; s < method.series.length; s++) {
        const series = method.series[s];
        const seriesNode = methodNode.group();
        seriesNode.translate(series.x, series.y);

        for (let d = 0; d < series.drawings.length; d++) {
          const drawing = series.drawings[d];
          const drawingNode = seriesNode.group();
          drawingNode.translate(drawing.x, drawing.y);
          buildDrawing(drawingNode, drawing, drawing.method, drawing.color);
        }
      }
    }

    const file = `drawings/${wallDrawing.number}/${wallDrawing.number}`;
    await writeNode(wallDrawingNode, size, file, false, true);
  }
}

// Build a file with the same quad rendered in each of the six methods.
async function buildMethodSample() {
  const d = map.density;
  map.density = 12;

  const node = buildNode();
  const quad = map.data[0].series[0].drawings[0].quads[0];

  buildQuad(buildQuadBg(node.group().attr("class", "m m0b")), quad, 0, false);
  buildQuad(buildQuadBg(node.group().attr("class", "m m0c")), quad, 0, true);
  buildQuad(buildQuadBg(node.group().attr("class", "m m1b")), quad, 1, false);
  buildQuad(buildQuadBg(node.group().attr("class", "m m1c")), quad, 1, true);
  buildQuad(buildQuadBg(node.group().attr("class", "m m2b")), quad, 2, false);
  buildQuad(buildQuadBg(node.group().attr("class", "m m2c")), quad, 2, true);

  await writeNode(node, config.quadSize, "samples/methods", true);

  map.density = d;
}

function buildMapBg(mapNode) {
  const key = "bg";
  if (!symbols[key]) {
    symbols[key] = buildNode()
      .rect(map.mapSize.w, map.mapSize.h)
      .fill("#FFF")
      .attr("id", key);
  }

  mapNode.use(symbols[key]);
  return mapNode;
}

function buildSeriesBg(seriesNode) {
  const key = "bgs";
  if (!symbols[key]) {
    symbols[key] = buildNode()
      .rect(map.seriesSize.w, map.seriesSize.h)
      .fill("#FFF")
      .attr("id", key);
  }

  seriesNode.use(symbols[key]);
  return seriesNode;
}

function buildMethodBg(methodNode) {
  const key = "bgm";
  if (!symbols[key]) {
    symbols[key] = buildNode()
      .rect(map.methodSize.w, map.methodSize.h)
      .fill("#FFF")
      .attr("id", key);
  }

  methodNode.use(symbols[key]);
  return methodNode;
}

function buildDrawingBg(drawingNode) {
  const key = "bgd";
  if (!symbols[key]) {
    symbols[key] = buildNode()
      .rect(map.drawingSize, map.drawingSize)
      .fill("#FFF")
      .attr("id", key);
  }

  drawingNode.use(symbols[key]);
  return drawingNode;
}

function buildQuadBg(quadNode) {
  const key = "bgq";
  if (!symbols[key]) {
    symbols[key] = buildNode()
      .rect(map.quadSize, map.quadSize)
      .fill("#FFF")
      .attr("id", key);
  }

  quadNode.use(symbols[key]);
  return quadNode;
}

function buildDrawing(drawingNode, drawing, method, color) {
  for (let q = 0; q < drawing.quads.length; q++) {
    const quad = drawing.quads[q];
    const quadNode = drawingNode.group();
    quadNode.translate(quad.x, quad.y);
    buildQuadBg(quadNode);
    buildQuad(quadNode, quad, method, color);
  }

  return drawingNode;
}

function buildQuad(quadNode, quad, method, color) {
  for (let t = 0; t < quad.tiles.length; t++) {
    const tile = quad.tiles[t];
    const tileNode = quadNode.group();
    tileNode.translate(tile.x, tile.y);

    if (method === 0) {
      buildTileNumber(tileNode, tile.dir, color);
    } else if (method === 1) {
      buildTileLines(tileNode, tile.dir, color);
    } else if (method === 2) {
      for (let i = 1; i <= tile.dir; i++) {
        buildTileLines(tileNode, i, color);
      }
    } else if (method === 3) {
      buildTileWash(tileNode, tile.dir, color);
    }
    buildTileBorder(tileNode);
  }

  return quadNode;
}

function buildTileBorder(tileNode) {
  const key = "bt";
  if (!symbols[key]) {
    symbols[key] = buildNode()
      .rect(config.tileSize, config.tileSize)
      .stroke({ color: colors[0], width: strokeWidth * 2 })
      .fill("none")
      .attr("id", key);
  }

  tileNode.use(symbols[key]);
  return tileNode;
}

function buildTileNumber(tileNode, direction, color) {
  const key = `n${direction}`;
  if (!symbols[key]) {
    symbols[key] = buildNode()
      .plain(`${direction}`)
      .move(config.tileSize / 2, config.tileSize * 0.65)
      .font({
        size: config.tileSize * 0.75,
        leading: 0,
        family: "sans-serif",
        anchor: "middle",
      })
      .attr("id", key);
  }

  tileNode.use(symbols[key]).fill(color ? colors[direction - 1] : colors[0]);
  return tileNode;
}

function buildTileLines(tileNode, direction, color) {
  const stroke = {
    width: strokeWidth,
    color: color ? colors[direction - 1] : colors[0],
  };

  const key = `l${direction}`;
  if (symbols[key]) {
    tileNode.use(symbols[key]).stroke(stroke);
    return tileNode;
  }

  const node = buildNode();

  const d = config.density;
  const g = config.tileSize / config.density;
  const s = config.tileSize;

  if (direction === 1) {
    // |
    for (let i = 1; i <= d; i++) {
      node.line(g * i, 0, g * i, s);
    }
  }

  if (direction === 2) {
    // -
    for (let i = 1; i <= d; i++) {
      node.line(0, g * i, s, g * i);
    }
  }

  if (direction === 3) {
    // /
    for (let i = 1; i <= d; i++) {
      node.line(0, g * i, g * i, 0);
    }
    for (let i = 1; i <= d - 1; i++) {
      node.line(g * i, s, s, g * i);
    }
  }

  if (direction === 4) {
    // \
    for (let i = 0; i < d; i++) {
      node.line(0, g * i, s - g * i, s);
    }
    for (let i = 1; i <= d - 1; i++) {
      node.line(g * i, 0, s, s - g * i);
    }
  }

  node.attr("id", key);
  symbols[key] = node;
  return buildTileLines(tileNode, direction, color);
}

// Drawings 413/414 have special India ink washes.
const washes = [
  ["#cac7c1", "#b9b7b0", "#9d978d", "#79736a"], // grays
  ["#d6d8d7", "#f3cd44", "#dc6c85", "#65bedf"], // colors
];

function buildTileWash(tileNode, direction, color) {
  const key = "wash";
  if (!symbols[key]) {
    symbols[key] = buildNode()
      .rect(config.tileSize, config.tileSize)
      .attr("id", key);
  }

  tileNode.use(symbols[key]).fill(washes[color][direction - 1]);
  return tileNode;
}

async function writeNode(svg, size, file, writeSvg, writePng) {
  // Size can be a number or object
  size = size.w ? size : { w: size, h: size };

  // Clone the element and size it for embedded use
  svg = SVG().add(svg.svg());
  svg.viewbox(0, 0, size.w, size.h);
  svg.first().attr("transform", null);

  // Add symbols
  const refs = Array.from(
    new Set(svg.find("use").map((u) => u.attr("href").substr(1)))
  );
  refs.forEach((k) => svg.defs().add(symbols[k]));
  svg.add(svg.defs());

  // Render SVG
  if (writeSvg) {
    console.log(`${file}.svg`);
    // Convert to XML
    let xml = svg.svg();
    // Remove extra namespaces
    xml = xml.replace(/xmlns:.*?".*?"\s/g, "");
    // Remove special data attributes
    xml = xml.replace(/\ssvgjs\:data="[^"]+"/g, "");
    // Optimize https://github.com/svg/svgo
    xml = (await svgo.optimize(xml)).data;
    // Write optimized SVG.
    await fs.outputFile(path.join(outDir, `${file}.svg`), xml);
  }

  if (writePng) {
    console.log(`${file}.png`);
    // Can't rasterize SVG with symbols, so replace all of the <use> with their references.
    svg.defs().clear();
    svg.find("use").forEach((u) => {
      const attrs = u.attr();
      const key = attrs["href"].substr(1);
      delete attrs.href;
      const symbol = symbols[key].clone();
      symbol.attr("id", null);
      Object.keys(attrs).forEach((k) => symbol.attr(k, attrs[k]));
      u.replace(symbol);
    });
    xml = svg.svg();

    // Render PNG from SVG

    await new Promise((resolve, reject) => {
      svg2img(xml, { width: size.w, height: size.h }, async (error, buffer) => {
        if (error) {
          reject();
        } else {
          await fs.outputFile(path.join(outDir, `${file}.png`), buffer);
          resolve();
        }
      });
    });
  }
}

function buildNode() {
  const node = document.createElement("svg");
  document.documentElement.appendChild(node);
  return SVG(node).group();
}

async function buildMapZoom() {
  await buildZoomifyTiles(
    `${outDir}/map/custom/map.png`,
    `${outDir}/map/zoomify`
  );
}

async function buildDrawingsZoom() {
  for (let i = 0; i < drawings.data.length; i++) {
    const d = drawings.data[i];
    await buildZoomifyTiles(
      `${outDir}/drawings/${d.number}/${d.number}.png`,
      `${outDir}/drawings/${d.number}`
    );
  }
}

async function buildZoomifyTiles(inPath, outPath) {
  const cmd = `php zoomify.php ${inPath} ${outPath}`;
  console.log(`zoomify-ing - ${cmd}`);
  const res = childProcess.execSync(cmd, {
    cwd: path.join(__dirname, "zoomify"),
  });
  console.log(res.toString());
}

async function convertMapZoom() {
  await convertPngTiles(path.join(outDir, "map/zoomify"));
}

async function convertDrawingsZoom() {
  for (let i = 0; i < drawings.data.length; i++) {
    const d = drawings.data[i];
    await convertPngTiles(path.join(outDir, `drawings/${d.number}`));
  }
}

async function convertPngTiles(dir) {
  console.log("converting zoomify tiles to jpg");
  let files = await readdir(dir);
  files = files
    .map((f) => path.parse(f))
    .filter((f) => f.dir.indexOf("TileGroup") !== -1);
  const pngLevel = Math.max(
    ...files.map((f) => parseInt(f.name.split("-")[0]))
  );
  const convertMatch = new RegExp(`^[0-${pngLevel - 1}]-.*\.png`);
  files.forEach((file) => {
    const parts = convertMatch.exec(file.base);
    if (!parts) {
      return;
    }
    const path = `${file.dir}/${file.name}`;
    const cmd = `magick convert -verbose -quality 85% "${path}.png" "${path}.jpg"`;
    console.log(cmd);
    const res = childProcess.execSync(cmd);
    console.log(res.toString());
    fs.unlinkSync(`${path}.png`);
  });
}

async function optimizePngs() {
  console.log("optimizing png tiles");
  const files = await readdir(path.join(outDir));
  files.forEach((file) => {
    const parts = file.match(/^.*\.png/);
    if (!parts || !parts[0]) {
      return;
    }
    const cmd = `pngcrush -ow -q "${parts[0]}"`;
    console.log(cmd);
    const res = childProcess.execSync(cmd);
    console.log(res.toString());
  });
}

async function go() {
  const mode = process.argv[2] || "all";

  if (mode === "all" || mode === "drawings") {
    await buildDrawings();
  }
  if (mode === "all" || mode === "drawingszoom") {
    await buildDrawingsZoom();
  }
  if (mode === "all" || mode === "drawingsconvert") {
    await convertDrawingsZoom();
  }

  if (mode === "all" || mode === "map") {
    await buildMap();
  }
  if (mode === "all" || mode === "mapzoom") {
    await buildMapZoom();
  }
  if (mode === "all" || mode === "mapconvert") {
    await convertMapZoom();
  }

  if (mode === "all" || mode === "sample") {
    await buildMethodSample();
  }

  if (mode === "all" || mode === "optimize") {
    await optimizePngs();
  }

  console.log(Math.round((Date.now() - start) / 1000) + " seconds");
}

go();
