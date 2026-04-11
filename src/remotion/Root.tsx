import React from "react";
import { Composition } from "remotion";
import { AprovacaoStory, defaultProps, type AprovacaoStoryProps } from "./AprovacaoStory";
import { TIMING } from "./config";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AprovacaoStory"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component={AprovacaoStory as React.ComponentType<any>}
      durationInFrames={TIMING.duration}
      fps={TIMING.fps}
      width={1080}
      height={1920}
      defaultProps={defaultProps}
    />
  );
};
