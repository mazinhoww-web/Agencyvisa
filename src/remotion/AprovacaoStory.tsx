import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, TIMING } from "./config";
import { Background } from "./components/Background";
import { LogoMark } from "./components/LogoMark";
import { CarimboAprovado } from "./components/CarimboAprovado";
import { NomeCliente } from "./components/NomeCliente";
import { Confetti } from "./components/Confetti";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadDMSans } from "@remotion/google-fonts/DMSans";

const { fontFamily: playfair } = loadPlayfair();
const { fontFamily: caveat } = loadCaveat();
const { fontFamily: dmSans } = loadDMSans();

export interface AprovacaoStoryProps {
  nomeCliente: string;    // ex: "Mariana S."
  cidadeCliente: string;  // ex: "São Paulo, SP"
  tipoVisto: string;      // ex: "B1/B2"
  mensagem?: string;      // frase opcional da Lê
}

export const defaultProps: AprovacaoStoryProps = {
  nomeCliente: "Mariana S.",
  cidadeCliente: "São Paulo, SP",
  tipoVisto: "B1/B2",
  mensagem: "Que conquista incrível! 🎉",
};

// ─── Tagline "APROVADA!" ──────────────────────────────────────────────────────
const TaglineAprovada: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 250 } });
  const opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 220,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: caveat,
            fontSize: 48,
            color: BRAND.turquesa,
            letterSpacing: 2,
          }}
        >
          mais uma...
        </div>
        <div
          style={{
            fontFamily: playfair,
            fontSize: 112,
            fontWeight: 900,
            color: "white",
            lineHeight: 0.9,
            fontStyle: "italic",
          }}
        >
          APROVADA!
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── CTA Final ───────────────────────────────────────────────────────────────
const CtaFinal: React.FC<{ mensagem?: string }> = ({ mensagem }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideUp = spring({ frame, fps, config: { damping: 20, stiffness: 200 } });
  const translateY = interpolate(slideUp, [0, 1], [30, 0]);
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 120,
      }}
    >
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          opacity,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        {mensagem && (
          <div
            style={{
              fontFamily: caveat,
              fontSize: 36,
              color: BRAND.coral,
            }}
          >
            {mensagem}
          </div>
        )}

        {/* Pill CTA */}
        <div
          style={{
            background: BRAND.turquesa,
            borderRadius: 100,
            padding: "16px 48px",
            fontFamily: dmSans,
            fontSize: 28,
            fontWeight: 700,
            color: "white",
          }}
        >
          @vistocomle
        </div>

        <div
          style={{
            fontFamily: dmSans,
            fontSize: 22,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          Quer ser o próximo? ✈
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Composição Principal ─────────────────────────────────────────────────────
export const AprovacaoStory: React.FC<AprovacaoStoryProps> = ({
  nomeCliente,
  cidadeCliente,
  tipoVisto,
  mensagem,
}) => {
  const frame = useCurrentFrame();

  // Fade geral de saída nos últimos 15 frames
  const globalOpacity = interpolate(
    frame,
    [TIMING.duration - 20, TIMING.duration - 5],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: globalOpacity }}>

      {/* FUNDO ANIMADO */}
      <Background />

      {/* LOGO — entra com spring no frame 8 */}
      <Sequence from={TIMING.logoIn}>
        <LogoMark />
      </Sequence>

      {/* TAGLINE "APROVADA!" — entra no frame 20 */}
      <Sequence from={TIMING.taglineIn}>
        <TaglineAprovada />
      </Sequence>

      {/* NOME DO CLIENTE — entra no frame 40 */}
      <Sequence from={TIMING.nomeIn}>
        <NomeCliente
          nome={nomeCliente}
          cidade={cidadeCliente}
          tipoVisto={tipoVisto}
        />
      </Sequence>

      {/* CARIMBO APPROVED — entra no frame 65 */}
      <Sequence from={TIMING.carimboIn}>
        <CarimboAprovado tipoVisto={tipoVisto} />
      </Sequence>

      {/* CONFETTI — estoura junto com o carimbo */}
      <Sequence from={TIMING.confettiStart} durationInFrames={60}>
        <Confetti />
      </Sequence>

      {/* CTA FINAL — frame 100 */}
      <Sequence from={TIMING.ctaIn}>
        <CtaFinal mensagem={mensagem} />
      </Sequence>

    </AbsoluteFill>
  );
};
