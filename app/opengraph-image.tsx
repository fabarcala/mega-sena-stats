import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mega Sena Stats — Estatísticas e análises dos sorteios";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#005CA9",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Bolinhas decorativas */}
        <div style={{ display: "flex", gap: 16, marginBottom: 40 }}>
          {[1, 4, 17, 32, 51, 60].map((n) => (
            <div
              key={n}
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "#5BB745",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 28,
                fontWeight: "bold",
              }}
            >
              {n}
            </div>
          ))}
        </div>

        {/* Título */}
        <div
          style={{
            fontSize: 64,
            fontWeight: "bold",
            color: "white",
            letterSpacing: -1,
          }}
        >
          Mega Sena Stats
        </div>

        {/* Subtítulo */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.8)",
            marginTop: 16,
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Estatísticas completas de todos os sorteios da Mega-Sena
        </div>

        {/* URL */}
        <div
          style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.5)",
            marginTop: 40,
          }}
        >
          mega-sena-stats.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
