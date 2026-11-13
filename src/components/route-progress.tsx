"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export function RouteProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPath = useRef(pathname);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (pathname !== prevPath.current) {
      setVisible(true);
      setProgress(70);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setVisible(false);
          setProgress(0);
        }, 200);
      }, 150);
      prevPath.current = pathname;
    }
  }, [pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-0.5 pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms" }}
    >
      <div
        className="h-full bg-brand-600"
        style={{
          width: `${progress}%`,
          transition: progress > 0 ? "width 300ms ease" : "none",
        }}
      />
    </div>
  );
}
