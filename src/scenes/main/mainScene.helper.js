import { D6, DICE_SKULL } from "../../definitions/diceDefinitions";
import Dice from "../../gameObject/dice/Dice";

export function setRoundText(scene) {
  scene.text.roundCounter.setText(scene.round);
}
export function setUntilDuelText(scene) {
  scene.text.untilDuelCounter.setText(scene.untilDuelCounter);
}
export function setPlayersLifeText(scene) {
  scene.text.P1LifeText.setText(scene.P1.life);
  scene.text.P2LifeText.setText(scene.P2.life);
}

export async function tossCoinForTurn(scene) {
  const playerTurn = Math.floor(Math.random() * 2);

  // 1. Fondo oscuro con efecto de aparición


  // // 2. Moneda con animación de aparición


  // // Animación de entrada dramática

  // await scene.sprite.tossCoin.play("tossCoin");
}

export function createInfoTextPanel(scene) {
  //textos de informacion en pantalla
  const infoContainer = scene.add.container(30, 30);
  //=========
  //Ronda actual

  const rounCountTitle = scene.add.text(30, 0, "Ronda actual", {
    fontSize: "24px",
    color: "#ffffff",
  });
  infoContainer.add(rounCountTitle);
  scene.text.roundCounter = scene.add.text(100, 30, scene.round, {
    fontSize: "40px",
    fontFamily: "Roboto",
    color: "#ffffff",
    fontStyle: "bold",
  });
  infoContainer.add(scene.text.roundCounter);
  //==========

  //======
  //rondas hasta duelo
  const untilDuelTitle = scene.add.text(30, 100, "Rondas hasta duelo", {
    fontSize: "24px",
    color: "#ffffff",
  });
  infoContainer.add(untilDuelTitle);
  scene.text.untilDuelCounter = scene.add.text(
    140,
    130,
    scene.untilDuelCounter,
    {
      fontSize: "40px",
      fontFamily: "Roboto",
      color: "#ffffff",
      fontStyle: "bold",
    }
  );
  infoContainer.add(scene.text.untilDuelCounter);
  //==========

  //==================
  //vida de ambos jugadores
  //==================

  //=======P1
  const P1LifeTitle = scene.add.text(200, 800, "Vida Jugador 1", {
    fontSize: "24px",
    color: "#ffffff",
  });
  infoContainer.add(P1LifeTitle);

  scene.text.P1LifeText = scene.add.text(200, 750, scene.P1.life, {
    fontSize: "40px",
    fontFamily: "Roboto",
    color: "#ffffff",
    fontStyle: "bold",
  });
  infoContainer.add(scene.text.P1LifeText);

  //=======P2

  const P2LifeTitle = scene.add.text(1100, 200, "Vida Jugador 2", {
    fontSize: "24px",
    color: "#ffffff",
  });
  infoContainer.add(P2LifeTitle);

  scene.text.P2LifeText = scene.add.text(1100, 150, scene.P2.life, {
    fontSize: "40px",
    fontFamily: "Roboto",
    color: "#ffffff",
    fontStyle: "bold",
  });
  infoContainer.add(scene.text.P2LifeText);
}

export function initDuel(scene) {
  //========= Variables de control de fase de duelo ===============
  scene.props.untilDuelCounter = 3;
  scene.props.isDuelPhase = true;
  //===============================================================
  // Muestra el texto con animación
  scene.message.setAlpha(1).setScale(0); // Lo hacemos visible y tamaño inicial 0
  scene.tweens.add({
    targets: scene.message,
    scale: { from: 0, to: 2 },
    alpha: { from: 1, to: 0 },
    ease: "Sine.easeInOut",
    duration: 1200,
    onComplete: () => {
      scene.message.setAlpha(0).setScale(1); // Lo oculta y restablece su tamaño
    },
  });

  scene.P1.board.setAlpha(1);
  scene.P2.board.setAlpha(1);

  scene.P1.dice.setAlpha(0);
  scene.P2.dice.setAlpha(0);

  scene.P1.dice.lockDice();
  scene.P2.dice.lockDice();

  //=====
  //Calculo de dados de daño
  //=====
  if (existsAtackDice(scene)) {
    const activeDuelDice = getDuelDice(scene);
    duel(activeDuelDice, scene);
  } else {
    console.log("No hay ataque");
  }
}

