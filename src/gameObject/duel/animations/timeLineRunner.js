import { TIMELINE_CONTROLTYPE, TIMELINE_NODETYPE } from "../duel.definition";

export async function runTimeline(scene, timeline, ctx = {}) {
  for (const node of timeline) {
    console.log(node.label);
    await runNode(scene, node, ctx);
  }
}

async function runNode(scene, node, ctx) {
  switch (node.type) {
    case TIMELINE_NODETYPE.SEQUENCE:
      for (const _s of node.steps) await runNode(scene, _s, ctx);
      break;

    case TIMELINE_NODETYPE.PARALLEL:
      await Promise.all(node.steps.map((_s) => runNode(scene, _s, ctx)));
      break;

    case TIMELINE_NODETYPE.TWEEN:
      await runTween(scene, node, ctx);
      break;

    case TIMELINE_NODETYPE.CONTROL:
      await runControlNode(scene, node, ctx); // usado solo dentro de hooks
      break;
  }
}

async function runTween(scene, node, ctx) {
  const actor = node.actor;
  // Ejecuta tu animación propia. Importante: devuelve Promise que resuelva en onComplete
  // Además, engancha hooks:
  const tweenPromise = actor[node.animation]({
    ...(node.params || {}),
    onStart: async () => {
      if (node.onStart)
        await runHook(scene, node.onStart, {
          ...ctx,
          currentTweenOwner: actor,
        });
    },
    onYoyo: async () => {
      if (node.onYoyo)
        await runHook(scene, node.onYoyo, { ...ctx, currentTweenOwner: actor });
    },
    onComplete: async () => {
      if (node.onComplete)
        await runHook(scene, node.onComplete, {
          ...ctx,
          currentTweenOwner: actor,
        });
    },
  });

  await tweenPromise; // tu método debe retornar una promesa
}

async function runHook(scene, hookSteps, ctx) {
  for (const sub of hookSteps) {
    await runNode(scene, sub, ctx);
  }
}

async function runControlNode(scene, node, ctx) {
  // Helper: devuelve la lista de tweens activos del "dueño" actual o de targets explícitos
  const resolveTargets = () => {
    // Permite override explícito: node.targets puede ser 1 objeto o array de objetos/sprites
    if (node.targets) {
      const arr = Array.isArray(node.targets) ? node.targets : [node.targets];
      return arr.flatMap((t) => scene.tweens.getTweensOf(t, true)); // true = onlyActive
    }

    // Si vienes desde un hook de un tween, pasamos currentTweenOwner en ctx
    const owner = ctx?.currentTweenOwner;
    if (owner?.sprite) {
      // caso típico: owner tiene .sprite
      return scene.tweens.getTweensOf(owner.sprite, true);
    }
    if (owner) {
      // si el owner es directamente el target del tween
      return scene.tweens.getTweensOf(owner, true);
    }

    // Fallback duro (no recomendado): TODOS los tweens
    return [];
  };

  switch (node.action) {
    case TIMELINE_CONTROLTYPE.PAUSE: {
      const tweens = resolveTargets();

      // Pausa solo los tweens relevantes; si no hay, puedes decidir pausar todos
      if (tweens.length === 0) {
        // Opcional/fallback:
        // scene.tweens.pauseAll();
        // return;
      } else {
        tweens.forEach((t) => t.pause());
      }

      // IMPORTANTE: NO bloquear aquí. Deja que el hook siga
      // para que pueda correr el mini-SHAKE y luego el RESUME.
      return;
    }

    case TIMELINE_CONTROLTYPE.RESUME: {
      const tweens = resolveTargets();

      if (tweens.length === 0) {
        // Opcional/fallback:
        // scene.tweens.resumeAll();
      } else {
        tweens.forEach((t) => t.resume());
      }
      return;
    }

    case TIMELINE_CONTROLTYPE.LOGIC: {
      if (typeof node.fn === "function") {
        await node.fn(ctx);
      } else {
        console.warn("funcion de hook no pudo ejecutarse", node.fn);
      }
      return;
    }

    default:
      console.warn("runControlNode: acción desconocida", node.action);
      return;
  }
}
