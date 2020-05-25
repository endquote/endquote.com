import fetch from "isomorphic-unfetch";
import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import {
  SUBSCRIBE_API,
  SUBSCRIBE_APIKEY,
  SUBSCRIBE_LIST,
} from "../data/constants";

type Props = {
  strings: any;
  invert: boolean;
};

export const Subscribe: FC<Props> = ({ strings, invert = false }) => {
  const email = useRef<HTMLInputElement>(null!);

  const submitStates = [strings.prompt, strings.success, strings.fail];
  const [submitState, setSubmitState] = useState(0);

  useEffect(() => {
    if (email.current) {
      email.current.value = "";
    }
  }, [submitState, email.current]);

  // https://sendy.co/api
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    const formData = new FormData();
    formData.append("email", email.current.value);
    formData.append("list", SUBSCRIBE_LIST);
    formData.append("api_key", SUBSCRIBE_APIKEY);
    formData.append("boolean", "true");

    try {
      const res = await fetch(SUBSCRIBE_API, {
        method: "POST",
        body: formData,
      });

      const result = await res.text();
      const success = result === "Already subscribed." || result === "1";

      console.log("sendy response", result);
      console.log("success", success);

      setSubmitState(success ? 1 : 2);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Form onSubmit={onSubmit} method="POST" action={SUBSCRIBE_API}>
      <Form.Control type="hidden" name="list" value={SUBSCRIBE_LIST} />
      <Row>
        <Col sm={12} md={8} lg={8} className={`pb-3`}>
          <Form.Control
            type="email"
            ref={email}
            name="email"
            className={`form-control ${
              invert ? "border-white" : "border-dark"
            }`}
            autoComplete="email"
            placeholder={submitStates[submitState]}
          />
        </Col>
        <Col sm={12} md={4} lg={4}>
          <Button
            variant={invert ? "outline-light" : "outline-dark"}
            type="submit"
            className={`btn w-100`}
          >
            {strings.submit}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
