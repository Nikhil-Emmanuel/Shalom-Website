import { site } from "@/content/site";
import { Icon } from "@/components/ui/Icon";

/**
 * Embedded Google map of the home.
 *
 * Built from the confirmed pin in content/site.ts rather than a pasted share
 * link, so the map, the "get directions" button and the JSON-LD `geo` all point
 * at one set of coordinates and cannot drift apart.
 *
 * `output=embed` is used deliberately: it needs no Maps API key, so there is no
 * billable account for the home to maintain and no key to leak. The iframe is
 * lazy-loaded — it is well below the fold and pulls in a few hundred kB of
 * Google's script, which should not be on the critical path of a page whose job
 * is to load fast for local search.
 */
export function VisitMap() {
  const { geo, mapsUrl } = site.address;
  if (!geo) return null;

  const embedSrc = `https://maps.google.com/maps?q=${geo.lat},${geo.lng}(${encodeURIComponent(
    site.name,
  )})&z=16&hl=en&output=embed`;

  return (
    <figure className="overflow-hidden rounded-2xl border border-hairline bg-surface-soft shadow-soft">
      <iframe
        src={embedSrc}
        title={`Map showing the location of ${site.name} in ${site.address.locality}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="block h-[22rem] w-full border-0 sm:h-[26rem]"
      />

      <figcaption className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline px-5 py-4 sm:px-6">
        <p className="text-sm text-muted">
          Near Shirdi Sai Temple, Hennur Cross
          {site.address.postalCode ? ` — ${site.address.postalCode}` : ""}.
        </p>

        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            <Icon name="MapPin" className="size-4" />
            Get directions
            <Icon name="ArrowUpRight" className="size-3.5" />
          </a>
        )}
      </figcaption>
    </figure>
  );
}
