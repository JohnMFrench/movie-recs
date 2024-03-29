/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  crossOrigin: "anonymous",
  images: {
    domains: [
      "popcorn-posters.s3.us-east-2.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
