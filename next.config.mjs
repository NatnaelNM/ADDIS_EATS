/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.arise-app.com" },
      { protocol: "https", hostname: "harambeeafrica.com" },
      { protocol: "https", hostname: "dynamic-media-cdn.tripadvisor.com" },
      { protocol: "https", hostname: "d1w7312wesee68.cloudfront.net" },
      { protocol: "https", hostname: "www.tastingtable.com" },
      { protocol: "https", hostname: "assets.nourishingmeals.com" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "cupofyum.com" },
      { protocol: "https", hostname: "nutriscan.app" },
      {
        protocol: "https",
        hostname: "tkpe6wrwxmgsladx.public.blob.vercel-storage.com",
      },
      { protocol: "https", hostname: "restaurantmerhaba.ch" },
      { protocol: "https", hostname: "static.wixstatic.com" },
    ],
  },
};

export default nextConfig;
