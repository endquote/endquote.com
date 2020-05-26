import { GetStaticProps } from "next";
import { FC } from "react";
import { Row } from "react-bootstrap";
import { ContentList } from "../components/ContentList";
import { DEV } from "../data/constants";
import { Post } from "../data/posts";

type Props = {
  posts: Post[];
};

export const Posts: FC<Props> = ({ posts = [] }) => {
  if (!DEV) {
    posts = posts.filter((p) => !p.draft && Date.parse(p.date) < Date.now());
  }

  return (
    <Row>
      <ContentList items={posts} />
    </Row>
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
      // title: strings.posts.title,
      active: "posts",
    },
  };
};
