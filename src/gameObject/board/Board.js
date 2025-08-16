import Dice from "../dice/Dice";
import {
  BUCKET_HIERARCHY,
  DICE_BUCKET,
  DICE_EMPTY,
  MOD_DICE_BUCKET,
  NORMAL_BUCKET_ARRAY,
} from "../../definitions/dice.definit";
import BoardAnimator from "./animations/BoardAnimator";
import {
  BOARD_HOLDER_VALUE_ASSIGNED,
  BOARD_PDICE_VALUE_ASSIGNED,
} from "./board.events";
import { DICE_HOLDER_VALUE_ASSIGNED } from "../diceHolder/diceHolder.events";
import { DICE_NEW_ARCHETYPE } from "../dice/dice.events";

export default class Board extends Phaser.GameObjects.Container {
  constructor(scene, x, y, id, player) {
    super(scene, x, y);

    //agregar el contenedor a la escena
    scene.add.existing(this);
    this.id = id;
    this.totals = [];

    this.columnsInteractiveZones = [];

    this.animator = new BoardAnimator(scene, this);
    this.columns = {
      //is were dice goes
      0: [],
      1: [],
      2: [],
    };

    //other classes references
    this.player = player;

    //state control variables
    this.eventsEnabled = false;
  }
  /**
   * areas interactivas para click
   * y los agrega al container
   */
  init() {
    //crea la imagen de contenedor
    this.sprite = this.add(
      this.scene.add.image(0, 0, "diceBox").setOrigin(0, 0)
    );

    //add event zone to columns and totals
    for (let i = 0; i < 3; i++) {
      const x = 70 + i * 130; // Distribución en filas de 3
      //=== columns
      this.columnsInteractiveZones[i] = this.scene.add
        .zone(x - 55, 10, 115, 380)
        .setOrigin(0, 0)
        .setInteractive();

      this.add(this.columnsInteractiveZones[i]);

      this.totals[i] = this.scene.add.text(x, -25, 0, {
        fontSize: "32px",
        color: "#ffffff",
      });

      if (this.id == 2) {
        this.angle = 180;
        this.totals[i].angle = 180;
      }

      this.add(this.totals[i]);
    }
    this.setPointerEvents();
  }

  //==========================
  //==========EVENTS==========
  //==========================
  setPointerEvents() {
    this.columnsInteractiveZones.forEach((column, index) => {
      column.on("pointerover", () => this.handlePointerOver(index));
      column.on("pointerout", () => this.handlePointerOut(index));
      column.on("pointerdown", () => this.handlePointerDown(index));
    });
  }

  handlePointerOver(index) {
    const diceInColumn = this.columns[index];
    const player = this.player;
    const diceHolder = player.diceHolder;

    const isHolderValue = diceHolder.value !== 0 && diceHolder.selected;

    const newValue = isHolderValue ? diceHolder.value : player.dice.value;

    const isMod = DICE_BUCKET(newValue) === MOD_DICE_BUCKET;
    const hasModSlot = diceInColumn.some((_d) => _d.hasEmptyModSlot());
    const hasDiceSlot = this.hasEmptyDiceSlot(index);

    if (!isMod && hasDiceSlot) {
      this.addNewDiceInColumn(index, newValue, true);
    } else if (isMod && hasModSlot) {
      const diceWithModSlot = this.getDiceWithEmptyModSlot(index);

      if (!diceWithModSlot) {
        console.log("no hay donde poner el mod");
        return;
      }

      diceWithModSlot.insertMod(newValue);
    } else if (!hasModSlot && !hasDiceSlot) {
      console.log("AQUI NO HAY ESPACIO MU CHAVO");
    }
    this.sortColumn(index);
  }

