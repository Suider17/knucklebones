import dice from "../../models/dice";
import Dice from "../dice/Dice";

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

  setFrontLine(column) {
    // Filtrar los dados que estén en la columna indicada.
    const diceInColumn = this.dice.filter(
      (dice) => dice.atributes.position[0] === column
    );
    diceInColumn.reduce((min, obj) => {
      // Verifica que el objeto tenga value en 0 cuando sea menor que 7
      // verifica que el objeto sea menor que 7 pero diferente de 0
      if (
        obj.atributes.value === 0 &&
        (rollingDice.atributes.value < 7 ||
          [9, 10].includes(rollingDice.atributes.value))
      ) {
        return min === null ||
          obj.atributes.position[1] < min.atributes.position[1]
          ? obj
          : min;
      }
      return min; // Si no cumple la condición, mantiene el mínimo actual
    }, null);

    // if (diceInColumn.some((_d) => _d.mods?.some((mod) => mod === 8))) {
    //   //si tiene modificador de ataque ordenarlo
    //   let sorted = false;
    //   let modedDice = null;
    //   let count = 0;

    //   while (!sorted) {
    //     if (
    //       diceInColumn[diceInColumn.length - count - 1].mods?.some((mod) =>
    //         [7, 8].includes(mod)
    //       )
    //     ) {
    //       modedDice = diceInColumn[diceInColumn.length - count - 1];

    //       //si el de mod está en la ultima posicion
    //       if ((modedDice.atributes.position[1] = 2)) {
    //         //si la primera posicion no tiene de ataque
    //         if (!diceInColumn[0].mods?.some((mod) => mod === 8)) {
    //           diceInColumn.forEach((dice) => {
    //             dice.atributes.position[1]++;
    //           });
    //         } else if (!diceInColumn[1].mods?.some((mod) => mod === 8)) {
    //         }
    //       } else if ((modedDice.atributes.position[1] = 1)) {
    //       }
    //     }

    //     sorted = true;
    //   }
    // } else if (diceInColumn.some((_d) => _d.atributes.value === 9)) {
    //   let sorted = false;
    //   let modedDice = null;
    //   let count = 0;

    //   while (!sorted) {
    //     if (
    //       diceInColumn[diceInColumn.length - count - 1].mods?.some((mod) =>
    //         [7, 8].includes(mod)
    //       )
    //     ) {
    //       modedDice = diceInColumn[diceInColumn.length - count - 1];

    //       //si el de mod está en la ultima posicion
    //       if ((modedDice.atributes.position[1] = 2)) {
    //         //si la primera posicion no tiene de ataque
    //         if (!diceInColumn[0].mods?.some((mod) => mod === 8)) {
    //           diceInColumn.forEach((dice) => {
    //             dice.atributes.position[1]++;
    //           });
    //         } else if (!diceInColumn[1].mods?.some((mod) => mod === 8)) {
    //         }
    //       } else if ((modedDice.atributes.position[1] = 1)) {
    //       }
    //     }

    //     sorted = true;
    //   }
    // }

    // // Actualizar la posición (la fila) de cada dado en la columna según su orden.
    // diceInColumn.forEach((die, index) => {
    //   // Actualizamos la fila del dado (position[0])
    //   die.atributes.position[1] = index;

    //   // Opcional: Si manejas posiciones visuales, podrías actualizar 'y' en función de index.
    //   // Por ejemplo: die.y = baseY + index * cellHeight;
    // });
  }

  calculateCombos(column) {
    let totalScore = 0;
    let multiplier = 1;
    let diceValueMultiplier = 1;
    let repeatedDice = []; // Arreglo para almacenar los dados repetidos

    // Filtrar los dados en la columna especificada y que tengan valores entre 1 y 6
    const diceOfColumn = this.dice.filter(
      (dice) =>
        dice.atributes.position[0] === column && // Misma columna
        dice.atributes.value >= 1 &&
        dice.atributes.value <= 6 // Valores entre 1 y 6
    );

    // Crear un objeto para contar las repeticiones de cada valor
    const valueCounts = {};

    // Contar cuántos dados tienen cada valor
    diceOfColumn.forEach((dice) => {
      const value = dice.atributes.value;
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
      (acc, dice) => acc + dice.atributes.value,
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
        d.diceSprite.setFrame(d.atributes.value + 10);
      });
    } else if (multiplier === 3) {
      repeatedDice.forEach((d) => {
        d.diceSprite.setFrame(d.atributes.value + 16);
      });
    }
  }
}
