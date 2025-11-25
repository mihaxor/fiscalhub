import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: false,
    turbopack: {},
    images: {
        minimumCacheTTL: 14400 // default value
    },
};

export default nextConfig;
