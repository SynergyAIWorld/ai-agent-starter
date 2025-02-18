"use client";

import { useCallback, useEffect, useState } from "react";

const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 640,
  );

  const handleResize = useCallback(() => {
    setIsMobile(typeof window !== "undefined" && window.innerWidth < 640);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);
  return isMobile;
};
export default useIsMobile;
