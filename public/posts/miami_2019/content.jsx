import classNames from "classnames";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Col, Row } from "react-bootstrap";
import twemoji from "twemoji";
import css from "../../../pages/post/post.module.scss";
import { htmlToReact } from "../../../utils/htmlToReact";
import { checkinDay, checkins } from "./checkins";
// import olCss from "./content.module.css";
const CheckinMap = dynamic(() => import("./CheckinMap"), {
  ssr: false,
});

export default function Post() {
  const shots = [];
  shots[3] =
    "https://untitledartfairs.com/miami-beach/program/special/v/deborah-oropallo-and-andy-rappaport";
  shots[4] = "https://www.artbasel.com/miami-beach";
  shots[5] = "https://www.artsy.net/artist/chul-hyun-ahn";
  shots[6] =
    "https://gagosian.com/news/2019/11/09/extreme-present-exhibition-deitch-moore-building-miami/";

  function dayList(day) {
    return (
      <>
        <a href={shots[day]}>
          <img
            src={`/posts/miami_2019/shot_${day}.jpg`}
            width="500"
            loading="lazy"
            className={classNames("float-lg-right", css.imgFloat)}
          />
        </a>
        <ul className={classNames("clearfix", css.emojiList)}>
          {checkinDay(day).map((c) => (
            <li key={c.id}>
              <div className={css.emojiBullet}>
                {htmlToReact(twemoji.parse(c.emoji))}
              </div>
              <a href={c.url}>{c.name}</a> - {htmlToReact(c.description)}
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <>
      <Row>
        {/* prettier-ignore */}
        <Col>
<p>I wasn't able to do a big intercontinental vacation this year, so my lady and I took an easier trip to Miami for art week, which consists of many art fairs, exhibitions, parties, and related events. We developed a rough itinerary with Mary leading on food and me on art, but kept it fairly flexible. Here's how it worked out.</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <CheckinMap
            center={[-80.164126, 25.791679]}
            zoom={13.8899}
            mobileCenter={[-80.132292, 25.788683]}
            mobileZoom={14.3618}
            checkins={checkins}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <h4>Wednesday</h4>
          {dayList(3)}

          <h4>Thursday</h4>
          {dayList(4)}

          <h4>Friday</h4>
          {dayList(5)}

          <h4>Saturday</h4>
          {dayList(6)}
        </Col>
      </Row>
      <Row>
        {/* prettier-ignore */}
        <Col>
<h4>But was it any fun?</h4>
<p>Certainly no regrets, and everything pretty much worked out. Wednesday-Saturday were good days to be there, as Wednesday is when the VIP previews transition into access for the general riff-raff like myself. If we'd stayed until Sunday we could have made it to some of what we missed, like <a href="https://www.newartdealers.org">NADA</a>, <a href="https://scope-art.com">Scope</a>, <a href="https://www.pulseartfair.com">Pulse</a>, <a href="https://www.aquaartmiami.com/">Aqua</a> and <a href="https://thebass.org">The Bass</a>, but honestly I was pooped after four days.</p>
<p>After having been a part of many trade shows in my <Link href="/work"><a>career</a></Link>, it was weird to pay to go to an industry event that wasn't technically in my field, and that I wasn't working at. The cost of tickets to everything definitely added up, and there was an intentional divide between the collectors/VIPs and the specators like us. I guess I'll have to get going on some art projects open that gallery that I keep thinking about.</p>
        </Col>
      </Row>
    </>
  );
}
