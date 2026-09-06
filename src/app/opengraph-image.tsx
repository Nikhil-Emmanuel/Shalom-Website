import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social share card, generated at build time.
 *
 * Filename convention: Next picks this up automatically and writes the
 * og:image / twitter:image tags, so there is nothing to keep in sync by hand.
 *
 * The logo is inlined as a data URL rather than referenced by URL because this
 * runs during the build, when there is no server to fetch `/logo.png` from.
 */
export default async function OpengraphImage() {
  const logo = await readFile(path.join(process.cwd(), "public", "logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#faf8f3",
          padding: "72px 80px",
          // Warm wash in the corner, echoing the hero.
          backgroundImage:
            "radial-gradient(900px 500px at 88% -10%, #e0913a22, transparent 70%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={104} height={118} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 34,
                fontWeight: 700,
                color: "#1a1815",
                letterSpacing: -0.5,
              }}
            >
              {site.name}
            </span>
            <span
              style={{
                fontSize: 21,
                color: "#6e6961",
                marginTop: 6,
              }}
            >
              {site.address.locality} · Registered children&rsquo;s home
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 68,
              lineHeight: 1.12,
              fontWeight: 700,
              color: "#1a1815",
              letterSpacing: -1.6,
              maxWidth: 900,
            }}
          >
            Every child deserves a place to come home to.
          </span>
          <span style={{ fontSize: 27, color: "#3d3a34", marginTop: 26 }}>
            Thirty children live here. Fifty-seven more are taught in the
            villages around us.
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{ width: 64, height: 5, backgroundColor: "#b0522f", borderRadius: 999 }}
          />
          <span style={{ fontSize: 22, color: "#6e6961" }}>
            {site.url.replace(/^https?:\/\//, "")}
          </span>
        </div>
      </div>
    ),
    size,
  );
}
