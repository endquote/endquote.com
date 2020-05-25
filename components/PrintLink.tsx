import Link from "next/link";
import { FC, ReactNode } from "react";
import { PROD_HREF } from "../data/constants";

type Props = {
  href: string;
  hrefAs: string;
  children: ReactNode;
};

export const PrintLink: FC<Props> = ({ href = "", hrefAs = "", children }) => {
  return (
    <>
      <Link href={href} as={hrefAs}>
        <a className="d-print-none" href={hrefAs || href}>
          {children}
        </a>
      </Link>
      <a
        className="d-none d-print-inline"
        href={`${PROD_HREF}${hrefAs || href}`}
      >
        {children}
      </a>
    </>
  );
};
