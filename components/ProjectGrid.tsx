import { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { Project } from "../data/projects";
import { ProjectThumb } from "./ProjectThumb";

type Props = {
  projects: Project[];
};

export const ProjectGrid: FC<Props> = ({ projects = [] }) => {
  return (
    <Row className="mt-3">
      {projects.map((project) => (
        <Col lg={4} md={6} sm={12} key={project.id}>
          <ProjectThumb project={project} />
        </Col>
      ))}
    </Row>
  );
};
