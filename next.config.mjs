/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/use_cases_next",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};
export default nextConfig;
