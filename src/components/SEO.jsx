import { Helmet } from 'react-helmet-async'

export default function SEO({ 
  title = 'tseboIQ - AI-Powered Recruitment Platform',
  description = 'Connect talent with opportunity through intelligent AI-powered matching. Find jobs or hire candidates faster with tseboIQ.',
  keywords = 'AI recruitment, job matching, South Africa jobs, hiring platform, CV parsing, automated recruitment',
  ogImage = '/og-image.jpg',
  ogUrl = 'https://tseboiq.com'
}) {
  const fullTitle = title.includes('tseboIQ') ? title : `${title} | tseboIQ`

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={ogUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content="tseboIQ" />
      <link rel="canonical" href={ogUrl} />
    </Helmet>
  )
}
