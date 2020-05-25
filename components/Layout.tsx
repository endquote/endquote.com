import Head from "next/head";
import Router from "next/router";
import { FC, ReactNode, useEffect } from "react";
import { Container } from "react-bootstrap";
import { BASE_HREF, DEV } from "../data/constants";
import { trackPageView } from "../utils/tracking";
import { Footer } from "./Footer";
import { Header } from "./Header";

export type LayoutProps = {
  title: string;
  active?: string;
  strings: any;
  children: ReactNode;
  nosubscribe?: boolean;
  description?: string;
  image?: string;
  blockSearch?: boolean;
};

export const Layout: FC<LayoutProps> = ({
  title,
  active,
  strings = {},
  children,
  nosubscribe = false,
  description = "",
  image = "",
  blockSearch = false,
}) => {
  const stripLinks = (input: string): string => {
    return input.replace(/<[\/]?a.*?>/gi, "");
  };

  useEffect(() => {
    trackPageView();
  }, []);

  function handleRouteChange(url: string): void {
    trackPageView(url);
  }

  useEffect(() => {
    Router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  const head = (): ReactNode => {
    title = stripLinks(
      title || "Josh Santangelo - emerging technology leadership"
    );
    description = stripLinks(description || "");
    image = `${BASE_HREF}${image || "images/collage-td.jpg"}`;

    return (
      <Head>
        <title>{title}</title>

        <link
          rel="alternate"
          type="application/json"
          href={`${BASE_HREF}/api/feed`}
        />

        {blockSearch && (
          <meta
            name="robots"
            content="noindex, nofollow, noarchive, nosnippet"
          />
        )}

        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Josh Santangelo" />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:image:url" content={image} />
        <meta property="og:image:secure_url" content={image} />

        <meta name="name" content={title} />
        <meta name="headline" content={title} />
        <meta name="description" content={description} />
        <meta name="image" content={image} />
        <meta name="author" content="endquote" />
        <meta name="publisher" content="Josh Santangelo" />

        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@endquote" />

        {/* https://realfavicongenerator.net */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/images/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/images/favicon/safari-pinned-tab.svg"
          color="#000000"
        />
        <link rel="shortcut icon" href="/images/favicon/favicon.ico" />
        <meta name="apple-mobile-web-app-title" content="Josh Santangelo" />
        <meta name="application-name" content="Josh Santangelo" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="msapplication-config"
          content="/images/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#ffffff" />
      </Head>
    );
  };

  const matomo = (): ReactNode => {
    if (DEV) {
      return <div />;
    }

    const tracker = `
      <script type="text/javascript">
        var _paq = window._paq || [];
        _paq.push(["setCookieDomain", "*.endquote.com"]);
        _paq.push(["setDomains", ["*.endquote.com"]]);
        // _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function() {
          var u="//matomo.endquote.com/";
          _paq.push(['setTrackerUrl', u+'matomo.php']);
          _paq.push(['setSiteId', '1']);
          var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
          g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
        })();
      </script>
    `;

    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: tracker }}></div>
        <noscript>
          <img
            src="//matomo.endquote.com/matomo.php?rec=1&amp;idsite=1&amp;rec=1"
            style={{ border: 0 }}
          />
        </noscript>
      </>
    );
  };

  return (
    <>
      {head()}
      <div className="bg-white pb-3">
        <Header active={active} />
        <Container className="content">{children}</Container>
      </div>

      <Footer nosubscribe={nosubscribe} strings={strings} />
      {matomo()}
    </>
  );
};

export default Layout;
