import { GetStaticProps } from "next";
import { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { ContentList } from "../components/ContentList";
import { Subscribe } from "../components/Subscribe";
import { DEV } from "../data/constants";
import { Issue } from "../data/issues";
import { htmlToReact } from "../utils/htmlToReact";

type Props = {
  issues: Issue[];
  strings: any;
  subscribeStrings: any;
};

export const Newsletter: FC<Props> = ({
  issues = [],
  strings = {},
  subscribeStrings = {},
}) => {
  if (!DEV) {
    issues = issues.filter((i) => !i.draft && Date.parse(i.date) < Date.now());
  }

  return (
    <>
      <Row>
        <Col>
          <h2>{strings.heading}</h2>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm="12" md="8" lg="6">
          <p>{htmlToReact(strings.copy)}</p>
          <Subscribe strings={subscribeStrings} />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <h3>{strings.previous}</h3>
        </Col>
      </Row>
      <Row>
        <ContentList items={issues} />
      </Row>
    </>
  );
};

export default Newsletter;

export const getStaticProps: GetStaticProps = async (context) => {
  const issues = await import("../data/issues");
  const strings = await import("../data/strings");

  return {
    props: {
      issues: issues.index,
      title: strings.newsletter.title,
      strings: strings.newsletter,
      subscribeStrings: strings.subscribe,
      active: "newsletter",
      nosubscribe: true,
    },
  };
};
