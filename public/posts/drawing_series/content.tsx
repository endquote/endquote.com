import classNames from "classnames";
import { FC, useState } from "react";
import { Carousel, Col, Row } from "react-bootstrap";
import css from "../../../pages/post/post.module.scss";
import { DrawingExplorer } from "./DrawingExplorer";
import { Method } from "./Method";
import { SeriesList } from "./SeriesList";
import { WallDrawingExplorer } from "./WallDrawingExplorer";
import { MapLocation } from "./WallDrawingMap";

export const DrawingSeries: FC = () => {
  const [externalLocation, setExternalLocation] = useState<
    MapLocation | undefined
  >();

  function onWallDrawingClick(location: MapLocation) {
    setExternalLocation(location);
  }

  return (
    <>
      <Row>
        {/* prettier-ignore */}
        <Col>
<p>Sol LeWitt is an artist that produced work beginning in 1960 who is best known for his series of "Wall Drawings". These consist of an artwork drawn directly on a wall and a certificate which includes instructions on how to produce the drawing. LeWitt designed the instructions and produced the certificates, but other draftspeople execute the instructions and create the work in physical space.</p>
<p>There are a total of 1352 Wall Drawings, grouped into 24 series, each with a different style of instructions. These instructions are simple algorithms which are natural to explore with code. This page is an exploration of the "Drawing Series", which consists of 46 wall drawings, produced by a system LeWitt designed beginning in 1968.</p>
        </Col>
        <Col lg={6} md={6} sm={12}>
          <Carousel
            controls={false}
            indicators={false}
            fade={true}
            className="carousel-fade"
          >
            <Carousel.Item>
              <img src="/posts/drawing_series/photos/1A.jpg" />
            </Carousel.Item>
            <Carousel.Item>
              <img src="/posts/drawing_series/photos/1A-diagram.jpg" />
            </Carousel.Item>
            <Carousel.Item>
              <img src="/posts/drawing_series/photos/1211.jpg" />
            </Carousel.Item>
            <Carousel.Item>
              <img src="/posts/drawing_series/photos/1211-diagram.jpg" />
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <div
            className={css.grid}
            style={{
              gridTemplateRows: "auto auto",
              gridTemplateColumns: "repeat(3, 1fr)",
            }}
          >
            <Row className={classNames(css.col1, css.row1)}>
              {/* prettier-ignore */}
              <Col>
<p>The drawings are grids filled with lines in different directions and colors. The certificates describe the style of lines using numbers to represent each possible type. There are four <strong>directions</strong> of lines, with <strong>1</strong> used for <strong>vertical</strong>, <strong>2</strong> for <strong>horizontal</strong>, <strong>3</strong> for <strong>diagonal up</strong>, and <strong>4</strong> for <strong>diagonal down</strong>.</p>
              </Col>
            </Row>
            <Row className={classNames(css.col1, css.row2)}>
              <Col>
                <figure>
                  <Method method="m0b" />
                </figure>
              </Col>
              <Col>
                <figure>
                  <Method method="m1b" />
                </figure>
              </Col>
            </Row>
            <Row className={classNames(css.col2, css.row1)}>
              {/* prettier-ignore */}
              <Col>
<p>Drawings can be rendered in <strong>black</strong> or in <strong>color</strong>. In the color style, the numbers represent both the direction and the color, with with <strong>1</strong> used for <strong>black</strong>, <strong>2</strong> for <strong>yellow</strong>, <strong>3</strong> for <strong>red</strong>, and <strong>4</strong> for <strong>blue</strong>.</p>
              </Col>
            </Row>
            <Row className={classNames(css.col2, css.row2)}>
              <Col>
                <figure>
                  <Method method="m0c" />
                </figure>
              </Col>
              <Col>
                <figure>
                  <Method method="m1c" />
                </figure>
              </Col>
            </Row>
            <Row className={classNames(css.col3, css.row1)}>
              {/* prettier-ignore */}
              <Col>
<p>Lines can be drawn in one of two <strong>methods</strong>, with <strong>method A</strong> using one set of lines per number. <strong>method B</strong> uses the direction of lines specified by the number, but layers that on top of the directions for each preceding number. For example, 1 is still vertical, but 2 is vertical with horizontal layered on top.</p>
              </Col>
            </Row>
            <Row className={classNames(css.col3, css.row2)}>
              <Col>
                <figure>
                  <Method method="m2b" />
                </figure>
              </Col>
              <Col>
                <figure>
                  <Method method="m2c" />
                </figure>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row className="mt-4">
        {/* prettier-ignore */}
        <Col>
          <p> A drawing is made up of a 2×2 grid of the above 2×2 sections. The top-left section uses each of the numbers 1-4 ordered in one of  24 possible ways. The order of those numbers changes from one section to the next in clockwise order, with the process of change determined by the <strong>series</strong> of the drawing. There are four series, with <strong>series 1</strong> using <strong>rotation</strong> of the numbers, <strong>series 2</strong> does a <strong>mirror</strong>, <strong>series 3</strong> uses a <strong>"cross mirror"</strong>, and <strong>series 4</strong> uses a <strong>"cross reverse"</strong>.
{/* Clicking the animations below will cycle through them. */}
          </p>
        </Col>
      </Row>
      {/* <SeriesList /> */}
      <Row className="mt-4">
        {/* prettier-ignore */}
        <Col>
<p>With four series of 24 drawings each, two methods to render each drawing, and two color styles, there are a total of <strong>384 drawings</strong>. Below is a visualization of each drawing, with an additional section illustrating them numerically. Click the buttons or the map below to navigate though the collection.</p>
        </Col>
      </Row>
      <DrawingExplorer externalLocation={externalLocation} />
      <Row className="mt-4">
        {/* prettier-ignore */}
        <Col>
<p>To create the actual artworks which are installed in various museums, galleries, and private homes, the drawings above are combined into groups, with the result finally being considered a Wall Drawing. The <strong>46</strong> Wall Drawings from the Drawing Series can be explored below. Clicking any part of the Wall Drawing will focus the map above to that drawing's location.</p>
        </Col>
      </Row>
      <WallDrawingExplorer onMapClick={onWallDrawingClick} />
      <Row>
        {/* prettier-ignore */}
        <Col className="mt-4">
<p>While it's outside the scope of this project, having code to generate these drawings would allow them to go back onto the physical world in interesting ways. New combinations of drawings could be generated, they could be projected onto walls, <a href="https://scribit.design">drawn onto walls</a> <a href="http://juerglehni.com/works/otto">with robots</a>, <a href="https://shop.evilmadscientist.com">drawn onto paper</a>, or <a href="https://katsuru.ai">spray-painted with a drone</a>.</p>
<p>The photos at the top of the page and the information needed to create this project come from <a href="https://www.artifexpress.com/catalogues/sol-lewitt-wall-drawings/description">The Sol LeWitt Wall Drawings Catalogue Raisonné</a> produced by <a href="https://www.artifexpress.com">Artifex Press</a>.</p>
<p>If you want to see the drawings in person, just head out to <a href="https://massmoca.org/sol-lewitt/">MASS MoCA</a>.</p>
        </Col>
      </Row>
    </>
  );
};

export default DrawingSeries;
