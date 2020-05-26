import { FC } from "react";
import { formatDate } from "../utils/formatDate";
import css from "./PostMeta.module.scss";

type Props = {
  title: string;
  draft?: boolean;
  date: string;
};

export const PostMeta: FC<Props> = ({ title, draft = false, date }) => {
  return (
    <>
      <h2>{title}</h2>
      <p className={draft ? css.draft : "d-none"}>draft</p>
      <p className={draft ? "d-none" : ""}>{formatDate(date)}</p>
    </>
  );
};
