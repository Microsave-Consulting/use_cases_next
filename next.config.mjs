/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/use-cases-next',   // e.g. '/use-cases-next'
  images: {
    unoptimized: true,           // already set — required for static export
  },
};
export default nextConfig;