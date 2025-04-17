//================
//DICE DEFINITIONS
//================

//DICE STYLES
export const D6 = "d_6";
export const D11 = "d_11";

//NORMAL VALUE FACE
//frame position in spritesheet
export const DICE_EMPTY = 0; //dado de valor 0
export const DICE_1 = 1; //dado de valor 1
export const DICE_2 = 2; //dado de valor 2
export const DICE_3 = 3; //dado de valor 3
export const DICE_4 = 4; //dado de valor 4
export const DICE_5 = 5; //dado de valor 5
export const DICE_6 = 6; //dado de valor 6
export const DICE_SHIELD = 7; // valor del dado para un modificardor de defensa
export const DICE_SWORD = 8; // valor del dado para un modificardor de ataque
export const DICE_SKULL = 9; // valor del dado kamikaze
export const DICE_REROLL = 10; // valor del dado que hace un reroll antes de colocarse

//DOUBLE VALUE FACE
export const DICE_DOUBLE_1 = 11;
export const DICE_DOUBLE_2 = 12;
export const DICE_DOUBLE_3 = 13;
export const DICE_DOUBLE_4 = 14;
export const DICE_DOUBLE_5 = 15;
export const DICE_DOUBLE_6 = 16;

//TRIPLE VALUE FACE
export const DICE_TRIPLE_1 = 17;
export const DICE_TRIPLE_2 = 18;
export const DICE_TRIPLE_3 = 19;
export const DICE_TRIPLE_4 = 20;
export const DICE_TRIPLE_5 = 21;
export const DICE_TRIPLE_6 = 22;
//================

//DICE BUCKETS
export const SPECIAL_DICE_BUCKET = 1;
export const HERO_DICE_BUCKET = 2;
export const NORMAL_DICE_BUCKET = 3;
export const EMPTY_DICE_BUCKET = 4;
export const MOD_DICE_BUCKET = 5;
//BUCKET ARRAYS
export const NORMAL_BUCKET_ARRAY = [
  DICE_1,
  DICE_2,
  DICE_3,
  DICE_4,
  DICE_5,
  DICE_6,
];
export const MOD_BUCKET_ARRAY = [DICE_SHIELD, DICE_SWORD];
export const SPECIAL_BUCKET_ARRAY = [DICE_SKULL];
export const EMPTY_BUCKET_ARRAY = [DICE_EMPTY];
export const REROLL_BUCKET_ARAY = [DICE_REROLL];

//BUCKET HIERARCHY
export const BUCKET_HIERARCHY = {
  [SPECIAL_DICE_BUCKET]: 1,
  [HERO_DICE_BUCKET]: 2,
  [NORMAL_DICE_BUCKET]: 3,
  [EMPTY_DICE_BUCKET]: 4,
};
/**
 * Devuele el valor INT del bucket
 * al que pertenece el valor de dado ingresado
 * @param {number} dice - el dado del que se extrae el valor a clasificar
 * @returns {number} el valor del bucket al que pertenece este dado
 */
export function DICE_BUCKET(value) {
  if (NORMAL_BUCKET_ARRAY.includes(value)) {
    return NORMAL_DICE_BUCKET;
  } else if (SPECIAL_BUCKET_ARRAY.includes(value)) {
    return SPECIAL_DICE_BUCKET;
  } else if (EMPTY_BUCKET_ARRAY.includes(value)) {
    return EMPTY_DICE_BUCKET;
  } else if (MOD_BUCKET_ARRAY.includes(value)) {
    return MOD_DICE_BUCKET;
  } else {
    throw new ReferenceError("Estas mandando un valor que no tiene Bucket");
  }
}
