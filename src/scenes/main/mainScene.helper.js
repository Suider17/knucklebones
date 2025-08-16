import { D6, DICE_SKULL } from "../../definitions/dice.definit";
import Dice from "../../gameObject/dice/Dice";

export function setRoundText(scene) {
  scene.text.roundCounter.setText(scene.roundCounter);
}
export function setTurnText(scene) {
  scene.text.turnCounter.setText(scene.turnCounter);
}
export function setUntilDuelText(scene) {
  scene.text.untilDuelCounter.setText(scene.untilDuelCounter);
}
export function setPlayersLifeText(scene) {
  scene.text.P1LifeText.setText(scene.P1.life);
  scene.text.P2LifeText.setText(scene.P2.life);
}

export function drawTurnForTurn(scene) {}

export function createInfoTextPanel(scene) {
  //textos de informacion en pantalla
  const infoContainer = scene.add.container(30, 30);
  //=========
  //Turno actual

  const turnCountTitle = scene.add.text(30, 200, "Turno actual", {
    fontSize: "24px",
    color: "#ffffff",
  });
  infoContainer.add(turnCountTitle);
  scene.text.turnCounter = scene.add.text(100, 230, scene.turnCounter, {
    fontSize: "40px",
    fontFamily: "Roboto",
    color: "#ffffff",
    fontStyle: "bold",
  });
  infoContainer.add(scene.text.turnCounter);
  //==========
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
