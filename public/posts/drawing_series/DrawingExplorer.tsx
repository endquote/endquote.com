import classNames from "classnames";
import dynamic from "next/dynamic";
import { FC, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Col,
  Dropdown,
  Row,
} from "react-bootstrap";
import { trackComponentEvent } from "../../../utils/tracking";
import { MapLocation } from "./WallDrawingMap";

const DrawingMap = dynamic(() => import("./DrawingMap"), {
  ssr: false,
});

export interface DrawingLocation {
  method: number | undefined;
  color: number | undefined;
  series: number | undefined;
  drawing: number | undefined;
}

type Props = {
  externalLocation?: MapLocation;
};

export const DrawingExplorer: FC<Props> = ({ externalLocation }) => {
  const [method, setMethod] = useState<number | undefined>(1);
  const [color, setColor] = useState<number | undefined>(undefined);
  const [series, setSeries] = useState<number | undefined>(undefined);
  const [drawing, setDrawing] = useState<number | undefined>(undefined);

  const [drawingOpen, setDrawingOpen] = useState(false);
  const onDrawingToggle = () => setDrawingOpen(!drawingOpen);

  const variant = "secondary";

  function clickMethod(m: number | undefined) {
    if (m === method || m === undefined) {
      setDrawing(undefined);
      setSeries(undefined);
      setColor(undefined);
    }

    setMethod(m);
    trackComponentEvent(__filename, "menu");
  }

  function clickColor(c: number | undefined) {
    if (c === color || c === undefined) {
      setDrawing(undefined);
      setSeries(undefined);
    }

    setColor(c);
    trackComponentEvent(__filename, "menu");
  }

  function clickSeries(s: number | undefined) {
    if (s === series || s === undefined) {
      setDrawing(undefined);
    }

    setSeries(s);
    trackComponentEvent(__filename, "menu");
  }

  function clickDrawing(d: number | undefined) {
    setDrawing(d);
    setDrawingOpen(false);
    trackComponentEvent(__filename, "menu");
  }

  function onMapClick(location: DrawingLocation) {
    // console.log(location);
    if (location.drawing !== undefined && series !== undefined) {
      setMethod(location.method);
      setColor(location.color);
      setSeries(location.series);
      if (drawing !== undefined || location.series === series) {
        setDrawing(location.drawing);
      }
    } else if (location.series !== undefined && color !== undefined) {
      setMethod(location.method);
      setColor(location.color);
      if (series !== undefined || location.color === color) {
        setSeries(location.series);
      }
    } else if (location.color !== undefined && method !== undefined) {
      setMethod(location.method);
      if (color !== undefined || location.method === method) {
        setColor(location.color);
      }
    } else if (location.method !== undefined) {
      setMethod(location.method);
    }
    trackComponentEvent(__filename, "map");
  }

  useEffect(() => {
    if (!externalLocation || externalLocation.method === undefined) {
      return;
    }

    setMethod(externalLocation.method > 2 ? 0 : externalLocation.method);
    setColor(externalLocation.color);
    setSeries(externalLocation.series);
    setDrawing(externalLocation.drawing);
  }, [externalLocation]);

  return (
    <>
      <Row className={classNames("mt-3")}>
        <Col>
          <ButtonToolbar>
            <ButtonGroup className={classNames("mr-3", "mb-3")}>
              <Button variant={variant} disabled={true}>
                Method
              </Button>
              <Button
                variant={variant}
                onClick={() => clickMethod(undefined)}
                active={method === undefined}
              >
                All
              </Button>
              <Button
                variant={variant}
                onClick={() => clickMethod(0)}
                active={method === 0}
              >
                #
              </Button>
              <Button
                variant={variant}
                onClick={() => clickMethod(1)}
                active={method === 1}
              >
                A
              </Button>
              <Button
                variant={variant}
                onClick={() => clickMethod(2)}
                active={method === 2}
              >
                B
              </Button>
            </ButtonGroup>
            <ButtonGroup
              className={classNames(
                method === undefined ? "d-none" : null,
                "mr-3",
                "mb-3"
              )}
            >
              <Button variant={variant} disabled={true}>
                Style
              </Button>
              <Button
                variant={variant}
                onClick={() => clickColor(undefined)}
                active={color === undefined}
              >
                Both
              </Button>
              <Button
                variant={variant}
                onClick={() => clickColor(0)}
                active={color === 0}
              >
                Black
              </Button>
              <Button
                variant={variant}
                onClick={() => clickColor(1)}
                active={color === 1}
              >
                Color
              </Button>
            </ButtonGroup>
            <ButtonGroup
              className={classNames(
                color === undefined ? "d-none" : null,
                "mr-3",
                "mb-3"
              )}
            >
              <Button variant={variant} disabled={true}>
                Series
              </Button>
              <Button
                variant={variant}
                onClick={() => clickSeries(undefined)}
                active={series === undefined}
              >
                All
              </Button>
              {[...Array(4)].map((v, i) => {
                return (
                  <Button
                    variant={variant}
                    onClick={() => clickSeries(i)}
                    active={series === i}
                    key={i}
                  >
                    {i + 1}
                  </Button>
                );
              })}
            </ButtonGroup>
            <ButtonGroup
              className={classNames(
                series === undefined ? "d-none" : null,
                "mb-3"
              )}
            >
              <Button disabled={true} variant={variant}>
                Drawing
              </Button>
              <Dropdown onToggle={onDrawingToggle} show={drawingOpen}>
                <Dropdown.Toggle
                  id="dropdown-drawings"
                  variant={variant}
                  className={drawing !== undefined ? "active" : ""}
                >
                  {drawing === undefined ? "All" : drawing + 1}
                </Dropdown.Toggle>
                <Dropdown.Menu className={classNames("m-0", "p-0", "border-0")}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateRows: "repeat(4, auto)",
                      gridTemplateColumns: "repeat(6, 1fr)",
                    }}
                  >
                    {[...Array(24)].map((v, i) => {
                      return (
                        <Button
                          variant={variant}
                          style={{
                            gridRow: Math.floor(i / 6) + 1,
                            gridColumn: (i % 6) + 1,
                            borderTopLeftRadius: i === 0 ? ".25rem" : 0,
                            borderTopRightRadius: i === 5 ? ".25rem" : 0,
                            borderBottomRightRadius: i === 23 ? ".25rem" : 0,
                            borderBottomLeftRadius: i === 18 ? ".25rem" : 0,
                          }}
                          key={i}
                          active={i === drawing}
                          onClick={() => clickDrawing(i)}
                        >
                          {i + 1}
                        </Button>
                      );
                    })}
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
      </Row>
      <Row>
        <Col>
          <DrawingMap
            onMapClick={onMapClick}
            method={method}
            color={color}
            series={series}
            drawing={drawing}
          />
        </Col>
      </Row>
    </>
  );
};
