import { useCallback } from "react";
import confetti from "canvas-confetti";

const useConfetti = (state: unknown) => {
  const bang = useCallback(() => {
    const c = confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      zIndex: 9999,
    });
    if (c) {
      void c.finally(() => {
        confetti.reset();
      });
    }
  }, [state]);
  return { bang };
};
export default useConfetti;
