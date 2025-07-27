// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//   },
// }

// export default nextConfig

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: "export", // Required for static export
//   basePath: "/news-website",
//   assetPrefix: "/news-website/",
// };

// module.exports = nextConfig;

const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: isProd ? "/news-website" : "",
  assetPrefix: isProd ? "/news-website/" : "",
};

module.exports = nextConfig;
