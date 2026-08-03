import type { AnimationMode } from "./types";
import {
  antigravityRingsEngine,
  antigravityWeightlessEngine,
  auroraPrimeEngine,
  auroraZenithEngine,
  blueFieldEngine,
  cosmicStarfieldEngine,
  eliteCyberEngine,
  pantoneDriftEngine,
  protocolNetworkEngine,
  staticEngine,
} from "./engines";

/**
 * Background animation lineage of https://github.com/000/000.github.io
 * (index.html across commit history), ordered chronologically.
 */
export const ANIMATION_MODES: AnimationMode[] = [
  {
    id: "static",
    name: "Static Canvas",
    shortName: "Static",
    era: "2018 – early 2025",
    date: "2018-02 → 2025-02",
    commit: "5f72ec6 … 97e0c98",
    versionLabel: "Pre-motion",
    description:
      "The earliest GitHub Pages eras: plain surface, no particle system. A calm baseline before motion entered the profile.",
    surface: "light",
    engine: staticEngine,
  },
  {
    id: "blue-field",
    name: "Interactive Blue Field",
    shortName: "Blue Field",
    era: "Aug 2025",
    date: "2025-08-14",
    commit: "503c86e",
    versionLabel: "v1 Particles",
    description:
      "First canvas particle system with mouse repulsion and a slow-rotating gradient mesh — the birth of the animated background.",
    surface: "light",
    engine: blueFieldEngine,
  },
  {
    id: "elite-cyber",
    name: "Elite Cyber Particles",
    shortName: "Elite Cyber",
    era: "Nov 2025",
    date: "2025-11-05",
    commit: "9f728eb",
    versionLabel: "Elite",
    description:
      "Denser multi-hue cyber palette (cyan / violet / pink), subtle drift, and a faint grid haze over the field.",
    surface: "cyber",
    engine: eliteCyberEngine,
  },
  {
    id: "protocol-network",
    name: "Protocol Link Network",
    shortName: "Link Network",
    era: "Nov 2025",
    date: "2025-11-26",
    commit: "923c3f6",
    versionLabel: "Protocol",
    description:
      "Configurable particle count with proximity edge-links — the network-graph look that carried into the cosmic era.",
    surface: "cyber",
    engine: protocolNetworkEngine,
  },
  {
    id: "cosmic-starfield",
    name: "Cosmic Starfield",
    shortName: "Starfield",
    era: "Jan 2026",
    date: "2026-01-04",
    commit: "87da4b5",
    versionLabel: "Cosmic Dual",
    description:
      "Dual-layer system: twinkling starfield canvas plus interactive networked particles on a deep void.",
    surface: "void",
    engine: cosmicStarfieldEngine,
  },
  {
    id: "pantone-drift",
    name: "Pantone 3D Drift",
    shortName: "Pantone 3D",
    era: "Jan 2026",
    date: "2026-01-16",
    commit: "3f10111",
    versionLabel: "Three.js",
    description:
      "Three.js antigravity particle cloud using Pantone Colors of the Year (Mocha Mousse, Peach Fuzz, Viva Magenta, Very Peri).",
    surface: "dark",
    engine: pantoneDriftEngine,
  },
  {
    id: "antigravity-rings",
    name: "Antigravity Rings",
    shortName: "AG Rings",
    era: "Jan 2026",
    date: "2026-01-16",
    commit: "3eb6cdd",
    versionLabel: "Houdini Motion",
    description:
      "CSS Houdini @property particle rings with breathing radius — the first Antigravity Motion System layer.",
    surface: "void",
    engine: antigravityRingsEngine,
  },
  {
    id: "antigravity-weightless",
    name: "Agentic Weightlessness",
    shortName: "Weightless",
    era: "Jan 2026",
    date: "2026-01-23",
    commit: "295d930 / d661a03",
    versionLabel: "Antigravity+",
    description:
      "Dual-layer floating rings plus interactive gather particles — inspired by antigravity.google, light/dark aware.",
    surface: "void",
    engine: antigravityWeightlessEngine,
  },
  {
    id: "aurora-prime",
    name: "Aurora-Prime Halo",
    shortName: "Aurora-Prime",
    era: "Jul 2026",
    date: "2026-07-08",
    commit: "431b741",
    versionLabel: "Profile v2 · Protocol v19",
    description:
      "Dual-tier Antigravity Halo (dense Canvas 2D tier): spectrum grain ring, pointer gather, click shockwave. Porcelain glass era.",
    surface: "light",
    engine: auroraPrimeEngine,
  },
  {
    id: "aurora-zenith",
    name: "Aurora-Zenith Halo",
    shortName: "Aurora-Zenith",
    era: "Jul 2026 · current",
    date: "2026-07-08",
    commit: "b855740",
    versionLabel: "Profile v3 · Protocol v18",
    description:
      "Current defense.engineer / 000.github.io engine: lighter Canvas 2D Halo (N clamp 2200–6000), dependency-free, attempt-capped seed.",
    surface: "light",
    engine: auroraZenithEngine,
  },
];

export function modeIndex(id: string) {
  const i = ANIMATION_MODES.findIndex((m) => m.id === id);
  return i < 0 ? 0 : i;
}

export function nextModeId(id: string) {
  const i = modeIndex(id);
  return ANIMATION_MODES[(i + 1) % ANIMATION_MODES.length]!.id;
}

export function prevModeId(id: string) {
  const i = modeIndex(id);
  return ANIMATION_MODES[(i - 1 + ANIMATION_MODES.length) % ANIMATION_MODES.length]!.id;
}
