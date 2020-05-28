import { GetStaticPaths, GetStaticProps } from "next";
import { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { ContentList } from "../../components/ContentList";
import { PostMeta } from "../../components/PostMeta";
import { Subscribe } from "../../components/Subscribe";
import { Issue } from "../../data/issues";
import { htmlToReact } from "../../utils/htmlToReact";

type Props = {
  issue: Issue;
  strings: any;
  subscribeStrings: any;
};

export const IssuePage: FC<Props> = ({
  issue,
  strings = {},
  subscribeStrings = {},
}) => {
  return (
    <>
      <Row>
        <Col>
          <h4>{strings.heading}</h4>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm="12" md="8" lg="6">
          <p>{htmlToReact(strings.copy)}</p>
          <Subscribe strings={subscribeStrings} />
        </Col>
      </Row>
      <Row>
        <Col>
          <PostMeta title={issue.title} draft={issue.draft} date={issue.date} />
          <p>{htmlToReact(issue.intro)}</p>
        </Col>
      </Row>
      <ContentList items={issue.links} />
    </>
  );
};

export default IssuePage;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const issues = await import("../../data/issues");

  const issue = issues.issues.find((i) => i.id === params?.id) as Issue;

  const strings = await import("../../data/strings");

  return {
    props: {
      issue,
      title: issue.title,
      image: issue.image,
      strings: strings.newsletter,
      subscribeStrings: strings.subscribe,
      description: issue.intro,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const issues = await import("../../data/issues");

  return {
    paths: issues.issues.map((i) => {
      return { params: { id: i.id.toString() } };
    }),
    fallback: false,
  };
};
