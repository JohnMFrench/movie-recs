/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  crossOrigin: "anonymous",
  images: {
    domains: [
      "johnmfrench-movie-recs-public-posters.s3.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
