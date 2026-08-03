export type AnimationHandle = {
  destroy: () => void;
};

export type AnimationMountContext = {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  reducedMotion: boolean;
};

export type AnimationEngine = {
  mount: (ctx: AnimationMountContext) => AnimationHandle;
};

export type AnimationMode = {
  id: string;
  name: string;
  shortName: string;
  era: string;
  date: string;
  commit: string;
  versionLabel: string;
  description: string;
  /** Stage surface class: light porcelain or dark void */
  surface: "light" | "dark" | "void" | "cyber";
  engine: AnimationEngine;
};
