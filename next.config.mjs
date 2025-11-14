/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb', // allows uploads up to 10MB
        },
    },
};

export default nextConfig;
