import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/unlock', '/upload'],
      },
    ],
    sitemap: 'https://www.unikmo.com/sitemap.xml',
  };
}
