import { GetStaticProps } from "next";
import { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { ProjectGrid } from "../components/ProjectGrid";
import { Project } from "../data/projects";
import { htmlToReact } from "../utils/htmlToReact";

type Props = {
  projects: Project[];
  strings: any;
};

export const Engineer: FC<Props> = ({ projects = [], strings = {} }) => {
  return (
    <>
      <Row>
        <Col>
          <h2>{strings.heading}</h2>
          <p className="mb-0">{htmlToReact(strings.copy)}</p>
        </Col>
      </Row>
      <ProjectGrid projects={projects} />
    </>
  );
};

export default Engineer;

export const getStaticProps: GetStaticProps = async (context) => {
  const projects = await import("../data/projects");
  const strings = await import("../data/strings");

  return {
    props: {
      projects: projects.engineer,
      title: strings.engineer.title,
      description: strings.engineer.copy,
      strings: strings.engineer,
      active: "engineer",
    },
  };
};
