import classNames from "classnames";
import Link from "next/link";
import { FC, SyntheticEvent, useEffect, useRef, useState } from "react";
import { Card } from "react-bootstrap";
import { htmlToReact } from "../utils/htmlToReact";
import css from "./ContentCard.module.scss";

export type ContentItem = {
  id: string;
  title: string;
  link: string;
  image: string;
  href?: string;
  summary: string;
};

type Props = {
  item: ContentItem;
};

export const ContentCard: FC<Props> = ({ item }) => {
  const img = useRef<HTMLImageElement>(null!);
  const container = useRef<HTMLDivElement>(null!);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (img.current) {
      setLoaded(img.current.complete);
    }
  }, [img.current]);

  function imageLoaded(e: SyntheticEvent<HTMLImageElement, Event>) {
    if (img.current) {
      setLoaded(img.current.complete);
    }
  }

  function imageLink(item: ContentItem) {
    const cardLink = (
      <a className="card-link" href={item.link}>
        <img
          className="card-img-top"
          ref={img}
          src={item.image || ""}
          onLoad={imageLoaded}
        />
      </a>
    );
    if (item.link.startsWith("http")) {
      return cardLink;
    }
    return (
      <Link href={item.href || item.link} as={item.link} passHref={true}>
        {cardLink}
      </Link>
    );
  }

  function titleLink(item: ContentItem) {
    const cardTitle = (
      <a className="card-link" href={item.link}>
        <Card.Title className="h5">{item.title}</Card.Title>
      </a>
    );

    if (item.link.startsWith("http")) {
      return cardTitle;
    }

    return (
      <Link href={item.href || item.link} as={item.link} passHref={true}>
        {cardTitle}
      </Link>
    );
  }

  return (
    <div ref={container}>
      <Card
        className={classNames(css.thumb, loaded ? null : css.loading, "h-100")}
      >
        {imageLink(item)}
        <Card.Body>
          {titleLink(item)}
          <Card.Text>{htmlToReact(item.summary)}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};
