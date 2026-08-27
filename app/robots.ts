import type { MetadataRoute } from 'next';

const privateRoutes = ['/admin', '/api', '/unlock', '/upload'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: privateRoutes,
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: privateRoutes,
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: privateRoutes,
      },
    ],
    sitemap: 'https://www.unikmo.com/sitemap.xml',
  };
}
