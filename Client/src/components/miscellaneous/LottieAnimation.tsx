// components/LottieAnimation.tsx
import React from "react";
import Lottie from "lottie-react";

interface LottieAnimationProps {
  animationData: object;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  height?: number | string;
  width?: number | string;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  loop = true,
  autoplay = true,
  className = "",
  height = "100%",
  width = "100%",
}) => {
  return (
    <div style={{ height, width }} className={className}>
      <Lottie
        style={{ height, width }}
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
      />
    </div>
  );
};

export default LottieAnimation;
