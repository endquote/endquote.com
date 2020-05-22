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
  const strings = { subscribe: subscribeStrings, footer: footerStrings };

  const content = pageProps.error ? (
    <Error statusCode={pageProps.error} />
  ) : (
    <Component {...pageProps} />
  );

  return (
    <Layout {...pageProps} strings={strings}>
      {content}
    </Layout>
  );
}
