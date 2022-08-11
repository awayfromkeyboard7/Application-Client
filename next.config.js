/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // 기존에 true, true이면 개발환경에서 초기 렌더링 useEffect 2번되는 현상 발생
  async rewrites() {
    return [
      {
        source: '/server/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_PROVIDER}/api/:path*`,
      },
    ];
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'localhost']
  },
}

module.exports = nextConfig