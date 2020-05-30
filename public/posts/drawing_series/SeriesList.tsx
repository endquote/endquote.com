import { FC, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { DEV } from "../../../data/constants";
import { Series } from "./Series";

export const SeriesList: FC = () => {
  const [currentSeries, setCurrentSeries] = useState(DEV ? null : 0);

  // Play each series in a loop.
  function onSeriesEnd() {
    if (currentSeries === null) {
      return;
    }
    setCurrentSeries((currentSeries + 1) % 4);
  }

  // Click through each series. Clicking the last one turns off playback.
  function onClickSeries() {
    if (currentSeries === 3) {
      setCurrentSeries(null);
    } else if (currentSeries === null) {
      setCurrentSeries(0);
    } else {
      setCurrentSeries(currentSeries + 1);
    }
  }

  return (
    <Row
      className="mt-3"
      onClick={onClickSeries}
      title="click to change which series is animating"
    >
      <Col lg="3" md="6" sm="6" xs="6">
        <figure>
          <Series series={0} onEnded={onSeriesEnd} play={currentSeries === 0} />
          <figcaption>series 1 - rotate</figcaption>
        </figure>
      </Col>
      <Col lg="3" md="6" sm="6" xs="6">
        <figure>
          <Series series={1} onEnded={onSeriesEnd} play={currentSeries === 1} />
          <figcaption>series 2 - mirror</figcaption>
        </figure>
      </Col>
      <Col lg="3" md="6" sm="6" xs="6">
        <figure>
          <Series series={2} onEnded={onSeriesEnd} play={currentSeries === 2} />
          <figcaption>series 3 - cross mirror</figcaption>
        </figure>
      </Col>
      <Col lg="3" md="6" sm="6" xs="6">
        <figure>
          <Series series={3} onEnded={onSeriesEnd} play={currentSeries === 3} />
          <figcaption>series 4 - cross reverse</figcaption>
        </figure>
      </Col>
    </Row>
  );
};
