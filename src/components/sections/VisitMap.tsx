"use client";

import { site } from "@/content/site";
import { useConsent } from "@/lib/consent";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/**
 * Embedded Google map of the home.
 *
 * Built from the confirmed pin in content/site.ts rather than a pasted share
 * link, so the map, the "get directions" button and the JSON-LD `geo` all point
 * at one set of coordinates and cannot drift apart.
 *
 * `output=embed` is used deliberately: it needs no Maps API key, so there is no
 * billable account for the home to maintain and no key to leak.
 *
 * The iframe is not rendered until consent is given-not merely hidden. An
 * iframe in the DOM has already made the request, so hiding one would make the
 * cookie notice a lie. Until then the panel explains itself and offers a plain
 * link out, which needs no permission from anyone.
 */
export function VisitMap() {
  const { geo, mapsUrl } = site.address;
  const [consent, decide] = useConsent();

  if (!geo) return null;

  const embedSrc = `https://maps.google.com/maps?q=${geo.lat},${geo.lng}(${encodeURIComponent(
    site.name,
  )})&z=16&hl=en&output=embed`;

  return (
    <figure className="overflow-hidden rounded-2xl border border-hairline bg-surface-soft shadow-soft">
      {consent === "granted" ? (
        <iframe
          src={embedSrc}
          title={`Map showing the location of ${site.name} in ${site.address.locality}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="block h-[22rem] w-full border-0 sm:h-[26rem]"
        />
      ) : (
        <div className="flex h-[22rem] flex-col items-center justify-center gap-4 px-6 text-center sm:h-[26rem]">
          <Icon name="MapPin" className="size-8 text-primary/60" />
          <p className="max-w-sm text-sm leading-relaxed text-body">
            The map is loaded from Google, which may set cookies in your
            browser. We do not load it until you say so.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => decide("granted")}>Show the map</Button>
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Open in Google Maps
                <Icon name="ArrowUpRight" className="size-3.5" />
              </a>
            )}
          </div>
        </div>
      )}

      <figcaption className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline px-5 py-4 sm:px-6">
        <p className="text-sm text-muted">
          Near Shirdi Sai Temple, Hennur Cross
          {site.address.postalCode ? `-${site.address.postalCode}` : ""}.
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
