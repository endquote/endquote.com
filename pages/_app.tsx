import { AppProps } from "next/app";
import Error from "next/error";
import Layout from "../components/Layout";
import {
  footer as footerStrings,
  subscribe as subscribeStrings,
} from "../data/strings";
import "../styles/bootstrap.scss";
import "../styles/global.scss";

export default function Endquote({ Component, pageProps }: AppProps) {
  return (
    <Layout
      {...pageProps}
      strings={{ subscribe: subscribeStrings, footer: footerStrings }}
    >
      {pageProps.error ? (
        <Error statusCode={pageProps.error} />
      ) : (
        <Component {...pageProps} />
      )}
    </Layout>
  );
}
