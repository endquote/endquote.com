import classNames from "classnames";
import { FC } from "react";
import css from "./Method.module.scss";
import MethodSample from "./tiles/samples/methods.svg";

type Props = {
  method: "m0b" | "m1b" | "m0c" | "m1c" | "m2b" | "m2c";
};

export const Method: FC<Props> = ({ method }) => {
  return <MethodSample className={classNames(css.method, css[method])} />;
};

export default Method;
