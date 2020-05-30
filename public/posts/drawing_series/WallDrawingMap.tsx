import { Map, View } from "ol";
import { ZoomToExtent } from "ol/control";
import { buffer, Extent } from "ol/extent";
import { defaults as defaultInteractions } from "ol/interaction";
import TileLayer from "ol/layer/Tile";
import { Size } from "ol/size";
import Zoomify from "ol/source/Zoomify";
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";
import { DrawingInfo } from "./data/drawings";
import { Region } from "./data/map";
import css from "./WallDrawingMap.module.scss";

export interface MapLocation {
  method?: number;
  color?: number;
  series?: number;
  drawing?: number;
  quad?: number;
  tile?: number;
  direction?: number;
}

type Props = {
  onMapClick: (location: MapLocation) => void;
  drawing: DrawingInfo;
};

export const WallDrawingMap: FC<Props> = ({
  onMapClick = null,
  drawing = null,
}) => {
  const [ol] = useState(
    new Map({ interactions: defaultInteractions({ onFocusOnly: true }) })
  );

  const [mapSize, setMapSize] = useState<Size>();

  const [updateFrame, setUpdateFrame] = useState(0);

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

  // When the selected drawing changes, set up the map.
  useEffect(() => {
    if (!drawing) {
      return;
    }

    // Remove previous layer.
    ol.getLayers().forEach((l) => ol.removeLayer(l));

    // Set up Zoomify.
    const id = drawing.number.replace("#", "");
    const layer = new TileLayer({
      source: new Zoomify({
        tileSize: 256,
        tilePixelRatio: 1,
        url: `/posts/drawing_series/tiles/drawings/${id}/`,
        size: [drawing.region!.r, drawing.region!.b],
        crossOrigin: "anonymous",
      }),
    });

    // Patch tileUrlFunction to return PNGs at the max zoom.
    // @ts-ignore getTileUrlFunction is not in the types
    const defaultTileUrlFunction = layer.getSource().getTileUrlFunction();
    layer
      .getSource()
      // @ts-ignore setTileUrlFunction is not in the types
      .setTileUrlFunction((tileCoord, pixelRatio, projection) => {
        let url = defaultTileUrlFunction(tileCoord, pixelRatio, projection);
        if (tileCoord[0] === view.getMaxZoom()) {
          url = url.replace("jpg", "png");
        }
        return url;
      });

    ol.addLayer(layer);

    // Set up the view.
    const drawingExtent: Extent = [0, -drawing.region!.b, drawing.region!.r, 0];

    const mapExtent = buffer(
      drawingExtent,
      Math.max(drawing.region!.b, drawing.region!.r) * 0.5
    );

    const resolutions = layer.getSource().getTileGrid().getResolutions();

    const view = new View({
      minResolution: resolutions[resolutions.length - 1],
      maxResolution: resolutions[0],
      extent: mapExtent,
      enableRotation: false,
    });

    view.fit(drawingExtent, { size: ol.getSize() });

    // Add the zoom-out control.
    const controls = ol.getControls().getArray();
    if (controls.length > 1) {
      ol.removeControl(controls[1]);
    }

    ol.addControl(new ZoomToExtent({ extent: drawingExtent }));

    // Hack -- sometimes tiles aren't loaded on initial page load.
    cancelAnimationFrame(updateFrame);
    setUpdateFrame(requestAnimationFrame(() => ol.setView(view)));
  }, [drawing, mapSize]);

  function onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    // @ts-ignore
    if (e.target.tagName === "BUTTON") {
      return;
    }

    if (!onMapClick || !drawing) {
      return;
    }

    const px = ol.getEventPixel(e.nativeEvent);

    if (!px) {
      return;
    }

    const coord = ol.getCoordinateFromPixel(px);

    if (!coord) {
      return;
    }

    const x = Math.round(coord[0]);
    const y = Math.round(coord[1] * -1);
    const location = pixelLocation(x, y, drawing);
    console.log(location);
    if (location.method === null) {
      return;
    }

    onMapClick(location);
  }

  function pixelLocation(x: number, y: number, data: DrawingInfo): MapLocation {
    function hit(list: Region[]) {
      return list.findIndex(
        (n) => x >= n.l && y >= n.t && x <= n.r && y <= n.b
      );
    }

    let d = undefined;
    let drawing = undefined;
    let q = undefined;
    let quad = undefined;
    let t = undefined;
    let tile = undefined;
    let found = undefined;

    for (let m = 0; m < data.methods!.length; m++) {
      for (let s = 0; s < data.methods![m].series.length; s++) {
        const series = data.methods![m].series[s];
        d = hit(series.drawings);
        drawing = d === -1 ? undefined : series.drawings[d];

        q = drawing ? hit(drawing.quads) : -1;
        quad = q === -1 ? undefined : drawing!.quads[q];

        t = quad ? hit(quad.tiles) : -1;
        tile = t === -1 ? undefined : quad!.tiles[t];

        found = drawing && quad && tile;

        if (found) {
          break;
        }
      }
      if (found) {
        break;
      }
    }

    const result: MapLocation = {
      method: found ? drawing!.method : undefined,
      color: found ? drawing!.color : undefined,
      series: found ? drawing!.series : undefined,
      drawing: found ? drawing!.drawing : undefined,
      quad: found ? q : undefined,
      tile: found ? t : undefined,
      direction: found ? tile!.dir : undefined,
    };
    // console.log(result);
    return result;
  }

  return (
    <>
      <link rel="stylesheet" href="/posts/drawing_series/ol.css" />
      <div
        onClick={onClick}
        ref={mapRef}
        className={css.mapContainer}
        tabIndex={1000}
      ></div>
    </>
  );
};

export default WallDrawingMap;
