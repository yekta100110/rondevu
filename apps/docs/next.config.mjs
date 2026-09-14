import nextra from "nextra";

const withNextra = nextra({});

const nextConfig = {
  reactStrictMode: true,
  
  typescript: {
    // Derleme anında TypeScript hatalarının build'i bozmasını engeller
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint hatalarının build'i bozmasını engeller
    ignoreDuringBuilds: true,
  },
};

export default withNextra(nextConfig);
