import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { BRAND } from "../config";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  // Gradiente se move levemente (parallax sutil)
  const gradientY = interpolate(frame, [0, 150], [0, -30], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Gradiente base */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(160deg, ${BRAND.azulConsulado} 0%, ${BRAND.azulPassaporte} 50%, #1a4a5e 100%)`,
          transform: `translateY(${gradientY}px)`,
        }}
      />

      {/* Círculo decorativo turquesa */}
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -200,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BRAND.turquesa}22 0%, transparent 70%)`,
        }}
      />

      {/* Círculo coral inferior */}
      <div
        style={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BRAND.coral}18 0%, transparent 70%)`,
        }}
      />

      {/* SVG avião watermark */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          right: 60,
          opacity: 0.06,
        }}
      >
        <svg width="300" height="300" viewBox="0 0 72 72" fill="none">
          <path d="M8 38 L56 20 L48 52 L36 42 Z" fill="white" />
          <path d="M28 44 L20 58 L36 42 Z" fill={BRAND.turquesa} />
          <path d="M48 52 L54 62 L44 56 Z" fill="white" opacity="0.5" />
          <circle cx="34" cy="34" r="2.5" fill={BRAND.areia} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