export function existsAtackDice(scene) {
  return scene.P1.board.existsAtackDice() || scene.P2.board.existsAtackDice();
}
function getDuelDice(scene) {
  for (let index = 0; index < 3; index++) {
    const columnP1 = scene.P1.board.columns[index];
    const backwardCount = 2 - index * 2;
    const columnP2 = scene.P2.board.columns[index + backwardCount];

    const frontDiceP1 =
      Array.isArray(columnP1) && columnP1.length > 0 ? columnP1[0] : null;
    const frontDiceP2 =
      Array.isArray(columnP2) && columnP2.length > 0 ? columnP2[0] : null;

    if (!frontDiceP1 && !frontDiceP2) continue;

    const p1CanAttack = frontDiceP1?.canAtack?.() ?? false;
    const p2CanAttack = frontDiceP2?.canAtack?.() ?? false;

    if (!p1CanAttack && !p2CanAttack) continue;

    let duelType = "";

    if (p1CanAttack && p2CanAttack) {
      duelType = "bothAttack";
    } else if (p1CanAttack && !frontDiceP2) {
      duelType = "p1AttackAlone";
    } else if (p2CanAttack && !frontDiceP1) {
      duelType = "p2AttackAlone";
    } else if (p1CanAttack) {
      duelType = "p1Attack";
    } else if (p2CanAttack) {
      duelType = "p2Attack";
    }

    return {
      dice: [frontDiceP1, frontDiceP2],
      diceP1: frontDiceP1,
      diceP2: frontDiceP2,
      type: duelType,
      columnIndex: index,
    };
  }

  return null;
}

async function duel(duel, scene) {
  if (duel) {
    const dice = duel.dice.filter(Boolean);
    await Promise.all(dice.map((_d) => _d.highlight()));

    switch (duel.type) {
      case "bothAttack":
        //DOS SKULL
        if (dice.every((_d) => _d.props.value === DICE_SKULL)) {
          await twoSkullsDuel(dice, scene);
        }

        break;
      case "p1AttackAlone":
        // p1 ataca sin defensa
        //validar si es skull <--- desde aqui nueva loginca
        ///ataca directamente al tablero del otro

        break;
      case "p2AttackAlone":
        // p2 ataca sin defensa -- aqui tamvien nueva logica
        //ataca directamente al tablero del otro

        break;
      case "p1Attack":
        // p1 ataca y p2 defiende
        //aqui iria solo la logica de atacar al dado enemigo, bajarle la vida conlo que quede de la diferencia o destrirlo si el skull es mayor
        break;
      case "p2Attack":
        // p2 ataca y p1 defiende
        //aqui iria solo la logica de atacar al dado enemigo, bajarle la vida o destrirlo si el skull es mayor
        break;
    }

    await Promise.all(dice.map((_d) => _d.unHighlight()));
  }
}

async function twoSkullsDuel(dice, scene) {
  return new Promise(async (resolve) => {
    const boards = { 1: scene.P1.board, 2: scene.P2.board };
    const [dice1, dice2] = dice;

    let winnerDice = null;
    let losserDice = null;

    await Promise.all(
      dice.map((_d) => _d.shake({ onComplete: () => _d.roll(D6) }))
    );

    const value1 = dice1.props.value;
    const value2 = dice2.props.value;
    if (value1 === value2) {
      // Si son iguales, ambos hacen charge al mismo tiempo
      await Promise.all([
        dice1.charge({
          offset: -70,
          onYoyo: async () => {
            // Obtener el tween actual y pausarlo
            const tweens = scene.tweens.getTweensOf(dice1);
            if (tweens.length > 0) {
              const currentTween = tweens[0];
              currentTween.pause();
              await dice1.shake({ duration: 15 });

              // Reanudar el tween
              currentTween.resume();
            }
          },
        }),
        dice2.charge({
          offset: -70,
          onYoyo: async () => {
            // Obtener el tween actual y pausarlo
            const tweens = scene.tweens.getTweensOf(dice2);
            if (tweens.length > 0) {
              const currentTween = tweens[0];
              currentTween.pause();
              await dice2.shake({ duration: 15 });

              // Reanudar el tween
              currentTween.resume();
            }
          },
        }),
      ]);

      // Luego se destruyen al mismo tiempo
      await Promise.all([
        boards[dice1.props.board].destroyDice(dice1),
        boards[dice2.props.board].destroyDice(dice2),
      ]);

      return resolve();
    }

    // Definir ganador y perdedor
    const dice1Wins = value1 > value2;
    winnerDice = dice1Wins ? dice1 : dice2;
    losserDice = dice1Wins ? dice2 : dice1;

    const diferenceDamage = Phaser.Math.Difference(
      winnerDice.props.value,
      losserDice.props.value
    );

    await winnerDice.charge({
      onYoyo: async () => {
        winnerDice.setValue(diferenceDamage);
        await losserDice.shake();
      },
    });

    await boards[losserDice.props.board].destroyDice(losserDice);

    await winnerDice.charge({
      onYoyo: async () => {
        scene["P" + losserDice.props.board].life -= winnerDice.props.value;
        await scene["P" + losserDice.props.board].board.shake();
      },
    });

    await boards[winnerDice.props.board].destroyDice(winnerDice);

    resolve();
  });
}