  handlePointerOut(index) {
    const lastInserted = this.getLastInsertedDice(); //el ultimo dado insertado
    //const isHolderValue = diceHolder.value !== 0 && diceHolder.selected;
    const isMod = lastInserted.object?.mods.find((mod) => mod.lastInserted);

    const diceInColumn = this.columns[index];
    if (lastInserted.object && lastInserted.index !== -1) {
      if (!isMod) {
        //eliminamos el ultimo dado insertado de la columna
        {
          lastInserted.object.remove();
          this.columns[index].splice(lastInserted.index, 1);
        }
      } else if (
        isMod &&
        diceInColumn.some((_d) => NORMAL_BUCKET_ARRAY.includes(_d.value))
      ) {
        //console.log(lastInserted.object.mods);
        const mod = lastInserted.object.mods.find((mod) => mod.lastInserted);
        lastInserted.object.lastInserted = false;
        lastInserted.object.disposeMod();
      }
    } else {
      console.warn(
        "La columna en la que se inténtó ingresar está vacia o no hay ultimo insertado"
      );
    }

    this.sortColumn(index);
  }
  handlePointerDown(index) {
    const lastInserted = this.getLastInsertedDice(); // El último dado insertado
    const diceHolder = this.player.diceHolder;
    const isHolderValue = diceHolder.value !== 0 && diceHolder.selected;
    const hasModSlot = this.columns[index].some((_d) =>
      NORMAL_BUCKET_ARRAY.includes(_d.value)
    );
    const isMod = DICE_BUCKET(this.player.dice.value) === MOD_DICE_BUCKET;

    if (!lastInserted.object || lastInserted.index === -1) {
      console.warn("No hay dado válido seleccionado para insertar");
      return;
    }
    lastInserted.object.lastInserted = false;

    if (!isMod) {
      // Insertar dado normal

      this.calculateCombos(index);
      this.disableEvents();
    } else if (isMod && hasModSlot) {
      // Insertar dado como mod
      const mod = lastInserted.object?.mods.find((mod) => mod.lastInserted);

      if (mod) {
        mod.lastInserted = false;
        lastInserted.object.lastInserted = false;
      } else {
        console.warn("No se encontró un mod marcado como lastInserted");
      }
    } else {
      console.warn("No existe espacio para poner este dado");
    }

    //Emit to player, board has assgined a slot
    if (isHolderValue) {
      this.emit(BOARD_HOLDER_VALUE_ASSIGNED, this);
    } else {
      this.emit(BOARD_PDICE_VALUE_ASSIGNED, this);
    }
  }

  enableEvents() {
    this.columnsInteractiveZones.forEach((column) => {
      column.setInteractive();
    });
    this.eventsEnabled = true;
    this.setAlpha(1);
  }

  disableEvents() {
    this.columnsInteractiveZones.forEach((column) => {
      column.disableInteractive();
    });
    this.eventsEnabled = false;
    this.setAlpha(0.5);
  }

  //==========================
  //==========================

  addNewDiceInColumn(index, diceValue, lastInserted = false) {
    const column = this.columns[index];
    const newDice = new Dice(
      this.scene,
      0,
      0,
      "diceFaces",
      diceValue,
      [index, column.length],
      this,
      0.7,
      !!lastInserted
    );
    newDice.init();
    this.add(newDice);
    this.setDiceEventListener(newDice);

    column.length < 3 && column.push(newDice);

    column.forEach((_d) => {
      _d.updatePosition();
    });
  }

  setDiceEventListener(dice) {
    dice.on(DICE_NEW_ARCHETYPE, () => {
      //console.log("NUEVO ARQUETIPO>: " + dice.archetype);
    });
  }

  updateSingleTotal(column, score = 0) {
    if (this.totals[column]) {
      this.totals[column].setText(parseInt(score));
    } else {
      console.error(`Error: No existe un valor para la columna ${column}`);
    }
  }

  sortColumn(column) {
    let dice = this.columns[column];

    dice.sort((a, b) => {
      return (
        BUCKET_HIERARCHY[DICE_BUCKET(a.value)] -
        BUCKET_HIERARCHY[DICE_BUCKET(b.value)]
      );
    });

    dice.forEach((_d, index) => {
      _d.updatePosition(column, index);
    });

    this.updateDiceSprites();
  }

  updateDiceSprites() {
    //recorrer todos los dados y acutalizar los sprites
    Object.values(this.columns).forEach((column) => {
      if (column) {
        column.forEach((_d) => {
          _d.sprite.setFrame(_d.value);
          //_d.refreshMods();
        });
      }
    });
  }

