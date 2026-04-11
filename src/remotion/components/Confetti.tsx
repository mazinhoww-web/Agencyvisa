import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, random } from "remotion";
import { BRAND } from "../config";

const PARTICLE_COUNT = 40;
const COLORS = [BRAND.turquesa, BRAND.coral, BRAND.areia, "white", "#FFD700"];

export const Confetti: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const seed = i * 13.7;
        const x = random(`x-${seed}`) * 1080;
        const startY = -50;
        const endY = random(`y-${seed}`) * 1400 + 400;
        const size = random(`s-${seed}`) * 16 + 8;
        const color = COLORS[Math.floor(random(`c-${seed}`) * COLORS.length)];
        const delay = random(`d-${seed}`) * 20;
        const rotate = interpolate(
          frame,
          [delay, delay + 60],
          [0, 360 * (random(`r-${seed}`) > 0.5 ? 1 : -1)],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );
        const progress = interpolate(frame, [delay, delay + 60], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const currentY = interpolate(progress, [0, 1], [startY, endY]);
        const opacity = interpolate(
          frame,
          [delay, delay + 10, delay + 50, delay + 60],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: currentY,
              width: size,
              height: size * 0.4,
              background: color,
              borderRadius: 2,
              opacity,
              transform: `rotate(${rotate}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
