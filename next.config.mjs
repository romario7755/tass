/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: ".",
  },
  output: 'standalone',
  trailingSlash: false,
}

export default nextConfig