import React from "react";
import { Composition } from "remotion";
import { AprovacaoStory, defaultProps } from "./AprovacaoStory";
import { TIMING } from "./config";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AprovacaoStory"
      component={AprovacaoStory}
      durationInFrames={TIMING.duration}
      fps={TIMING.fps}
      width={1080}
      height={1920}
      defaultProps={defaultProps}
    />
  );
};
