import { GetStaticProps } from "next";
import { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { Project } from "../data/projects";
import { htmlToReact } from "../utils/htmlToReact";

type Props = {
  projects: Project[];
  strings: any;
};

export const Director: FC<Props> = ({ projects = [], strings = {} }) => {
  return (
    <>
      <Row>
        <Col>
          <h2>{strings.heading}</h2>
          <p className="mb-0">{htmlToReact(strings.copy)}</p>
        </Col>
      </Row>
      {/* <ProjectGrid projects={projects} /> */}
    </>
  );
};

export default Director;

export const getStaticProps: GetStaticProps = async (context) => {
  const projects = await import("../data/projects");
  const strings = await import("../data/strings");

  return {
    props: {
      projects: projects.director,
      title: strings.director.title,
      description: strings.director.copy,
      strings: strings.director,
      active: "director",
    },
  };
};