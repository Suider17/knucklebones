//====================
// PLAYER DICE EVENTS
//====================

// Estado general
export const PDICE_ENABLED = "playerDice:enabled";
export const PDICE_DISABLED = "playerDice:disabled";
export const PDICE_LOCKED = "playerDice:locked";
export const PDICE_UNLOCKED = "playerDice:unlocked";
export const PDICE_RESET = "playerDice:reset";

// Interacciones (hover, click, etc.)
export const PDICE_HOVER_IN = "playerDice:hover:in";
export const PDICE_HOVER_OUT = "playerDice:hover:out";

// Rodado de dado
export const PDICE_ROLL_START = "playerDice:roll:start";
export const PDICE_ROLLING = "playerDice:rolling";
export const PDICE_ROLL_FINISH = "playerDice:roll:finish";

// Clasificación por bucket
export const PDICE_NORMAL_BUCKET = "playerDice:bucket:normal";
export const PDICE_SPECIAL_BUCKET = "playerDice:bucket:special";
export const PDICE_MOD_BUCKET = "playerDice:bucket:mod";

// Posición / área
export const PDICE_OVER_BOARD = "playerDice:overBoard";
export const PDICE_OUT_BOARD = "playerDice:outBoard";

// Asignación de valor
export const PDICE_VALUE_ASSIGNED = "playerDice:value:assigned";

//----ANIMS----
// Animaciones generales
export const PDICE_ANIM_SHAKE = "playerDice:anim:shake"; // vibrar / agitar
export const PDICE_ANIM_DESTROY = "playerDice:anim:destroy"; // desaparecer con tween
export const PDICE_ANIM_SPAWN = "playerDice:anim:spawn"; // aparecer en escena

// Animaciones de resaltado y estados
export const PDICE_ANIM_HIGHLIGHT = "playerDice:anim:highlight"; // resaltar (hover)
export const PDICE_ANIM_UNHIGHLIGHT = "playerDice:anim:unHighlight"; // quitar resaltado
export const PDICE_ANIM_GLOW = "playerDice:anim:glow"; // resplandor especial

// Animaciones de dados
export const PDICE_ANIM_ROLL_START = "playerDice:anim:rollStart"; // iniciar rodado
export const PDICE_ANIM_ROLLING = "playerDice:anim:rolling"; // rodando
export const PDICE_ANIM_ROLL_FINISH = "playerDice:anim:rollFinish"; // rodado finalizado
export const PDICE_ANIM_VALUE_CHANGE = "playerDice:anim:valueChange"; // cambio de valor en cara
export const PDICE_ANIM_BUCKET_SWAP = "playerDice:anim:bucketSwap"; // cambio de bucket (normal, mod, especial)

// Animaciones de efectos especiales
export const PDICE_ANIM_IMPACT = "playerDice:anim:impact"; // impacto fuerte
export const PDICE_ANIM_PULSE = "playerDice:anim:pulse"; // pulso rítmico
export const PDICE_ANIM_WOBBLE = "playerDice:anim:wobble"; // bamboleo
export const PDICE_ANIM_FLASH = "playerDice:anim:flash"; // destello
