import { GetStaticPaths, GetStaticProps } from "next";
import { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { ProjectImage } from "../../components/ProjectImage";
import { Video } from "../../components/Video";
import { Project } from "../../data/projects";
import { htmlToReact } from "../../utils/htmlToReact";

type Props = {
  project: Project;
  strings: any;
};

export const ProjectPage: FC<Props> = ({ project, strings }) => {
  const video = (
    <Video
      hlsPath={project.id}
      poster={`/images/projects/${project.id}/poster.jpg`}
      autoPlay={false}
      skip={project.skip}
      audio={project.audio}
    />
  );

  const image = <ProjectImage project={project} />;

  return (
    <>
      <Row>
        <Col>
          <h2>{project.title}</h2>
          <p className="font-italic">{project.subtitle}</p>
        </Col>
      </Row>
      <Row>
        <Col sm={12} md={8} lg={8}>
          <p>{htmlToReact(project.description)}</p>

          <p>
            <span className="font-weight-bold">{strings.role}: </span>
            <span>{htmlToReact(project.role)}</span>
          </p>
        </Col>
        <Col sm={12} md={4} lg={4}>
          <p>
            <span className="font-weight-bold">{strings.client}: </span>
            <span>{htmlToReact(project.client)}</span>
          </p>

          <p>
            <span className="font-weight-bold">{strings.technologies}: </span>
            <span>{htmlToReact(project.technologies)}</span>
          </p>
        </Col>
      </Row>
      <Row className="py-3">
        <Col>{project.skip === undefined ? image : video}</Col>
      </Row>
    </>
  );
};

export default ProjectPage;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const projects = await import("../../data/projects");
  const strings = await import("../../data/strings");

  const project = projects.projects.find((i) => i.id === params?.id) as Project;

  return {
    props: {
      project,
      title: `${project.title} - ${strings.project.title}`,
      strings: strings.project,
      description: project.description,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await import("../../data/projects");

  return {
    paths: projects.projects.map((p) => {
      return { params: { id: p.id } };
    }),
    fallback: false,
  };
};
