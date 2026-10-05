import { Helmet } from "react-helmet-async";

const SITE = "HoneyPot Studio";
const BASE_URL = "https://honeypotstudio.com.au";

const SEO = ({ title, description, path = "/", image, imageAlt, type = "website", jsonLd }) => {
  const fullTitle = title ? `${title} | ${SITE}` : `${SITE} — We Build Websites That Work`;
  const url = `${BASE_URL}${path}`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
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
