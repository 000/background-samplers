import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
import { ANIMATION_MODES } from "@/lib/animations/catalog";
import type { AnimationMode } from "@/lib/animations/types";

type Props = {
  mode: AnimationMode;
  index: number;
  autoCycle: boolean;
  onSelect: (id: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleAuto: () => void;
};

export function AnimationPicker({
  mode,
  index,
  autoCycle,
  onSelect,
  onPrev,
  onNext,
  onToggleAuto,
}: Props) {
  const total = ANIMATION_MODES.length;

  return (
    <div className="picker">
      <div className="picker__header">
        <div className="picker__kicker">
          <Sparkles className="size-3.5 opacity-70" strokeWidth={1.75} />
          <span>Background lineage</span>
          <span className="picker__count">
            {index + 1} / {total}
          </span>
        </div>
        <a
          href="https://github.com/000/000.github.io/blob/master/index.html"
          target="_blank"
          rel="noreferrer"
          className="picker__source"
        >
          Source history
          <ExternalLink className="size-3" strokeWidth={1.75} />
        </a>
      </div>

      <div className="picker__title-row">
        <button type="button" className="picker__nav" onClick={onPrev} aria-label="Previous animation">
          <ChevronLeft className="size-5" strokeWidth={1.75} />
        </button>

        <div className="picker__title-block">
          <h1 className="picker__name">{mode.name}</h1>
          <p className="picker__meta">
            <span className="picker__badge">{mode.versionLabel}</span>
            <span className="picker__sep" />
            <span>{mode.era}</span>
          </p>
        </div>

        <button type="button" className="picker__nav" onClick={onNext} aria-label="Next animation">
          <ChevronRight className="size-5" strokeWidth={1.75} />
        </button>
      </div>

      <p className="picker__desc">{mode.description}</p>

      <div className="picker__commit">
        <span className="picker__commit-label">Commit</span>
        <code>{mode.commit}</code>
        <span className="picker__sep" />
        <span>{mode.date}</span>
      </div>

      <div className="picker__dots" role="tablist" aria-label="Select animation">
        {ANIMATION_MODES.map((m, i) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={m.id === mode.id}
            aria-label={m.name}
            title={m.shortName}
            className={`picker__dot ${m.id === mode.id ? "is-active" : ""}`}
            onClick={() => onSelect(m.id)}
          >
            <span className="sr-only">{m.shortName}</span>
            {i + 1}
          </button>
        ))}
      </div>

      <div className="picker__controls">
        <label className="picker__switch">
          <span className="picker__switch-label">Auto-cycle</span>
          <button
            type="button"
            role="switch"
            aria-checked={autoCycle}
            className={`switch ${autoCycle ? "is-on" : ""}`}
            onClick={onToggleAuto}
          >
            <span className="switch__thumb" />
          </button>
        </label>

        <button type="button" className="picker__cycle-btn" onClick={onNext}>
          {autoCycle ? (
            <>
              <Pause className="size-3.5" strokeWidth={1.75} />
              Cycling every 12s
            </>
          ) : (
            <>
              <Play className="size-3.5" strokeWidth={1.75} />
              Next animation
            </>
          )}
        </button>
      </div>

      <div className="picker__list">
        <label className="picker__select-label" htmlFor="anim-select">
          Jump to era
        </label>
        <select
          id="anim-select"
          className="picker__select"
          value={mode.id}
          onChange={(e) => onSelect(e.target.value)}
        >
          {ANIMATION_MODES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.shortName} — {m.versionLabel}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
