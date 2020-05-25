import { GetStaticProps } from "next";
import { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { Project } from "../data/projects";
import { htmlToReact } from "../utils/htmlToReact";
import css from "./work.module.scss";

type Props = {
  projects: Project[];
  strings: any;
};

export const Work: FC<Props> = ({ projects = [], strings = {} }) => {
  return (
    <>
      <Row>
        <Col lg={4} md={12} sm={12}>
          <p className={css.headline}>{htmlToReact(strings.about)}</p>
        </Col>
        <Col lg={8} md={12} sm={12}>
          {/* <Video
            hlsPath="stimulant-reel-2017-16x9"
            poster="/images/stimulant-reel-2017-16x9.jpg"
            autoPlay={true}
            loop={true}
            skip={0}
          /> */}
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <p className={`mb-0 ${css.category}`}>
            {htmlToReact(strings.director)}
          </p>
        </Col>
      </Row>
      {/* <ProjectGrid projects={director} className="pb-5" /> */}
      <Row className="mt-5">
        <Col>
          <p className={`mb-0 ${css.category}`}>
            {htmlToReact(strings.engineer)}
          </p>
        </Col>
      </Row>
      {/* <ProjectGrid projects={engineer} /> */}
    </>
  );
};

export default Work;

export const getStaticProps: GetStaticProps = async (context) => {
  const projects = await import("../data/projects");
  const strings = await import("../data/strings");

  return {
    props: {
      director: projects.directorFeatured,
      engineer: projects.engineerFeatured,
      title: strings.work.title,
      description: strings.work.about,
      strings: strings.work,
      active: "work",
    },
  };
};
