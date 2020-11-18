import { Map, View } from "ol";
import { boundingExtent, buffer, getCenter } from "ol/extent";
import TileLayer from "ol/layer/Tile";
import { Size } from "ol/size";
import Zoomify from "ol/source/Zoomify";
import {
  FC,
  MouseEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ResizeObserver from "resize-observer-polyfill";
import * as config from "./data/config";
import { data, mapSize, Region } from "./data/map";
import { DrawingLocation } from "./DrawingExplorer.jsx";
import css from "./DrawingMap.module.scss";

const layer = new TileLayer({
  source: new Zoomify({
    tileSize: 256,
    tilePixelRatio: 1,
    url: `/posts/drawing_series/tiles/map/zoomify/`,
    size: [mapSize.w, mapSize.h],
    crossOrigin: "anonymous",
  }),
});

const mapExtent = buffer(
  [0, -mapSize.h, mapSize.w, 0],
  Math.max(mapSize.h, mapSize.w) * 0.5
);

const resolutions = layer.getSource().getTileGrid().getResolutions();

const view = new View({
  minResolution: resolutions[resolutions.length - 1],
  maxResolution: resolutions[0],
  extent: mapExtent,
  zoom: 5,
  center: getCenter(mapExtent),
  enableRotation: false,
});

// Patch tileUrlFunction to return PNGs at the max zoom.
// @ts-ignore getTileUrlFunction isn't in the types
const defaultTileUrlFunction = layer.getSource().getTileUrlFunction();
// @ts-ignore setTileUrlFunction isn't in the types
layer.getSource().setTileUrlFunction((tileCoord, pixelRatio, projection) => {
  let url = defaultTileUrlFunction(tileCoord, pixelRatio, projection);
  if (tileCoord[0] === view.getMaxZoom()) {
    url = url.replace("jpg", "png");
  }
  return url;
});

function pixelLocation(x: number, y: number) {
  function hit(list: Region[]) {
    return list.findIndex((n) => x >= n.l && y >= n.t && x <= n.r && y <= n.b);
  }

  const m = hit(data);
  const method = m === -1 ? undefined : data[m];

  const s = method ? hit(method.series) : -1;
  const series = s === -1 ? undefined : method!.series[s];

  const d = series ? hit(series.drawings) : -1;
  const drawing = d === -1 ? undefined : series!.drawings[d];

  const q = drawing ? hit(drawing.quads) : -1;
  const quad = q === -1 ? undefined : drawing!.quads[q];

  const t = quad ? hit(quad.tiles) : -1;
  const tile = t === -1 ? undefined : quad!.tiles[t];

  const result = {
    method: method ? method.method : undefined,
    color: method ? method.color : undefined,
    series: series ? s : undefined,
    drawing: drawing ? d : undefined,
    quad: quad ? q : undefined,
    tile: tile ? t : undefined,
    direction: tile ? tile.dir : undefined,
  };

  return result;
}

type Props = {
  onMapClick?: (location: DrawingLocation) => void;
  method: number | undefined;
  color: number | undefined;
  series: number | undefined;
  drawing: number | undefined;
};

export const DrawingMap: FC<Props> = ({
  onMapClick,
  method = undefined,
  color = undefined,
  series = undefined,
  drawing = undefined,
}) => {
  const [ol] = useState(
    new Map({ layers: [layer], view, controls: [], interactions: [] })
  );

  const [mapSize, setMapSize] = useState<Size>();

  const [updateFrame, setUpdateFrame] = useState<number>(0);

  const mapRef = useRef(null!);
  useLayoutEffect(() => {
    ol.setTarget(mapRef.current);
    setMapSize(ol.getSize());

    const sizeObserver = new ResizeObserver(() => {
      ol.updateSize();
      setMapSize(ol.getSize());
    });
    sizeObserver.observe(mapRef.current);

    return function () {
      sizeObserver.disconnect();
    };
  }, [mapRef.current]);

  function onClick(e: MouseEvent<HTMLDivElement>) {
    if (!onMapClick) {
      return;
    }

    const px = ol.getEventPixel(e as unknown as UIEvent);

    if (!px) {
      return;
    }

    const coord = ol.getCoordinateFromPixel(px);

    if (!coord) {
      return;
    }

    const x = Math.round(coord[0]);
    const y = Math.round(coord[1] * -1);
    const location = pixelLocation(x, y);
    onMapClick(location);
  }

  useEffect(() => {
    let bounds = [];
    if (drawing !== undefined) {
      const d = data.find((m) => m.method === method && m.color == color)!
        .series[series!].drawings[drawing];
      bounds.push([d.l, d.t], [d.r, d.b]);
    } else if (series !== undefined) {
      const s = data.find((m) => m.method === method && m.color == color)!
        .series[series];
      bounds.push([s.l, s.t], [s.r, s.b]);
    } else if (color !== undefined) {
      data
        .filter((m) => m.method === method && m.color == color)
        .forEach((m) => bounds.push([m.l, m.t], [m.r, m.b]));
    } else if (method !== undefined) {
      data
        .filter((m) => m.method === method)
        .forEach((m) => bounds.push([m.l, m.t], [m.r, m.b]));
    } else {
      data.forEach((m) => bounds.push([m.l, m.t], [m.r, m.b]));
    }

    bounds = bounds.map((p) => [p[0], -p[1]]); // flip Y
    const extent = buffer(boundingExtent(bounds), config.tileSize / 2);

    // Hack -- sometimes tiles aren't loaded on initial page load.
    cancelAnimationFrame(updateFrame);
    setUpdateFrame(
      requestAnimationFrame(() =>
        ol.getView().fit(extent, { size: ol.getSize(), duration: 200 })
      )
    );
  }, [method, color, series, drawing, mapSize]);

  return (
    <>
      <link rel="stylesheet" href="/posts/drawing_series/ol.css" />
      <div onClick={onClick}>
        <div ref={mapRef} className={css.mapContainer}></div>
      </div>
    </>
  );
};

export default DrawingMap;
