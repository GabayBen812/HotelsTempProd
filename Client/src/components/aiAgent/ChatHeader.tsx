import Lottie from "lottie-react";
import { Maximize2, Minimize2, X } from "lucide-react";
import assistantAnimation from "@/assets/animations/Animation - 1746366123961.json";

interface Props {
  isFullScreen: boolean;
  setIsFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}
export const ChatHeader = ({
  isFullScreen,
  setIsFullScreen,
  onClose,
}: Props) => (
  <div className="flex items-center justify-between p-4 border-b bg-muted relative shadow-sm">
    <div className="flex flex-col items-center mx-auto text-center pointer-events-none select-none gap-2">
      <div className="w-[40px] h-[40px] mb-1 overflow-hidden rounded-full">
        <Lottie
          animationData={assistantAnimation}
          loop
          autoplay
          style={{ width: 60, height: 60 }}
        />
      </div>
      <span className="font-semibold text-sm">
        לומינה – העוזרת שלך לניהול חכם
      </span>
    </div>
    <div className="absolute right-4 top-4 flex gap-2 z-10">
      <button onClick={() => setIsFullScreen((prev) => !prev)}>
        {isFullScreen ? (
          <Minimize2 className="w-4 h-4" />
        ) : (
          <Maximize2 className="w-4 h-4" />
        )}
      </button>
      <button onClick={onClose}>
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);
