"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export const LoadingBar = () => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsLoading(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => setIsLoading(false), 450);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [pathname]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]"
      aria-hidden="true"
    >
      <div
        className={`h-full bg-neutral-100 transition-all duration-500 ease-out ${
          isLoading ? "w-full opacity-100" : "w-0 opacity-0"
        }`}
      />
    </div>
  );
};