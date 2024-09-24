import path from "path";

const nextConfig = {
  reactStrictMode: true, // React의 Strict Mode 사용
  swcMinify: true, // SWC를 사용하여 JavaScript 코드 압축
  webpack(config, { isServer }) {
    // 필요한 경우 Webpack 설정 수정
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve("./src"),
    };

    // SVG 파일 로딩을 위한 로더 설정 추가
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // 서버 측과 클라이언트 측 설정 분리
    if (isServer) {
      // 서버 측 Webpack 설정
    } else {
      // 클라이언트 측 Webpack 설정
    }

    return config;
  },
};

export default nextConfig;
