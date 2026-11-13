import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Perpetual — Nonprofit OS + Donor Marketplace";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "36px",
              fontWeight: 700,
            }}
          >
            P
          </div>
          <span
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "white",
            }}
          >
            Perpetual
          </span>
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          The operating system for perpetual impact
        </div>
        <div
          style={{
            display: "flex",
            gap: "24px",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              padding: "12px 24px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "12px",
              color: "white",
              fontSize: "18px",
            }}
          >
            AI-Powered Nonprofit OS
          </div>
          <div
            style={{
              padding: "12px 24px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "12px",
              color: "white",
              fontSize: "18px",
            }}
          >
            Outcome-Based Donor Marketplace
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
