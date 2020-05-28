import { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { PostMeta } from "../../components/PostMeta";
import { Post } from "../../data/posts";

type Props = {
  post: Post;
};

export const PostPage: FC<Props> = ({ post }) => {
  const router = useRouter();
  const Contents = dynamic(() =>
    import(`../../public/posts/${router.query.id}/content`)
  );

  return (
    <>
      <Row>
        <Col>
          <PostMeta title={post.title} draft={post.draft} date={post.date} />
        </Col>
      </Row>
      <Contents />
    </>
  );
};

export default PostPage;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const posts = await import("../../data/posts");
  // const strings = await import("../../data/strings");
  const post = posts.posts.find((p) => p.id === params?.id) as Post;

  return {
    props: {
      post,
      title: post.title,
      description: post.summary,
      image: post.image,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await import("../../data/posts");

  return {
    paths: posts.posts.map((p) => {
      return { params: { id: p.id } };
    }),
    fallback: false,
  };
};