  /**
   * Valida si en la fila de datos hay un espacio
   * donde se pueda colocar un nuevo dado
   * @param {int} column
   * @returns {boolean}
   */
  hasEmptyDiceSlot(index) {
    const column = this.columns[index];

    if (!column) return true;

    return column.length < 3;
  }

  calculateCombos() {
    // Recorre todas las columnas
    Object.keys(this.columns).forEach((columnIndex) => {
      let totalScore = 0;
      let multiplier = 1;
      let diceValueMultiplier = 1;
      let repeatedDice = []; // Arreglo para almacenar los dados repetidos

      const column = this.columns[columnIndex];

      if (!column || column.length === 0) {
        this.updateSingleTotal(columnIndex, 0);
        return;
      }

      // Filtrar los dados válidos (con valores entre 1 y 6)
      const validDice = column.filter(
        (dice) => dice.value >= 1 && dice.value <= 6
      );

      // Contador de valores
      const valueCounts = {};

      // Contar cuántos dados tienen cada valor
      validDice.forEach((dice) => {
        const value = dice.value;
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
      const sumOfDice = validDice.reduce((acc, dice) => acc + dice.value, 0);

      // Si hay un combo (más de un dado con el mismo valor), aplicar la fórmula
      if (multiplier > 1) {
        totalScore = diceValueMultiplier * multiplier * multiplier;
      } else {
        // Si no hay repetición, asignamos el totalScore como la suma de los valores de la columna
        totalScore = sumOfDice;
      }

      this.updateSingleTotal(columnIndex, totalScore);

      // Cambiar los frames según el combo
      if (multiplier === 2) {
        repeatedDice.forEach((d) => {
          d.sprite.setFrame(d.value + 10);
        });
      } else if (multiplier === 3) {
        repeatedDice.forEach((d) => {
          d.sprite.setFrame(d.value + 16);
        });
      } else {
        // Restaurar frames si no hay combo
        column.forEach((d) => {
          d.sprite.setFrame(d.value);
        });
      }
    });
  }

  /**
   * @typedef {Object} LastInsertedResult
   * @property {Dice|null} object
   * @property {number} index
   */
  /**
   * Valida si en la fila de datos hay un espacio
   * donde se pueda colocar un nuevo dado. Devuelve el objeto
   * y la posicion en la columna
   * @returns {LastInsertedResult}
   */
  getLastInsertedDice() {
    let last = null;
    let index;

    for (const column of Object.values(this.columns)) {
      if (!column) continue;

      const found = column.find((_d) => _d.lastInserted);
      index = column.findIndex((_d) => _d.lastInserted);
      if (found) {
        last = found;
        break;
      }
    }
    return { object: last, index: index };
  }

  getDiceWithEmptyModSlot(columnIndex = null) {
    if (columnIndex !== null) {
      const column = this.columns[columnIndex];
      if (!column) return null;
      return column.find((_d) => _d.hasEmptyModSlot()) || null;
    }

    for (const column of Object.values(this.columns)) {
      if (!column) continue;

      const found = column.find((_d) => _d.hasEmptyModSlot());
      if (found) return found;
    }

    return null;
  }

  /**
   * Verifica si existe al menos un dado en alguna columna que pueda atacar.
   *
   * Esta función recorre todas las columnas y evalúa si al menos un elemento
   * en alguna de ellas tiene la capacidad de atacar mediante su método `canAtack()`.
   *
   * @returns {boolean} `true` si al menos un dado puede atacar, `false` en caso contrario.
   */
  existsAtackDice() {
    return Object.values(this.columns).some(
      (column) => column && column.some((_d) => _d.canAtack())
    );
  }

  //DELETE
  async destroyDice(dice) {
    if (dice) {
      this.columns[dice.position[0]].splice(dice.position[1], 1);
      await dice.destroy({
        onComplete: () => {
          console.log("destroy");
          dice.destroy();
        },
      });
    }
  }

  //==========================
  //========ANIMATIONS========

  async shake({ onStart, onComplete, duration } = {}) {
    await this.animator.shake({ onStart, onComplete, duration });
  }
}
