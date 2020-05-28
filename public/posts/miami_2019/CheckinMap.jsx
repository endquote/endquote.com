import classNames from "classnames";
import { Map, View } from "ol";
import Feature from "ol/Feature";
import { Circle } from "ol/geom";
import Point from "ol/geom/Point";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import Overlay from "ol/Overlay";
import { fromLonLat, toLonLat } from "ol/proj";
import Stamen from "ol/source/Stamen";
import VectorSource from "ol/source/Vector";
import { Fill, Icon, Stroke, Style } from "ol/style";
import Popper from "popper.js";
import { useEffect, useRef, useState } from "react";
import twemoji from "twemoji";
import { DEV } from "../../../data/constants";
import { htmlToReact } from "../../../utils/htmlToReact";
import css from "./CheckinMap.module.css";

export default function CheckinMap({
  center = [-122.4194, 37.7749],
  zoom = 13,
  mobileCenter,
  mobileZoom,
  checkins = [],
}) {
  // The top-level map object.
  const [map] = useState(
    new Map({
      layers: [new TileLayer({ source: new Stamen({ layer: "toner-lite" }) })],
    })
  );

  const mapRef = useRef();
  useEffect(() => {
    map.setTarget(mapRef.current);
  }, [mapRef.current]);

  useEffect(() => {
    // On click, update the selection.
    function onClick(e) {
      setCurrentFeature(map.getFeaturesAtPixel(e.pixel)[0]);
    }
    map.on("click", onClick);

    // On move, update the mouse cursor.
    function onPointerMove(e) {
      const pixel = map.getEventPixel(e.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      setCursor(hit ? "pointer" : "");
    }
    map.on("pointermove", onPointerMove);

    // Log the map origin in dev mode.
    function onMoveEnd(e) {
      const view = map.getView();
      console.log(toLonLat(view.getCenter()), view.getZoom());
    }

    if (DEV) {
      map.on("moveend", onMoveEnd);
    }

    return function () {
      map.un("click", onClick);
      map.un("pointermove", onPointerMove);
      map.un("moveend", onMoveEnd);
    };
  }, [map]);

  // The overlay which is used to position the popup.
  const [overlay] = useState(
    new Overlay({ stopEvent: true, positioning: "center-center" })
  );

  const overlayRef = useRef();
  useEffect(() => {
    overlay.setElement(overlayRef.current);
  }, [overlayRef.current]);

  useEffect(() => {
    map.addOverlay(overlay);
    return function () {
      map.removeOverlay(overlay);
    };
  }, [overlay]);

  // Set the map origin.
  useEffect(() => {
    const width = mapRef.current
      ? mapRef.current.getBoundingClientRect().width
      : Number.POSITIVE_INFINITY;
    const mobile = width < 930;
    mobileCenter = mobileCenter || center;
    mobileZoom = mobileZoom || zoom;
    map.setView(
      new View({
        center: fromLonLat(mobile ? mobileCenter : center),
        zoom: mobile ? mobileZoom : zoom,
      })
    );
  }, [center, zoom, mobileCenter, mobileZoom, mapRef.current]);

  // Create a layer for each checkin.
  useEffect(() => {
    // The circle which goes around a marker.
    const circle = new Circle({
      fill: new Fill({ color: "rgba(255,255,255,1)" }),
      stroke: new Stroke({ color: "rgba(0,0,0,1)", width: 1 }),
      radius: 18,
    });

    checkins.forEach((checkin) => {
      const geometry = new Point(fromLonLat(checkin.location));
      const feature = new Feature({ geometry, checkin });
      const src = twemoji.parse(checkin.emoji).match(/src="([^"]+)"/)[1];
      feature.setStyle(new Style({ image: new Icon({ src, scale: 0.5 }) }));

      // Seems like overkill to have a layer for each marker, but the text/circle
      // z-indexes were acting weird otherwise.
      checkin.layer = new VectorLayer({
        source: new VectorSource({ features: [feature] }),
      });
      map.addLayer(checkin.layer);
    });

    return function () {
      checkins.forEach((checkin) => {
        map.removeLayer(checkin.layer);
      });
    };
  }, [checkins]);

  // The selected map feature.
  const [currentFeature, setCurrentFeature] = useState(null);
  const [lastCheckin, setLastCheckin] = useState({});

  useEffect(() => {
    if (!currentFeature) {
      return;
    }

    setLastCheckin(currentFeature.get("checkin"));
    overlay.setPosition(currentFeature.getGeometry().getCoordinates());
    popper.scheduleUpdate();
  }, [currentFeature]);

  // The mouse cursor used over the map.
  const [cursor, setCursor] = useState("");

  // The popper.js control, follows the position of the overlay.
  const [popper, setPopper] = useState(null);
  const popupRef = useRef();
  useEffect(() => {
    setPopper(
      new Popper(overlayRef.current, popupRef.current, {
        placement: "top",
        modifiers: {
          preventOverflow: { enabled: true, boundariesElement: mapRef.current },
          offset: { enabled: true, offset: "0, 15" },
        },
      })
    );
  }, [overlayRef.current, popupRef.current, mapRef.current]);

  useEffect(() => {
    function onPostRender(e) {
      if (popper) {
        popper.scheduleUpdate();
      }
    }

    if (map) {
      map.on("postrender", onPostRender);
    }

    return function () {
      map.un("postrender", onPostRender);
    };
  }, [map, popper]);

  return (
    <>
      <link rel="stylesheet" href="/posts/miami_2019/ol.css" />
      <div ref={mapRef} style={{ cursor }} className={css.mapContainer}></div>
      <div ref={overlayRef}></div>
      <div
        ref={popupRef}
        className={classNames(css.popup, currentFeature ? css.shown : "")}
      >
        <h6>
          <a href={lastCheckin.url} target="_blank">
            {lastCheckin.name}
          </a>
        </h6>
        <div className={lastCheckin.description ? null : "d-none"}>
          {htmlToReact(lastCheckin.description)}
        </div>
      </div>
    </>
  );
}
