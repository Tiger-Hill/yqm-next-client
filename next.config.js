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
      "www.3bgsupply.com",
      // "sesame-nextjs-client-9ef12e543138.herokuapp.com",
      // "sesame-rails-api-e1c881a0dd6f.herokuapp.com",
      // "sesame.sg",
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
