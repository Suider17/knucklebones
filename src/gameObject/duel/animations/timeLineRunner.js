import { TIMELINE_CONTROLTYPE, TIMELINE_NODETYPE } from "../duel.definition";

export async function runTimeline(scene, timeline, ctx = {}) {
  for (const node of timeline) {
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
  switch (node.action) {
    case TIMELINE_CONTROLTYPE.PAUSE: {
      // Creamos un "token" de pausa
      if (!ctx.pauseToken) {
        ctx.pauseToken = {};
      }

      // Si ya hay una pausa activa, ignoramos
      if (!ctx.pauseToken.promise) {
        ctx.pauseToken.promise = new Promise((resolve) => {
          ctx.pauseToken.resolve = resolve;
        });
      }

      // Espera hasta que alguien haga RESUME
      await ctx.pauseToken.promise;
      return;
    }

    case TIMELINE_CONTROLTYPE.RESUME: {
      if (ctx.pauseToken && ctx.pauseToken.resolve) {
        ctx.pauseToken.resolve(); // liberamos la pausa
        ctx.pauseToken = null; // limpiamos el token
      }
      return;
    }

    case TIMELINE_CONTROLTYPE.LOGIC: {
      if (typeof node.fn === "function") {
        // si devuelve promesa, esperamos; si no, solo ejecuta
        await node.fn(ctx);
      } else {
        console.warn("funcion de hook no pudo ejecutarse", node.fn);
      }
      return;
    }

    default:
      console.warn("runControlStep: acción desconocida", node.action);
      return;
  }
}
