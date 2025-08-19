import { TIMELINE_STEPTYPE } from "../duel.definition";

export async function runTimeline(scene, timeline) {
  for (const step of timeline) {
    await runStep(scene, step);
  }
}

async function runStep(scene, step) {
  switch (step.type) {
    case TIMELINE_STEPTYPE.SEQUENCE:
      for (const s of step.steps) await runStep(scene, s);
      break;

    case TIMELINE_STEPTYPE.PARALLEL:
      await Promise.all(step.steps.map((s) => runStep(scene, s)));
      break;

    case TIMELINE_STEPTYPE.TWEEN:
      await runTweenStep(scene, step);
      break;

    case TIMELINE_STEPTYPE.CONTROL:
      await runControlStep(scene, step); // usado solo dentro de hooks
      break;
  }
}

async function runTweenStep(scene, step) {
  const actor = step.actor;
  // Ejecuta tu animación propia. Importante: devuelve Promise que resuelva en onComplete
  // Además, engancha hooks:
  const tweenPromise = actor[step.animation]({
    ...(step.params || {}),
    onStart: async () => {
      if (step.onStart)
        await runHook(scene, step.onStart, {
          ...ctx,
          currentTweenOwner: actor,
        });
    },
    onYoyo: async () => {
      if (step.onYoyo)
        await runHook(scene, step.onYoyo, { ...ctx, currentTweenOwner: actor });
    },
    onComplete: async () => {
      if (step.onComplete)
        await runHook(scene, step.onComplete, {
          ...ctx,
          currentTweenOwner: actor,
        });
    },
  });

  await tweenPromise; // tu método debe retornar una promesa
}

async function runHook(scene, hookSteps) {
  for (const sub of hookSteps) {
    await runStep(scene, sub, ctx);
  }
}
