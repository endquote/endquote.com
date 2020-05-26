import { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { ContentCard, ContentItem } from "./ContentCard";

type Props = {
  items: Array<ContentItem>;
};

export const ContentList: FC<Props> = ({ items = [] }) => {
  return (
    <Row className="row-cols-1 row-cols-md-2 row-cols-lg-2">
      {items.map((item) => (
        <Col className="mb-4" key={item.id}>
          <ContentCard item={item} />
        </Col>
      ))}
    </Row>
  );
};
