import classNames from "classnames";
import Link from "next/link";
import { FC, SyntheticEvent, useEffect, useRef, useState } from "react";
import { Project } from "../data/projects";
import css from "./ProjectThumb.module.scss";

type Props = {
  project: Project;
};

export const ProjectThumb: FC<Props> = ({ project }) => {
  const img = useRef<HTMLImageElement>(null!);
  const container = useRef<HTMLDivElement>(null!);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(img.current && img.current.complete);
  }, []);

  function imageLoaded(e: SyntheticEvent<HTMLImageElement, Event>) {
    setLoaded(img.current.complete);
  }

  return (
    <div
      className={classNames("my-3", css.thumb, loaded ? null : css.loading)}
      ref={container}
    >
      <Link href="/project/[id]" as={`/project/${project.id}`}>
        <a>
          <div>
            <img
              ref={img}
              loading="lazy"
              onLoad={imageLoaded}
              src={`/images/projects/${project.id}/350.jpg`}
              className={classNames("w-100", css.rounded)}
              srcSet={[
                `/images/projects/${project.id}/640.jpg 640w`,
                `/images/projects/${project.id}/510.jpg 510w`,
                `/images/projects/${project.id}/350.jpg 350w`,
                `/images/projects/${project.id}/290.jpg 290w`,
              ].join(",")}
              sizes={[
                "(min-width: 1200px) 350px",
                "(min-width: 992px) 290px",
                "(min-width: 768px) 350px",
                "(min-width: 576px) 510px",
              ].join(",")}
            />
          </div>
          <div
            className={classNames("position-absolute", "m-2", css.container)}
          >
            <div
              className={classNames("position-absolute", "w-100", css.contents)}
            >
              <div className="px-3">
                <h4 className="text-center">{project.title}</h4>
                <div className="text-center">{project.subtitle}</div>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};
