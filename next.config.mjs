/** @type {import('next').NextConfig} */
const BASE_PATH = "/use_cases_next";

const nextConfig = {
  output: "export",
  basePath: BASE_PATH,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
};
export default nextConfig;
