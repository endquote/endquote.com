import fetch from "isomorphic-unfetch";
import { FC, useEffect, useRef, useState } from "react";
import {
  SUBSCRIBE_API,
  SUBSCRIBE_APIKEY,
  SUBSCRIBE_LIST,
} from "../data/constants";

interface Props {
  strings: any;
  invert: boolean;
}

export const Subscribe: FC<Props> = ({ strings, invert = false }) => {
  const email = useRef<HTMLInputElement>();

  const submitStates = [strings.prompt, strings.success, strings.fail];
  const [submitState, setSubmitState] = useState(0);

  useEffect(() => {
    if (email.current) {
      email.current.value = "";
    }
  }, [submitState, email.current]);

  // https://sendy.co/api
  async function onSubmit(event) {
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
    <form onSubmit={onSubmit} method="POST" action={SUBSCRIBE_API}>
      <input type="hidden" name="list" value={SUBSCRIBE_LIST} />
      <div className="row">
        <div className={`col col-sm-12 col-md-8 col-lg-8 pb-3`}>
          <input
            ref={email}
            name="email"
            className={`form-control ${
              invert ? "border-white" : "border-dark"
            }`}
            autoComplete="email"
            placeholder={submitStates[submitState]}
          />
        </div>
        <div className={`col col-sm-12 col-md-4 col-lg-4`}>
          <button
            type="submit"
            className={`btn w-100 ${
              invert ? "btn-outline-light" : "btn-outline-dark"
            }`}
            onClick={onSubmit}
          >
            {strings.submit}
          </button>
        </div>
      </div>
    </form>
  );
};
