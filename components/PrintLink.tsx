import Link from "next/link";
import { PROD_HREF } from "../data/constants";

export function PrintLink({ href = "", hrefAs = "", children }) {
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
}
