/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.unsplash.com' },
    { protocol: 'https', hostname: 'cdn.shopify.com' },
    { protocol: 'https', hostname: 'res.cloudinary.com' },
    { protocol: 'https', hostname: 'i.pinimg.com' },
  ],
}

};

module.exports = nextConfig;
