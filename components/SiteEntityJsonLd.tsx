export default function SiteEntityJsonLd() {
  const entityGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://www.unikmo.com/#organization',
        name: 'UNIKMO',
        url: 'https://www.unikmo.com/',
        description:
          'UNIKMO creates physical keepsake cards that unlock a private digital memory such as a video, voice note, photo, or written message.',
        logo: {
          '@type': 'ImageObject',
          '@id': 'https://www.unikmo.com/#logo',
          url: 'https://www.unikmo.com/unikmo-logo-header.png',
          contentUrl: 'https://www.unikmo.com/unikmo-logo-header.png',
          caption: 'UNIKMO',
        },
        brand: { '@id': 'https://www.unikmo.com/#brand' },
      },
      {
        '@type': 'Brand',
        '@id': 'https://www.unikmo.com/#brand',
        name: 'UNIKMO',
        url: 'https://www.unikmo.com/',
        description:
          'A physical card that gives someone a private route back to a video, voice note, photo, or written message.',
        logo: { '@id': 'https://www.unikmo.com/#logo' },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.unikmo.com/#website',
        url: 'https://www.unikmo.com/',
        name: 'UNIKMO',
        description:
          'Official website for UNIKMO physical memory cards and private digital moments.',
        publisher: { '@id': 'https://www.unikmo.com/#organization' },
        inLanguage: 'en',
        hasPart: [
          {
            '@type': 'WebPage',
            '@id': 'https://www.unikmo.com/how-unikmo-works#webpage',
            url: 'https://www.unikmo.com/how-unikmo-works',
            name: 'How UNIKMO Works',
          },
          {
            '@type': 'WebPage',
            url: 'https://www.unikmo.com/faq',
            name: 'UNIKMO FAQ',
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(entityGraph) }}
    />
  );
}
