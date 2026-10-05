import { Helmet } from "react-helmet-async";

const SITE = "HoneyPot Studio";
const BASE_URL = "https://myscapez.com";

const SEO = ({ title, description, path = "/", image, imageAlt, type = "website", jsonLd, noIndex = false }) => {
  const fullTitle = title ? `${title} | ${SITE}` : `${SITE} — We Build Websites That Work`;
  const url = `${BASE_URL}${path}`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="author" content="Jai Butchers" />
      <meta name="creator" content="Jai Butchers" />
      <meta name="publisher" content={SITE} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large"} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
};

export default SEO;
