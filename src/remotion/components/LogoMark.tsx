import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND } from "../config";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";

const { fontFamily: playfair } = loadPlayfair();
const { fontFamily: caveat } = loadCaveat();

export const LogoMark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180 },
  });
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: "80px 72px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          opacity,
          transform: `scale(${scale})`,
          transformOrigin: "left center",
        }}
      >
        {/* SVG avião da marca */}
        <svg width="48" height="48" viewBox="0 0 72 72" fill="none">
          <path d="M8 38 L56 20 L48 52 L36 42 Z" fill="white" />
          <path d="M28 44 L20 58 L36 42 Z" fill={BRAND.turquesa} />
          <path
            d="M48 52 L54 62 L44 56 Z"
            fill="rgba(255,255,255,0.5)"
          />
          <circle cx="34" cy="34" r="2.5" fill={BRAND.areia} />
        </svg>

        <div>
          <div
            style={{
              fontFamily: playfair,
              fontSize: 32,
              color: "white",
              lineHeight: 1.1,
              fontWeight: 700,
            }}
          >
            Visto com{" "}
            <span style={{ color: BRAND.turquesa, fontStyle: "italic" }}>
              Lê
            </span>
          </div>
          <div
            style={{
              fontFamily: caveat,
              fontSize: 16,
              color: `${BRAND.turquesa}CC`,
              marginTop: 2,
            }}
          >
            vistocomle.com.br
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
