import Head from 'next/head';

const SITE_NAME = 'RUTA · SakayMetrics';

type PageMetaProps = {
  /** Page title, without the site name — that is appended here. */
  title: string;
  description: string;
};

/**
 * Per-page document head. Every page renders one, so titles and social preview
 * tags are defined in a single place instead of being repeated or forgotten.
 */
export default function PageMeta({ title, description }: PageMetaProps) {
  const fullTitle = `${title} · ${SITE_NAME}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
    </Head>
  );
}
