const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://s.ytimg.com https://checkout.shopify.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https://cdn.shopify.com https://i.ytimg.com https://yt3.ggpht.com;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self' https://5ukvua-fk.myshopify.com https://checkout.shopify.com;
  frame-src 'self' https://www.youtube.com https://checkout.shopify.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self' https://checkout.shopify.com;
  frame-ancestors 'none';
  upgrade-insecure-requests;
`

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          }
        ],
      },
    ]
  },
};

export default nextConfig;
