import { Helmet } from "react-helmet-async";

interface SEOMetaProps {
  title: string;
  description: string;
  canonicalUrl?: string;
}

export const SEOMeta = ({ title, description, canonicalUrl }: SEOMetaProps) => {
  const fullTitle = `${title} | MathGraph`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};
