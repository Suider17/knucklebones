import { duelKnightVsKnight, duelSkullVsSkull } from "./duelStrategies";

export const DUEL_STRATEGY = Object.freeze({
  skull_skull: duelSkullVsSkull,
  knight_knight: duelKnightVsKnight,
});

export const TIMELINE_STEPTYPE = Object.freeze({
  PARALLEL: "parallel",
  SEQUENCE: "sequence",
  CONTROL: "control",
  TWEEN: "tween",
});

export const TIMELINE_CONTROLTYPE = Object.freeze({
  PAUSE: "pause",
  RESUME: "resume",
});
