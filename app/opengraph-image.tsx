import { ImageResponse } from "next/og"

export const alt = "Utku Demirtaş, Backend & DevOps Engineer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0a0708 0%, #1a0d08 55%, #2a1410 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 44 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#ea580c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            UD
          </div>
          <div style={{ fontSize: 24, color: "#fb923c" }}>~/utkudem1rtas</div>
        </div>

        <div style={{ fontSize: 88, fontWeight: 800, letterSpacing: -2 }}>Utku Demirtaş</div>
        <div style={{ fontSize: 42, color: "#fdba74", marginTop: 14 }}>Backend &amp; DevOps Engineer</div>
        <div style={{ fontSize: 26, color: "#a3a3a3", marginTop: 28, maxWidth: 940 }}>
          Real-time engines, secure APIs, CI/CD and containers. Fullstack with a security mindset.
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 46 }}>
          {["Node", "NestJS", "Spring Boot", "Docker", "Kubernetes"].map((tsk) => (
            <div
              key={tsk}
              style={{
                fontSize: 20,
                color: "#e5e5e5",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 8,
                padding: "8px 16px",
              }}
            >
              {tsk}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  )
}
