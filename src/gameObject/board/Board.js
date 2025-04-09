import dice from "../../models/dice";
import Dice from "../dice/Dice";
import {
  BUCKET_HIERARCHY,
  DICE_BUCKET,
  DICE_EMPTY,
} from "../../definitions/diceDefinitions";

export default class Board extends Phaser.GameObjects.Container {
  constructor(scene, x, y, id) {
    super(scene, x, y);

    //agregar el contenedor a la escena
    scene.add.existing(this);

    this.dice = [];
    this.totals = [];
    this.columns = [];
    this.id = id;
  }
  /**
   * Llena el tablero con los dados
   * areas interactivas para click
   * y los agrega al container
   */
  fillBoard() {
    //creamos la imagen de contenedor
    this.add(this.scene.add.image(0, 0, "diceBox").setOrigin(0, 0));

    // Crear 9 instancias de Dice y añadirlas al array
    for (let i = 0; i < 9; i++) {
      const x = 70 + (i % 3) * 130; // Distribución en filas de 3
      const y = 70 + Math.floor(i / 3) * 130; // Distribución en columnas de 3

      const atributes = dice(i % 3, Math.floor(i / 3));
      atributes.scale = 0.6;
      atributes.blocked = true;

      // Crear una instancia de Dice
      const newDice = new Dice(
        this.scene,
        x,
        y,
        "diceFaces",
        atributes,
        this.id
      );
      // Añadir el dado al array
      this.dice.push(newDice);
      this.add(newDice);

      //add event zone to columns and totals
      if (i < 3) {
        //=== columns
        this.columns[i] = this.scene.add
          .zone(x - 55, y - 55, 115, 380)
          .setOrigin(0, 0);

        this.add(this.columns[i]);
        //===== reference column area
        const zoneReferences = this.scene.add
          .graphics()
          .lineStyle(4, 0xffffff)
          .strokeRect(x - 55, y - 55, 115, 380);
        this.add(zoneReferences);
        //===== total
        this.totals[i] = this.scene.add.text(x, y - 90, 0, {
          fontSize: "32px",
          color: "#ffffff",
        });

        if (this.id == 2) {
          this.totals[i].angle = 180;
        }

        this.add(this.totals[i]);
      }
    }
  }

  enableBoardDiceEvent() {
    this.dice.forEach((dice) => {
      dice.setInteractive();
    });
  }
  disableBoardDiceEvent() {
    this.dice.forEach((dice) => {
      dice.disableInteractive();
    });
  }

  updateSingleTotal(column, score = 0) {
    this.totals[column].setText(parseInt(score));
  }

  enableBoardColumnEvent() {
    this.columns.forEach((column) => {
      column.setInteractive();
    });
  }
  disableBoardDiceEvent() {
    this.columns.forEach((column) => {
      column.disableInteractive();
    });
  }

  sortColumn(column) {
    let dice = this.dice.filter((dice) => dice.props.position[0] === column);

    let diceValues = this.dice
      .filter((dice) => dice.props.position[0] === column)
      .map((_d) => _d.props.value);

    diceValues.sort((a, b) => {
      return (
        BUCKET_HIERARCHY[DICE_BUCKET(a)] - BUCKET_HIERARCHY[DICE_BUCKET(b)]
      );
    });
    dice.forEach((_d, index) => {
      _d.props.value = diceValues[index];
    });
  }

  updateDiceFrames() {
    this.dice.forEach((_d) => {
      _d.diceSprite.setFrame(_d.props.value);
    });
  }

  /**
   * Valida si en la fila de datos hay un espacio
   * donde se pueda colocar un nuevo dado
   * @param {Array} diceInColumn
   * @returns {boolean}
   */
  hasEmptyBoardSlot(column) {
    return this.dice
      .filter((dice) => dice.props.position[0] === column)
      .some((_d) => _d.props.value == DICE_EMPTY);
  }

  calculateCombos(column) {
    let totalScore = 0;
    let multiplier = 1;
    let diceValueMultiplier = 1;
    let repeatedDice = []; // Arreglo para almacenar los dados repetidos

    // Filtrar los dados en la columna especificada y que tengan valores entre 1 y 6
    const diceOfColumn = this.dice.filter(
      (dice) =>
        dice.props.position[0] === column && // Misma columna
        dice.props.value >= 1 &&
        dice.props.value <= 6 // Valores entre 1 y 6
    );

    // Crear un objeto para contar las repeticiones de cada valor
    const valueCounts = {};

    // Contar cuántos dados tienen cada valor
    diceOfColumn.forEach((dice) => {
      const value = dice.props.value;
      if (valueCounts[value]) {
        valueCounts[value].count++; // Incrementar el contador
        valueCounts[value].dice.push(dice); // Añadir el dado al arreglo
      } else {
        valueCounts[value] = {
          count: 1, // Iniciar el contador
          dice: [dice], // Iniciar el arreglo de dados
        };
      }
    });

    // Buscar el valor que más se repite (si lo hay) y sus datos
    for (const value in valueCounts) {
      if (valueCounts[value].count > multiplier) {
        multiplier = valueCounts[value].count; // Número de repeticiones
        diceValueMultiplier = parseInt(value); // Valor que se repite
        repeatedDice = valueCounts[value].dice; // Dados que se repiten
      }
    }

    // Calcular la suma total de los dados en la columna
    const sumOfDice = diceOfColumn.reduce(
      (acc, dice) => acc + dice.props.value,
      0
    );

    // Si hay un combo (más de un dado con el mismo valor), aplicar la fórmula
    if (multiplier > 1) {
      totalScore = diceValueMultiplier * multiplier * multiplier;
    } else {
      // Si no hay repetición, asignamos el totalScore como la suma de los valores de la columna
      totalScore = sumOfDice;
    }

    this.updateSingleTotal(column, totalScore);

    // Retornar el puntaje total, el valor repetido, el multiplicador y los dados repetidos
    if (multiplier === 2) {
      repeatedDice.forEach((d) => {
        d.diceSprite.setFrame(d.props.value + 10);
      });
    } else if (multiplier === 3) {
      repeatedDice.forEach((d) => {
        d.diceSprite.setFrame(d.props.value + 16);
      });
    }
  }
}
