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

    // Expose the __filename and __dirname in modules.
    config.node = config.node || {};
    config.node.__filename = true;

    return config;
  },
});
