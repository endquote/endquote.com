import classNames from "classnames";
import {
  AnimationEvent,
  FC,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Col, Row } from "react-bootstrap";
import ResizeObserver from "resize-observer-polyfill";
import * as config from "./data/config";
import * as map from "./data/map";
import css from "./Series.module.scss";

const perspective = 750;

type Props = {
  play: boolean;
  series: number;
  onEnded: (series: number) => void;
};

export const Series: FC<Props> = ({ play = false, series = 0, onEnded }) => {
  const rootRef = useRef<HTMLDivElement>(null!);

  const [playing, setPlaying] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Update the size initially once rendered.
  useLayoutEffect(() => {
    const sizeObserver = new ResizeObserver(() => {
      setSize({
        w: rootRef.current.offsetWidth,
        h: rootRef.current.offsetHeight,
      });
    });
    sizeObserver.observe(rootRef.current);

    return function () {
      sizeObserver.disconnect();
    };
  }, [rootRef]);

  // Start playing when play is set.
  useEffect(() => {
    if (!size.w || !size.h) {
      return;
    }
    setPlaying(play);
  }, [play, size]);

  // Let the consumer know when an animation has ended.
  function onAnimationEnd(event: AnimationEvent<HTMLDivElement>): void {
    if (event.animationName.indexOf(`anim${series}-quad`) === -1) {
      return;
    }
    setPlaying(false);
    if (onEnded) {
      onEnded(series);
    }
  }

  const drawing = map.data[0].series[series].drawings[0];
  const scale = size.w / config.drawingSize;

  function Quad({ quad = 0, anim = false }): JSX.Element {
    const style = {
      padding: `${(config.quadGap / 2) * scale}px`,
    };

    // Move the static quads away from the camera so they doesn't collide
    // with the animated one, but then scale and offset it so it appears
    // to have not moved. https://stackoverflow.com/a/13505718
    const translateZ = -100;
    const scaleZ = 1 / (perspective / (perspective - translateZ));
    const originV = quad < 2 ? "bottom" : "top";
    const originH = quad % 2 === 0 ? "right" : "left";
    const styleZ = {
      transform: `translateZ(${translateZ}px) scale(${scaleZ})`,
      transformOrigin: `${originV} ${originH}`,
    };

    return (
      <div
        className={classNames(anim ? null : "w-50")}
        style={anim ? styleZ : {}}
      >
        <Col
          className={classNames(
            anim ? null : css.quad,
            anim ? null : css[`quad${quad}`]
          )}
          style={style}
        >
          <Row noGutters={true}>
            <Tile quad={quad} tile={0} />
            <Tile quad={quad} tile={1} />
          </Row>
          <Row noGutters={true}>
            <Tile quad={quad} tile={2} />
            <Tile quad={quad} tile={3} />
          </Row>
        </Col>
      </div>
    );
  }

  function Tile({ quad = 0, tile = 0 }): JSX.Element {
    const data = drawing.quads[quad].tiles[tile];
    const height = (size.w - config.quadGap * 2 * scale) / 4;
    const style = {
      height: `${height}px`,
      lineHeight: `${height}px`,
      fontSize: `${height * 0.6}px`,
      borderWidth: `${2 * scale}px`,
    };
    return (
      <Col className={classNames("w-50", css.tile)} style={style}>
        <div className={css.number}>{data.dir}</div>
      </Col>
    );
  }

  const style = {
    margin: -((config.quadGap / 2) * scale),
    perspective: `${perspective}px`,
  };

  return (
    <div
      ref={rootRef}
      className={classNames(
        css.series,
        css[`series${series}`],
        playing ? css.playing : null
      )}
      style={style}
    >
      <Row noGutters={true}>
        <div
          className={classNames("w-50", css.quad, css.anim)}
          onAnimationEnd={onAnimationEnd}
        >
          <Quad quad={0} anim={true} />
        </div>
        <Quad quad={0} />
        <Quad quad={1} />
      </Row>
      <Row noGutters={true}>
        <Quad quad={2} />
        <Quad quad={3} />
      </Row>
      <Row noGutters={true} className={css.animParent}></Row>
    </div>
  );
};
