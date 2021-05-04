import { GetStaticProps } from "next";
import { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { ProjectGrid } from "../components/ProjectGrid";
import { Project } from "../data/projects";
import { htmlToReact } from "../utils/htmlToReact";
import { Video } from "../components/Video";
import css from "./work.module.scss";

type Props = {
  projects: Project[];
  strings: any;
};

export const Immersive: FC<Props> = ({ projects = [], strings = {} }) => {
  return (
    <>
      <Row>
        <Col>
          <h2>{strings.heading}</h2>
        </Col>
      </Row>
      <Row>
        <Col lg={4} md={12} sm={12}>
          <p className={css.headline}>{htmlToReact(strings.copy)}</p>
        </Col>
        <Col lg={8} md={12} sm={12}>
          <Video
            hlsPath="stimulant-reel-2017-16x9"
            poster="/images/stimulant-reel-2017-16x9.jpg"
            autoPlay={true}
            skip={0}
          />
        </Col>
      </Row>
      <ProjectGrid projects={projects} />
    </>
  );
};

export default Immersive;

export const getStaticProps: GetStaticProps = async (context) => {
  const projects = await import("../data/projects");
  const strings = await import("../data/strings");

  return {
    props: {
      projects: projects.projects,
      title: strings.immersive.title,
      description: strings.immersive.copy,
      strings: strings.immersive,
      active: "immersive",
    },
  };
};
