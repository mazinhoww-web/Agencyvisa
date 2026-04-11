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
import { loadFont as loadDMSans } from "@remotion/google-fonts/DMSans";

const { fontFamily: playfair } = loadPlayfair();
const { fontFamily: dmSans } = loadDMSans();

interface Props {
  nome: string;
  cidade: string;
  tipoVisto: string;
}

export const NomeCliente: React.FC<Props> = ({ nome, cidade }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideY = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 200 },
  });
  const translateY = interpolate(slideY, [0, 1], [40, 0]);
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "flex-start",
        padding: "0 72px 420px",
      }}
    >
      <div style={{ transform: `translateY(${translateY}px)`, opacity }}>
        <div
          style={{
            fontFamily: playfair,
            fontSize: 52,
            color: "white",
            fontWeight: 700,
            fontStyle: "italic",
            lineHeight: 1.1,
          }}
        >
          {nome}
        </div>
        <div
          style={{
            fontFamily: dmSans,
            fontSize: 24,
            color: `${BRAND.turquesa}CC`,
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {/* Ícone MapPin inline SVG */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={BRAND.turquesa}
            strokeWidth="2.5"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {cidade}
        </div>
      </div>
    </AbsoluteFill>
  );
};
