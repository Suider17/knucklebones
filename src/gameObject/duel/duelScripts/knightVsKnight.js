import { DICE_ANIMATIONS, DICE_SWORD } from "../../dice/dice.definition";
import { TIMELINE_CONTROLTYPE, TIMELINE_NODETYPE } from "../duel.definition";

export function knightVsKnightHighlight(animP1, animP2, ctx, delay = 0) {
  return [
    { at: delay, tween: animP1.highlightConfig() },
    { from: 0, tween: animP2.highlightConfig() },
    {
      from: 500,
      run: () => {
        const modSword = ctx.store.atackerSwordMod;
        modSword.updateSprite(modSword.value);
        console.log("ataca: " + modSword.value);
      },
    },
  ];
}

export function knightVsKnightFirstAtack(
  atacker,
  defender,
  modDuel,
  ctx,
  delay = 900
) {
  return [
    { at: delay, tween: atacker.animator.chargeInConfig({ delta: 120 }) },
    {
      from: 0,
      run: () => {
        const modShield = ctx.store.defenderShieldMod;
        modShield.updateSprite(modShield.value);
        console.log("defiende: " + modShield.value);
      },
    },
    { from: 160, tween: defender.animator.pulseInConfig() },
    { from: 80, tween: defender.animator.pulseOutConfig() },

    {
      from: 300,
      run: () => {
        const st = ctx.store;
        modDuel(
          st.atackerSwordMod,
          st.defenderShieldMod,
          atacker,
          defender,
          st.atackerWins
        );
      },
    },
    { from: 100, tween: atacker.animator.chargeOutConfig({ delta: 120 }) },
  ];
}

//========== PHASE B

export function knightVsKnightSecondAtack(
  atacker,
  defender,
  substract,
  ctx,
  delay = 2000
) {
  return [
    { at: delay, tween: atacker.animator.chargeInConfig({ delta: 120 }) },
    { from: 160, tween: defender.animator.pulseInConfig() },
    {
      from: 0,
      run: () => {
        defender.value = substract(
          ctx.store.atackerSwordMod.value,
          defender.value
        );
        defender.sprite.setFrame(defender.value);
      },
    },
    { from: 160, tween: defender.animator.pulseOutConfig() },
    { from: 100, tween: atacker.animator.chargeOutConfig({ delta: 120 }) },
    {
      from: 0,
      run: () => {
        atacker.disposeMod(false, ctx.store.atackerSwordMod);
      },
    },
  ];
}

export function knightVsKnightDefenderAtacks(
  atacker,
  defender,
  modDuel,
  ctx,
  delay = 3000
) {
  return [
    {
      at: delay,
      run: () => {
        console.log("caca");
        const modSword = ctx.store.defenderSwordMod;
        modSword.updateSprite(modSword.value);
        console.log("ataca: " + modSword.value);
      },
    },
    { from: 300, tween: defender.animator.chargeInConfig({ delta: 120 }) },
    {
      from: 0,
      run: () => {
        const modShield = ctx.store.atackerShieldMod;
        modShield.updateSprite(modShield.value);
        console.log("defiende: " + modShield.value);
      },
    },
    { from: 160, tween: atacker.animator.pulseInConfig() },
    { from: 80, tween: atacker.animator.pulseOutConfig() },

    {
      from: 300,
      run: () => {
        const st = ctx.store;
        modDuel(
          st.defenderSwordMod,
          st.atackerShieldMod,
          defender,
          atacker,
          st.defenderWins
        );
      },
    },
    { from: 100, tween: defender.animator.chargeOutConfig({ delta: 120 }) },
  ];
}

export function knightVsKnightDefenderSecondAtack(
  atacker,
  defender,
  substract,
  ctx,
  delay = 4500
) {
  return [
    { at: delay, tween: defender.animator.chargeInConfig({ delta: 120 }) },
    { from: 160, tween: atacker.animator.pulseInConfig() },
    {
      from: 0,
      run: () => {
        atacker.value = substract(
          ctx.store.atackerSwordMod.value,
          atacker.value
        );
        atacker.sprite.setFrame(atacker.value);
      },
    },
    { from: 160, tween: atacker.animator.pulseOutConfig() },
    { from: 100, tween: defender.animator.chargeOutConfig({ delta: 120 }) },
    {
      from: 0,
      run: () => {
        defender.disposeMod(false, ctx.store.defenderSwordMod);
      },
    },
  ];
}

export function knightVsKnightDefenderCounter(
  atacker,
  defender,
  ctx,
  substract,
  delay = 300
) {
  return [
    {
      at: delay,
      run: () => {
        ctx.store.defenderAtackMod.roll();
      },
    },
    { from: 400, tween: defender.animator.chargeInConfig({ delta: 120 }) },
    { from: 160, tween: atacker.animator.pulseInConfig() },
    {
      from: 0,
      run: () => {
        ctx.store.atackerDefendMod.roll();
      },
    },
    {
      from: 0,
      run: () => {
        ctx.store.atackerDefendMod.roll();
      },
    },
    {
      from: 200,
      run: () => {
        const defenderMod = ctx.store.atackerDefendMod;

        ctx.store.defenderAtackMod.value = substract(
          defenderMod.value,
          ctx.store.defenderAtackMod.value
        );
        ctx.store.defenderAtackMod.value = 0;
        if (ctx.store.defenderAtackMod.value === 0) {
          ctx.store.firstAtacker.disposeMod(false, defenderMod);
          ctx.store.firstDefender.disposeMod(false, ctx.store.defenderAtackMod);
        } else {
          ctx.store.defenderAtackMod.setFrame(ctx.store.defenderAtackMod.value);
          ctx.store.firstAtacker.disposeMod(false, defenderMod);
        }
      },
    },
    { from: 160, tween: atacker.animator.pulseOutConfig() },
    { from: 200, tween: defender.animator.chargeOutConfig({ delta: 120 }) },
    { from: 400, tween: defender.animator.chargeInConfig({ delta: 120 }) },
    { from: 160, tween: atacker.animator.pulseInConfig() },
    {
      from: 0,
      run: () => {
        atacker.value = substract(
          ctx.store.defenderAtackMod.value,
          atacker.value
        );

        atacker.sprite.setFrame(atacker.value);
      },
    },
    { from: 160, tween: atacker.animator.pulseOutConfig() },
    { from: 200, tween: defender.animator.chargeOutConfig({ delta: 120 }) },
    {
      from: 0,
      run: () => {
        ctx.store.firstDefender.disposeMod(false, ctx.store.defenderAtackMod);
      },
    },
  ];
}
// export function knightVsKnightFirstDefend(defender) {
//   return {
//     type: TIMELINE_NODETYPE.TWEEN,
//     label: "knight_kinight_first_defend",
//     actor: defender,
//     animation: DICE_ANIMATIONS.SHAKE,
//   };
// }

export function knightVsKnightUnhighlight(animP1, animP2, ctx, delay = 0) {
  return [
    { at: delay, tween: animP1.unhighlightConfig() },
    { from: 0, tween: animP2.unhighlightConfig() },
  ];
}
