/**
 * @type {import('next').NextConfig}
 */

const isStaticExport = 'false';

const nextConfig = {
  trailingSlash: true,
  env: {
    BUILD_STATIC_EXPORT: isStaticExport,
  },
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}',
    },
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        tls: false,
        net: false, // Disables the polyfill for 'net' module
        dgram: false, // Disables the polyfill for 'dgram' module
        dns: false, // Disables the polyfill for 'dgram' module
      };
    }

    if (process.env.VERCEL_ENV === 'preview') {
      config.optimization.minimize = false;
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  ...(isStaticExport === 'true' && {
    output: 'export',
  }),
  experimental: {
    turbo: {
      useSwcCss: true,
      root: '..',
      resolveAlias: {
        react: './node_modules/@types/react',
        fs: { browser: './node-browser-compatibility.js' },
        net: { browser: './node-browser-compatibility.js' },
        dns: { browser: './node-browser-compatibility.js' },
        tls: { browser: './node-browser-compatibility.js' },
        crypto: { browser: 'crypto-browserify' },
      },
    },
  },
};

export default nextConfig;
