export default function sitemap() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://klinikdrghetty.myon.my.id').replace(/\/$/, '');

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];
}
