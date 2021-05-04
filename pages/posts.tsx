import { GetStaticProps } from "next";
import { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { ContentList } from "../components/ContentList";
import { DEV } from "../data/constants";
import { Post } from "../data/posts";
import { htmlToReact } from "../utils/htmlToReact";
import css from "./work.module.scss";

type Props = {
  posts: Post[];
  strings: any;
};

export const Posts: FC<Props> = ({ posts = [], strings = {} }) => {
  if (!DEV) {
    posts = posts.filter((p) => !p.draft && Date.parse(p.date) < Date.now());
  }

  return (
    <>
      <Row>
        <Col>
          <h2>{strings.heading}</h2>
          <p className={css.headline}>{htmlToReact(strings.copy)}</p>
        </Col>
      </Row>
      <ContentList items={posts} />
    </>
  );

};

export default Posts;

export const getStaticProps: GetStaticProps = async (context) => {
  const issues = await import("../data/issues");
  const posts = await import("../data/posts");
  const strings = await import("../data/strings");

  const content = posts.posts.concat(issues.index).sort((a, b) => {
    return Date.parse(b.date) - Date.parse(a.date);
  });

  return {
    props: {
      posts: content,
      title: strings.posts.title,
      description: strings.posts.copy,
      strings: strings.posts,
      active: "posts",
    },
  };
};
