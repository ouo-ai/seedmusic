import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Seed Music AI generator studio"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F7F5F3",
          color: "#2A2420",
          padding: "68px",
          fontFamily: "Arial, sans-serif",
          border: "1px solid #E0DEDB",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 999,
              background: "#2A2420",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 18, height: 18, borderRadius: 999, background: "#E8541A" }} />
          </div>
          <div style={{ fontSize: 36, fontWeight: 700 }}>Seed Music</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 74, lineHeight: 1.04, maxWidth: 900, letterSpacing: 0 }}>
            AI music generator for Seed-Music workflows
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.35, color: "#605A57", maxWidth: 850 }}>
            Explore Seed Music lyric drafts, style controls, audio references, and track-ready creative briefs.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#1A9E8F", fontSize: 24 }}>
          seed.music
          <div style={{ width: 220, height: 12, display: "flex", alignItems: "center", gap: 4 }}>
            {Array.from({ length: 18 }).map((_, index) => (
              <div
                key={index}
                style={{
                  width: 6,
                  height: 12 + ((index * 11) % 34),
                  borderRadius: 6,
                  background: index % 2 ? "#1A9E8F" : "#E8541A",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  )
}
