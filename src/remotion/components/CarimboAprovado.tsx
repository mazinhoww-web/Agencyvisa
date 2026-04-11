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

const { fontFamily: playfair } = loadPlayfair();

interface Props {
  tipoVisto: string;
}

export const CarimboAprovado: React.FC<Props> = ({ tipoVisto }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring "bate na tela" — stiffness alto simula impacto de carimbo
  const scale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 300, mass: 0.8 },
    from: 2,
    to: 1,
  });

  const rotate = interpolate(frame, [0, 8], [-15, -8], {
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(frame, [0, 4], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginTop: 200,
      }}
    >
      <div
        style={{
          transform: `scale(${scale}) rotate(${rotate}deg)`,
          opacity,
        }}
      >
        {/* Carimbo retangular estilo consulado */}
        <div
          style={{
            border: `8px solid ${BRAND.turquesa}`,
            borderRadius: 16,
            padding: "24px 56px",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Linha interna decorativa */}
          <div
            style={{
              position: "absolute",
              inset: 4,
              border: `2px solid ${BRAND.turquesa}44`,
              borderRadius: 12,
            }}
          />

          <div
            style={{
              fontFamily: playfair,
              fontSize: 96,
              fontWeight: 900,
              color: BRAND.turquesa,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            APPROVED
          </div>

          <div
            style={{
              fontFamily: playfair,
              fontSize: 22,
              color: `${BRAND.turquesa}AA`,
              letterSpacing: "0.2em",
              marginTop: 8,
              textTransform: "uppercase",
            }}
          >
            Visa {tipoVisto}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
