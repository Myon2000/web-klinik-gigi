export default function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: 'Klinik drg. Hetty',
    alternateName: ['Dokter Gigi Hetty Jember', 'Klinik Gigi drg Hetty Kaliwates'],
    image: 'https://images.pexels.com/photos/3845653/pexels-photo-3845653.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description:
      'Klinik dokter gigi terpercaya di Kaliwates, Jember. Melayani perawatan gigi modern: pembersihan karang gigi (scaling), tambal gigi komposit, cabut gigi, behel/ortodonti, pemutihan gigi (whitening), dan perawatan gusi.',
    url: 'https://klinikdrghetty.myon.my.id',
    telephone: '+6285157049112',
    priceRange: 'Rp 100.000 - Rp 3.500.000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. P. Mangkubumi No.I, Kaliwates Kidul',
      addressLocality: 'Kec. Kaliwates, Kabupaten Jember',
      addressRegion: 'Jawa Timur',
      postalCode: '68131',
      addressCountry: 'ID',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -8.1824,
      longitude: 113.6826,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '16:00',
        closes: '21:00',
      },
    ],
    medicalSpecialty: 'Dentistry',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Layanan Perawatan Gigi',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Pembersihan Karang Gigi (Scaling)',
            description: 'Scaling dan pembersihan karang gigi profesional untuk menjaga kesehatan gusi dan gigi.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Tambal Gigi Komposit',
            description: 'Perawatan gigi berlubang menggunakan bahan komposit sewarna gigi yang tahan lama.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Pencabutan Gigi',
            description: 'Prosedur pencabutan gigi yang aman, higienis, dan minim rasa sakit.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Pemutihan Gigi (Whitening)',
            description: 'Treatment bleaching / whitening profesional untuk mencerahkan warna gigi secara alami.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Pemasangan Kawat Gigi (Behel)',
            description: 'Perawatan ortodonti untuk merapikan susunan gigi dan estetika senyum.',
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
