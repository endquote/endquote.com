import classNames from "classnames";
import { FC } from "react";
import { Project } from "../data/projects";
import css from "./ProjectImage.module.scss";

type Props = {
  project: Project;
};

export const ProjectImage: FC<Props> = ({ project }) => {
  return (
    <div className="text-center">
      <img
        loading="lazy"
        alt={project.title}
        className={classNames(css.projectImage, "w-100")}
        src={`/images/projects/${project.id}/640.jpg`}
      />
    </div>
  );
};
