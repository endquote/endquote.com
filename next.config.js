const { posts } = require("./data/posts.js");
const { projects } = require("./data/projects.js");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  poweredByHeader: false,
  reactStrictMode: true,

  webpack: (config, options) => {
    // SVG support. https://react-svgr.com
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: { svgo: false },
        },
      ],
    });

    // Expose the __filename in modules.
    config.node = { ...config.node, __filename: true };

    return config;
  },

  async redirects() {
    let routes = [
      {
        // /news > /newsletter
        source: "/news",
        destination: "/newsletter",
      },
      {
        // /issue1 > /issue/1
        source: "/issue:id",
        destination: "/issue/:id",
      },
      {
        // /newsletter/1 > /issue/1
        source: "/newsletter/:id",
        destination: "/issue/:id",
      },
      {
        // /news/1 > /issue/1
        source: "/news/:id",
        destination: "/issue/:id",
      },
      {
        // images/issues/6/origami.jpg > images/newsletter/6/origami.jpg
        source: "/images/newsletter/:issue/:image",
        destination: "/images/issues/:issue/:image",
      },
    ];

    for (const p of projects) {
      // /project_name > /project/project_name
      routes.push({
        source: `/${p.id}`,
        destination: `/project/${p.id}`,
      });

      if (p.id.includes("_")) {
        // /projectname > /project/project_name
        routes.push({
          source: `/${p.id.replace(/_/g, "")}`,
          destination: `/project/${p.id}`,
        });

        // /project/projectname > /project/project_name
        routes.push({
          source: `/project/${p.id.replace(/_/g, "")}`,
          destination: `/project/${p.id}`,
        });
      }
    }

    for (const p of posts) {
      // /post_name > /post/post_name
      routes.push({
        source: `/${p.id}`,
        destination: `/post/${p.id}`,
      });

      if (p.id.includes("_")) {
        // /postname > /post/post_name
        routes.push({
          source: `/${p.id.replace(/_/g, "")}`,
          destination: `/post/${p.id}`,
        });

        // /post/postname > /post/post_name
        routes.push({
          source: `/post/${p.id.replace(/_/g, "")}`,
          destination: `/post/${p.id}`,
        });
      }
    }

    // Add required "permanent" property
    routes = routes.map((r) => ({ ...r, permanent: true }));

    return routes;
  },
});
