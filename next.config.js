/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },

  images: {
    domains: [
      "",
      "localhost",
      "yqm.app,",
      "yqm-rails-api-265c263d3c2d.herokuapp.com",
      "yqm-nextjs-client-d429d4b9b618.herokuapp.com",
    ],
  },

  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "http",
  //       hostname: "sesame-nextjs-client-9ef12e543138.herokuapp.com/",
  //       // port: "",
  //     },
  //     {
  //       protocol: "https",
  //       hostname: "sesame-rails-api-e1c881a0dd6f.herokuapp.com/",
  //       // port: "",
  //     },
  //     {
  //       protocol: "http",
  //       hostname: "localhost",
  //       port: "3000",
  //     },
  //   ],
  // },
};

module.exports = nextConfig;