async function calculateDamages() {
  //======= TIPOS DE ATAQUE ========
  //==========AMBOS atacan=============
  if (frontDiceP1?.canAtack() && frontDiceP2?.canAtack()) {
    //=============
    if (
      frontDiceP1?.props.value === DICE_SKULL &&
      frontDiceP2?.props.value === DICE_SKULL
    ) {
      await highlightBattleDice(frontDiceP1, frontDiceP2, scene);
      const resultDice = await twoSkullsDuel(frontDiceP1, frontDiceP2, scene);

      await clearBattleDiceHighlight(frontDiceP1, frontDiceP2, scene);

      //realiza el daño el jugador correspondiente
      if (resultDice) {
        if (resultDice.props.board === 1) {
          scene.P2.life -= resultDice.props.value;
          scene.P1.board.columns[resultDice.props.position[0]].splice(
            resultDice.props.position[1],
            1
          );
        } else {
          scene.P1.life -= resultDice.props.value;
          scene.P2.board.columns[resultDice.props.position[0]].splice(
            resultDice.props.position[1],
            1
          );
        }
        await destroyDiceAnimation(resultDice, scene);
      }

      board1.sortColumn(index);
      board2.sortColumn(index + backwardCount);
    }
    //============
    //el P1 es skull y el P2 no, pero ambos atacan
    else if (
      frontDiceP1?.props.value === DICE_SKULL &&
      frontDiceP2?.props.value !== DICE_SKULL
    ) {
      await highlightBattleDice(frontDiceP1, frontDiceP2, scene);
      console.log("el P1 es skull y el P2 no, pero ambos atacan");
      await clearBattleDiceHighlight(frontDiceP1, frontDiceP2, scene);
    }
    //=============
    //el P2 es skull y el P1 no, pero ambos atacan
    else if (
      frontDiceP1?.props.value !== DICE_SKULL &&
      frontDiceP2?.props.value === DICE_SKULL
    ) {
      await highlightBattleDice(frontDiceP1, frontDiceP2, scene);
      console.log("el P2 es skull y el P1 no, pero ambos atacan");
      await clearBattleDiceHighlight(frontDiceP1, frontDiceP2, scene);
    }
    //=============
    //Ninguno es skull, pero ambos atacan
    else if (
      frontDiceP1?.props.value !== DICE_SKULL &&
      frontDiceP2?.props.value !== DICE_SKULL
    ) {
      await highlightBattleDice(frontDiceP1, frontDiceP2, scene);
      console.log("Ninguno es skull, pero ambos atacan");
      await clearBattleDiceHighlight(frontDiceP1, frontDiceP2, scene);
    }
  }

  //si P1 ataca a P2
  if (frontDiceP1?.canAtack() && (!frontDiceP2?.canAtack() || !frontDiceP2)) {
    //===============
    //el dado que ataca es skull
    if (frontDiceP1?.props.value === DICE_SKULL) {
      await highlightBattleDice(frontDiceP1, frontDiceP2, scene);

      let resultDice = null;
      if (!frontDiceP2) {
        resultDice = await oneSkullAtackNoDefense(frontDiceP1, scene);
      } else {
        //si P1 ataca tiene que ser skull, por lo que el otro tiene que ser normal o con defensa
        resultDice = await oneSkullAtackAndDefense(
          frontDiceP1,
          frontDiceP2,
          scene
        );
      }

      if (resultDice) {
        scene.P2.life -= resultDice.props.value;
        scene.P1.board.columns[resultDice.props.position[0]].splice(
          resultDice.props.position[1],
          1
        );
      }

      await clearBattleDiceHighlight(frontDiceP1, frontDiceP2, scene);
    }
    //============
    //el dado que ataca no es skull
    else if (frontDiceP1?.props.value !== DICE_SKULL) {
      await highlightBattleDice(frontDiceP1, frontDiceP2, scene);
      console.log("el dado que ataca no es skull");
      await clearBattleDiceHighlight(frontDiceP1, frontDiceP2, scene);
    }
  } //si P2 ataca a P1
  if ((!frontDiceP1?.canAtack() || !frontDiceP1) && frontDiceP2?.canAtack()) {
    //===============
    //el dado que ataca es skull
    if (frontDiceP2?.props.value === DICE_SKULL) {
      await highlightBattleDice(frontDiceP1, frontDiceP2, scene);
      console.log("el dado que ataca es skull 2 ");
      await clearBattleDiceHighlight(frontDiceP1, frontDiceP2, scene);
    }
    //============
    //el dado que ataca no es skull
    else if (frontDiceP2?.props.value !== DICE_SKULL) {
      await highlightBattleDice(frontDiceP1, frontDiceP2, scene);
      console.log("el dado que ataca no es skull 2");
      await clearBattleDiceHighlight(frontDiceP1, frontDiceP2, scene);
    }
  }

  //solo uno es skull
  frontDiceP1 = null;
  frontDiceP2 = null;
}
