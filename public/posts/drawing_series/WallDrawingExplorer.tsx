import LeftArrow from "@fortawesome/fontawesome-free/svgs/solid/angle-left.svg";
import RightArrow from "@fortawesome/fontawesome-free/svgs/solid/angle-right.svg";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { FC, useEffect, useRef, useState } from "react";
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Col,
  Dropdown,
  Row,
} from "react-bootstrap";
import { trackComponentEvent } from "../../../utils/tracking";
import { data as drawings, DrawingInfo } from "./data/drawings";
import css from "./WallDrawingExplorer.module.scss";
import { MapLocation } from "./WallDrawingMap";

const WallDrawingMap = dynamic(() => import("./WallDrawingMap"), {
  ssr: false,
});

type Props = {
  onMapClick: (location: MapLocation) => void;
};

export const WallDrawingExplorer: FC<Props> = ({ onMapClick }) => {
  const [drawingsOpen, setDrawingsOpen] = useState(false);
  const onDrawingsToggle = () => setDrawingsOpen(!drawingsOpen);
  const [drawing, setDrawing] = useState(drawings[0]);

  function clickDrawing(drawing: DrawingInfo) {
    setDrawing(drawing);
    trackComponentEvent(__filename, "menu");
  }

  // Scroll the active list item into view.
  const drawingsMenu = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (drawingsOpen) {
      const drawingItem = drawingsMenu.current.getElementsByClassName(
        "dropdown-item"
      )[drawings.indexOf(drawing)] as HTMLDivElement;
      drawingsMenu.current.scrollTop =
        drawingItem.offsetTop -
        (drawingsMenu.current.offsetHeight - drawingItem.offsetHeight) / 2;
    }
  }, [drawingsOpen]);

  const variant = "secondary";

  function navDrawing(dir: number) {
    let index = drawings.indexOf(drawing);
    index += dir;
    if (index < 0) {
      index = drawings.length - 1;
    }
    if (index >= drawings.length) {
      index = 0;
    }
    setDrawing(drawings[index]);
    trackComponentEvent(__filename, "menu");
  }

  function _onMapClick(location: MapLocation) {
    if (onMapClick) {
      onMapClick(location);
    }
    trackComponentEvent(__filename, "map");
  }

  function DrawingTitle({ drawing }: { drawing: DrawingInfo }) {
    return (
      <>
        <span className="pr-1">{drawing.number}</span>
        <span className="d-none d-xs-none d-md-inline pr-1">
          : {drawing.subtitle}
        </span>
      </>
    );
  }

  return (
    <>
      <Row className={classNames("mt-3")}>
        <Col>
          <ButtonToolbar>
            <ButtonGroup className="mb-3">
              <Button variant={variant} disabled={true} className="text-nowrap">
                Wall Drawing
              </Button>
              <Button variant={variant} onClick={() => navDrawing(-1)}>
                <LeftArrow style={{ height: "1.25em", fill: "white" }} />
              </Button>
              <Dropdown show={drawingsOpen} onToggle={onDrawingsToggle}>
                <Dropdown.Toggle
                  variant={variant}
                  id="dropdown-drawings2"
                  className={drawing !== null ? "active" : ""}
                  style={{ borderRadius: 0 }}
                >
                  <DrawingTitle drawing={drawing} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <div ref={drawingsMenu} className={css.scrollList}>
                    {drawings.map((d, i) => {
                      return (
                        <Dropdown.Item
                          key={i}
                          active={d === drawing}
                          onClick={() => clickDrawing(d)}
                          style={{ textDecoration: "none" }}
                        >
                          <DrawingTitle drawing={d} />
                        </Dropdown.Item>
                      );
                    })}
                  </div>
                </Dropdown.Menu>
              </Dropdown>
              <Button variant={variant} onClick={() => navDrawing(1)}>
                <RightArrow style={{ height: "1.25em", fill: "white" }} />
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
      </Row>
      <Row>
        <Col>
          <WallDrawingMap drawing={drawing} onMapClick={_onMapClick} />
        </Col>
      </Row>
    </>
  );
};
