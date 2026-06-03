/**
 * Atma Vedika — Motion Tokens
 *
 * Toda animação deve usar estes tokens.
 * Spring physics > duration timing pra sensação orgânica.
 */

/** Durações em ms. Cosmic = transições teatrais. */
export const duration = {
  instant: 150,
  quick: 250,
  base: 400,
  smooth: 600,
  deep: 800,
  cinematic: 1200,
  cosmic: 2000,
  eternal: 3500,
} as const;

/** Spring configs (use com withSpring do Reanimated). */
export const spring = {
  /** Entrada suave e contemplativa de telas. */
  breath: { mass: 1, damping: 20, stiffness: 55 },
  /** Padrão sagrado — overshoot sutil, sensação flutuante. */
  sacred: { mass: 1, damping: 18, stiffness: 95 },
  /** Cards entrando — rápido mas com cauda suave. */
  snap: { mass: 1, damping: 24, stiffness: 180 },
  /** Bounce explícito (feedback de toque). */
  bounce: { mass: 1, damping: 11, stiffness: 170 },
  /** Lentíssimo, contemplativo (glows pulsantes). */
  meditation: { mass: 2.2, damping: 32, stiffness: 22 },
  /** Floating — para sheets e modais. Cinematográfico. */
  floating: { mass: 1.1, damping: 19, stiffness: 110 },
} as const;

/** Easings cubic-bezier (use com withTiming). */
export const easing = {
  /** Padrão de saída suave. */
  out: [0.16, 1, 0.3, 1] as const,
  /** Entrada acelerada. */
  in: [0.7, 0, 0.84, 0] as const,
  /** Entrada e saída balanceadas. */
  inOut: [0.65, 0, 0.35, 1] as const,
  /** Curva cinematográfica (mais dramática). */
  sacred: [0.83, 0, 0.17, 1] as const,
} as const;

export type DurationToken = keyof typeof duration;
export type SpringToken = keyof typeof spring;
