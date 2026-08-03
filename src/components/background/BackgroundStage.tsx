import { useEffect, useRef } from "react";
import type { AnimationMode } from "@/lib/animations/types";

type Props = {
  mode: AnimationMode;
};

export function BackgroundStage({ mode }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const handle = mode.engine.mount({ container, canvas, reducedMotion });

    return () => {
      handle.destroy();
      // clear any leftover overlay nodes engines may have appended
      for (const child of Array.from(container.children)) {
        if (child !== canvas) child.remove();
      }
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [mode]);

  return (
    <div
      ref={containerRef}
      className={`bg-stage bg-stage--${mode.surface}`}
      data-mode={mode.id}
      aria-hidden="true"
    >
      <div className="bg-stage__bloom" />
      <canvas ref={canvasRef} className="bg-stage__canvas" />
    </div>
  );
}
