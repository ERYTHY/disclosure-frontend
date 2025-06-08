/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false
};

module.exports = nextConfig;
module.exports = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // or properly configure remote domains if needed
  },
};
