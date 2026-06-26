import { Helmet } from "react-helmet-async";

interface SEOMetaProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  imageUrl?: string;
}

export const SEOMeta = ({
  title,
  description,
  canonicalUrl,
  imageUrl,
}: SEOMetaProps) => {
  const fullTitle = `${title} | MathGraph`;
  const defaultImage = "https://mathgraph.com/default-share-image.png";
  const finalImage = imageUrl || defaultImage;
  const finalUrl =
    canonicalUrl || (typeof window !== "undefined" ? window.location.href : "");
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:image" content={finalImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalImage} />
    </Helmet>
  );
};
