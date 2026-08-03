import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimationPicker } from "@/components/background/AnimationPicker";
import { BackgroundStage } from "@/components/background/BackgroundStage";
import {
  ANIMATION_MODES,
  modeIndex,
  nextModeId,
  prevModeId,
} from "@/lib/animations/catalog";

export const Route = createFileRoute("/")({ component: Home });

const STORAGE_KEY = "bg-sampler-mode";
const AUTO_KEY = "bg-sampler-auto";
const CYCLE_MS = 12_000;

function Home() {
  const [modeId, setModeId] = useState(ANIMATION_MODES[ANIMATION_MODES.length - 1]!.id);
  const [autoCycle, setAutoCycle] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && ANIMATION_MODES.some((m) => m.id === saved)) setModeId(saved);
      const auto = localStorage.getItem(AUTO_KEY);
      if (auto === "1") setAutoCycle(true);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, modeId);
      localStorage.setItem(AUTO_KEY, autoCycle ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [modeId, autoCycle, hydrated]);

  const mode = useMemo(
    () => ANIMATION_MODES.find((m) => m.id === modeId) ?? ANIMATION_MODES[0]!,
    [modeId],
  );
  const index = modeIndex(mode.id);

  const goNext = useCallback(() => setModeId((id) => nextModeId(id)), []);
  const goPrev = useCallback(() => setModeId((id) => prevModeId(id)), []);

  useEffect(() => {
    if (!autoCycle) return;
    const t = window.setInterval(goNext, CYCLE_MS);
    return () => window.clearInterval(t);
  }, [autoCycle, goNext]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement) {
        const tag = e.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target.isContentEditable) {
          return;
        }
      }
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "a" || e.key === "A") {
        setAutoCycle((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  return (
    <>
      <BackgroundStage mode={mode} />
      <div className="app-shell" data-surface={mode.surface}>
        <header className="app-top">
          <div className="brand">
            <p className="brand__eyebrow">000.github.io · sampler</p>
            <h2 className="brand__title">Background Animation Archive</h2>
            <p className="brand__sub">
              Every distinct background from the GitHub Pages index history — toggle, select, or
              auto-cycle through eras.
            </p>
            <p className="brand__hint">Keys: ← → to switch · A to auto-cycle · click halo modes</p>
          </div>
        </header>

        <main className="app-main">
          <AnimationPicker
            mode={mode}
            index={index}
            autoCycle={autoCycle}
            onSelect={setModeId}
            onPrev={goPrev}
            onNext={goNext}
            onToggleAuto={() => setAutoCycle((v) => !v)}
          />
        </main>
      </div>
    </>
  );
}
