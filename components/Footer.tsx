import Github from "@fortawesome/fontawesome-free/svgs/brands/github-square.svg";
import Instagram from "@fortawesome/fontawesome-free/svgs/brands/instagram.svg";
import LinkedIn from "@fortawesome/fontawesome-free/svgs/brands/linkedin.svg";
import Twitter from "@fortawesome/fontawesome-free/svgs/brands/twitter-square.svg";
import { FC } from "react";
import { Col, Container, Row } from "react-bootstrap";
import css from "./Footer.module.scss";
import { Subscribe } from "./Subscribe";

type Props = {
  strings: any;
  nosubscribe: boolean;
};

export const Footer: FC<Props> = ({ strings, nosubscribe = false }) => {
  return (
    <footer className="text-white mt-5">
      <Container>
        <Row>
          <Col sm={12} md={6} lg={6} className={`mb-5`}>
            <h5>{strings.contact}</h5>
            <p className="mb-2">
              <a className="email" href="mailto:josh@endquote.com">
                josh@endquote.com
              </a>
            </p>
            <div className="ml-n2">
              <a
                href="https://linkedin.com/in/endquote/"
                className="px-2 py-2 mr-1"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
              >
                <LinkedIn className={css.icon} />
              </a>
              <a
                href="https://instagram.com/endquote/"
                className="px-2 py-2 mr-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
              >
                <Instagram className={css.icon} />
              </a>
              <a
                href="https://twitter.com/endquote/"
                className="px-2 py-2 mr-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Twitter"
              >
                <Twitter className={css.icon} />
              </a>
              <a
                href="https://github.com/endquote/"
                className="px-2 py-2 mr-1"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
              >
                <Github className={css.icon} />
              </a>
            </div>
          </Col>
          <Col
            sm={12}
            md={6}
            lg={6}
            className={`mb-5 ${nosubscribe ? "d-none" : ""}`}
          >
            <h5>{strings.footer.subscribe}</h5>
            <Subscribe invert={true} strings={strings.subscribe} />
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
