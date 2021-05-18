import classNames from "classnames";
import { GetStaticProps } from "next";
import { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { PrintLink } from "../components/PrintLink";
import { Experience, Role } from "../data/experience";
import { query as projectQuery } from "../data/projects";
import { year } from "../utils/formatDate";
import { htmlToReact } from "../utils/htmlToReact";
import css from "./about.module.scss";

function RoleRow({ role, date = true }: { role: Role; date: boolean }) {
  return (
    <div className="mb-4">
      <h5>{htmlToReact(role.company)}</h5>
      <Row className="mb-1">
        <Col xs={12} sm={6}>
          <strong>{htmlToReact(role.title)}</strong>
        </Col>
        <Col
          xs={12}
          sm={6}
          className={classNames("text-left", "text-sm-right")}
        >
          {role.location}
          <span className={!date ? "d-none" : ""}>
            , {year(role.start)}-{role.end ? year(role.end) : "present"}
          </span>
        </Col>
      </Row>
      <p>{htmlToReact(role.desc)}</p>
      <ul className={!role.accomplishments.length ? "d-none" : ""}>
        {role.accomplishments.map((a, i) => (
          <li key={i}>{htmlToReact(a)}</li>
        ))}
      </ul>
    </div>
  );
}

type Props = {
  exp: Experience;
  strings: any;
};

export const About: FC<Props> = ({ strings, exp }) => {
  return (
    <div className="content">
      <Row>
        <Col sm={12} md={3} lg={3}>
          <h4 className={classNames(css.headline, "d-none d-print-block")}>
            Josh Santangelo
          </h4>
          <h6 className={css.email}>
            <a className={css.noline} href="mailto:josh@endquote.com">
              josh@endquote.com
            </a>
          </h6>
          <h6 className={classNames(css.email, css.webLink)}>
            <a className={css.noline} href="https://endquote.com">
              www.endquote.com
            </a>
          </h6>
          <h6 className={classNames(css.email, css.webLink)}>
            <a className={css.noline} href="tel:+12062295674">
              +1 (206) 229-5674
            </a>
          </h6>
        </Col>
        <Col sm={12} md={9} lg={9}>
          <h4 className={css.headline}>{htmlToReact(strings.headline)}</h4>
          {strings.summary.map((s: string, i: number) => (
            <p key={i}>{htmlToReact(s)}</p>
          ))}
        </Col>
      </Row>
      <Row className="mb-4">
        <Col sm={12} md={3} lg={3}>
          <h5>
            <strong>{strings.skills}</strong>
          </h5>
        </Col>
        <Col sm={12} md={9} lg={9}>
          <Row>
            <Col sm={12} md={12} lg={6}>
              <ul className="mb-0">
                {exp.skills.slice(0, 2).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </Col>
            <Col sm={12} md={12} lg={6}>
              <ul className="mb-0">
                {exp.skills.slice(2).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </Col>
          </Row>
        </Col>
      </Row>

      {exp.roles.map((r, i) => (
        <Row key={i}>
          <Col sm={12} md={3} lg={3}>
            {i === 0 ? <h5>{strings.experience}</h5> : ""}
          </Col>
          <Col sm={12} md={9} lg={9}>
            <RoleRow role={r} key={i} date={true} />
          </Col>
        </Row>
      ))}

      {exp.additional.map((r, i) => (
        <Row key={i}>
          <Col sm={12} md={3} lg={3}>
            {i === 0 ? <h5>{strings.additional}</h5> : ""}
          </Col>
          <Col sm={12} md={9} lg={9}>
            <RoleRow role={r} key={i} date={false} />
          </Col>
        </Row>
      ))}

      <Row className="mb-3">
        <Col sm={12} md={3} lg={3}>
          <h5>
            <strong>{strings.education}</strong>
          </h5>
        </Col>
        <Col sm={12} md={9} lg={9}>
          {exp.education.map((r, i) => (
            <div key={i}>
              <h5>{htmlToReact(r.company)}</h5>
              <Row className="mb-1">
                <Col xs={12} sm={6}>
                  <strong>{htmlToReact(r.title)}</strong>
                </Col>
              </Row>
              <p className="mb-4">{htmlToReact(r.desc)}</p>
            </div>
          ))}
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={12} md={3} lg={3}>
          <h5>
            <strong>{strings.honors}</strong>
          </h5>
        </Col>
        <Col sm={12} md={9} lg={9}>
          {exp.honors
            .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
            .map((h, i) => (
              <div key={i}>
                <Row className="mb-1">
                  <Col sm={12} lg={7}>
                    <strong>{htmlToReact(h.title)}</strong>
                  </Col>
                  <Col sm={12} lg={5} className="text-left text-lg-right">
                    {h.entity}, {year(h.date)}
                  </Col>
                </Row>
                <p>{htmlToReact(h.description)}</p>
              </div>
            ))}
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={12} md={3} lg={3}>
          <h5>
            <strong>{strings.awards}</strong>
          </h5>
        </Col>
        <Col sm={12} md={9} lg={9}>
          <ul>
            {exp.awards.map((a, i) => (
              <li key={i}>
                {htmlToReact(a.title)}, {a.entity},{" "}
                <PrintLink
                  href="/project/[id]"
                  hrefAs={`/project/${a.project}`}
                >
                  {projectQuery(a.project)?.title}
                </PrintLink>
                , {year(a.date)}
              </li>
            ))}
          </ul>
        </Col>
      </Row>
      <Row>
        <Col sm={12} md={3} lg={3}>
          <h5>
            <strong>{strings.volunteering}</strong>
          </h5>
        </Col>
        <Col sm={12} md={9} lg={9}>
          <ul>
            {exp.volunteering.map((v, i) => (
              <li key={i}>
                {htmlToReact(v.role)}, <a href={v.link}>{v.entity}</a>,{" "}
                {year(v.date)}
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </div>
  );
};

export default About;

export const getStaticProps: GetStaticProps = async (context) => {
  const projects = await import("../data/projects");
  const strings = await import("../data/strings");
  const exp = await import("../data/experience");

  return {
    props: {
      title: "Josh Santangelo",
      exp: exp.experience,
      strings: strings.about,
      description: strings.about.summary.join(" "),
      active: "about",
    },
  };
};
