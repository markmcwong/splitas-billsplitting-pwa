const runtimeCaching = require("./runtime-cache");

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false,
  //process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/_offline",
  },
  runtimeCaching,
  customWorkerDir: "customworker",
});

module.exports = withPWA({
  reactStrictMode: true,
  async redirects() {
    return [
      // {
      //   source: "/",
      //   destination: "/",
      //   permanent: true,
      // },
    ];
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
});
