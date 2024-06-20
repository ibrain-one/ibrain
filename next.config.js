/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // webpack: (config) => {
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //     sharp$: false,
  //     'onnxruntime-node$': false,
  //   };

  //   return config;
  // },
  // experimental: {
  //   serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
  // },
}

module.exports = nextConfig