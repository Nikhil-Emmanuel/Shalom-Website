import { site, founder, builtBy } from "@/content/site";

/**
 * JSON-LD for the home. Visibility is the entire point of this project, so the
 * structured data has to line up exactly with the Google Business Profile and
 * the JustDial listing-same name, same address, same phone.
 *
 * Fields the home has not confirmed are omitted rather than guessed; a wrong
 * PIN code or phone number in structured data is worse than a missing one.
 */
export function organisationJsonLd() {
  const { address, contact, social, registration } = site;

  const sameAs = [social.instagram, social.facebook].filter(
    (v): v is string => typeof v === "string",
  );

  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": `${site.url}#organisation`,
    name: site.name,
    alternateName: "Shalom Ashram",
    description: site.description,
    url: site.url,
    // Absolute URL required-this is what Google pulls for the knowledge panel.
    logo: `${site.url}${site.logo.src}`,
    image: `${site.url}${site.logo.src}`,
    foundingDate: String(site.founded),
    founder: { "@type": "Person", name: founder.name },
    email: contact.emails[0],
    ...(contact.phone ? { telephone: contact.phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: address.lines.join(", "),
      addressLocality: address.locality,
      addressRegion: address.region,
      ...(address.postalCode ? { postalCode: address.postalCode } : {}),
      addressCountry: address.country,
    },
    ...(address.geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: address.geo.lat,
            longitude: address.geo.lng,
          },
        }
      : {}),
    ...(address.mapsUrl ? { hasMap: address.mapsUrl } : {}),
    identifier: registration.number,
    knowsAbout: [
      "child welfare",
      "residential childcare",
      "education support",
      "village tuition centres",
    ],
    areaServed: { "@type": "City", name: "Bangalore" },
  };
}

/** The site itself, and who built it. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}#website`,
    url: site.url,
    name: site.name,
    inLanguage: "en-IN",
    publisher: { "@id": `${site.url}#organisation` },
    creator: {
      "@type": "Organization",
      name: builtBy.name,
      identifier: `LLPIN ${builtBy.llpin}`,
    },
  };
}
