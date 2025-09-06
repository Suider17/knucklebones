import {
  duelKnightVsKnight,
  duelSkullVsSkull,
  duelBerserkerVsBerserker,
} from "./duelStrategies";

export const DUEL_STRATEGY = Object.freeze({
  skull_skull: duelSkullVsSkull,
  knight_knight: duelKnightVsKnight,
  berserker_berserker: duelBerserkerVsBerserker,
});

export const TIMELINE_NODETYPE = Object.freeze({
  PARALLEL: "parallel",
  SEQUENCE: "sequence",
  CONTROL: "control",
  TWEEN: "tween",
});

export const TIMELINE_CONTROLTYPE = Object.freeze({
  PAUSE: "pause",
  RESUME: "resume",
  LOGIC: "logic",
});
