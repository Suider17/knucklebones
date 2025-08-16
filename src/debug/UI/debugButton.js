export default class DebugButtons {
  constructor(scene) {
    this.scene = scene;
    this.buttons = [];
    // Tooltip text object (shared for all buttons)
    this.tooltip = this.scene.add
      .text(0, 0, "", {
        fontSize: "14px",
        color: "#fff",
        backgroundColor: "#222",
        padding: { x: 8, y: 4 },
        alpha: 0.95,
        wordWrap: { width: 220 },
      })
      .setDepth(2000)
      .setVisible(false);
  }

  addButton(label, x, y, callback, description = "") {
    const button = this.scene.add
      .text(x, y, label, {
        fontSize: "16px",
        color: "#fff",
        backgroundColor: "#000",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .on("pointerdown", callback)
      .on("pointerover", () => {
        button.setStyle({ backgroundColor: "#555" });
        if (description) {
          this.tooltip.setText(description);
          // Position tooltip to the left of the button
          this.tooltip.setPosition(button.x - this.tooltip.width - 8, button.y);
          this.tooltip.setVisible(true);
        }
      })
      .on("pointerout", () => {
        button.setStyle({ backgroundColor: "#000" });
        this.tooltip.setVisible(false);
      });

    this.buttons.push(button);
    return button;
  }

  clearButtons() {
    this.buttons.forEach((button) => button.destroy());
    this.buttons = [];
    if (this.tooltip) this.tooltip.setVisible(false);
  }
}
