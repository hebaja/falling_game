import { Scene } from "phaser";

export class GameOverOverlay extends Scene {
	constructor() {
		super("GameOverOverlay");
	}
	
	create() {
	const { width, height } = this.scale;
	// Dim background
	this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0);
	this.add.text(width / 2, height / 2 - 60, "Game Over", {
		fontFamily: "Arial",
		fontSize: "64px",
		color: "#ffffff",
	}).setOrigin(0.5);
	const btn = this.add.text(width / 2, height / 2 + 20, "Restart", {
		fontFamily: "Arial",
		fontSize: "48px",
		color: "#ffffff",
		backgroundColor: "#1f2937",
		padding: { x: 20, y: 12 },
	}).setOrigin(0.5).setInteractive({ useHandCursor: true });
	btn.on("pointerup", () => {
		// Restart the game scene and close overlay
		this.scene.get("Game").scene.restart();
		this.scene.stop();
    });
  }
}
