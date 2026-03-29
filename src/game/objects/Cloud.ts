import { getRandomX } from "../utils/random"
import { MOVEMENT } from "./constants"

export class Cloud extends Phaser.Physics.Arcade.Sprite {

    static preload(scene: Phaser.Scene) {
		for (let i = 1; i <= 10; i++) {
			const key = `cloud${String(i).padStart(2, '0')}`
			scene.load.image(key, `${key}.png`)
		}
    }

	static randomTextureKey() {
		const i = Phaser.Math.Between(1, 10)
		return `cloud${String(i).padStart(2, '0')}`
	}

	// static getRandomX() {
	// 	return Phaser.Math.Between(1, 1024)
	// }

	static getRandomMovement() {
		return Phaser.Math.Between(-200, -1500) * MOVEMENT
	}

    constructor(scene: Phaser.Scene) {
        super(scene, getRandomX(), 1044, Cloud.randomTextureKey())

        scene.add.existing(this)
        scene.physics.add.existing(this)

        // this.setCollideWorldBounds(true)
        this.setGravityY(Cloud.getRandomMovement())
		// this.setDepth(80)
        
        // this.body?.setSize(55, 35)
        
        // scene.time.addEvent({
        //     delay: 4000,
        //     loop: true,
        //     callback: () => {
        //         this.play('gold_shine');
        //     }
        // });

    }

	update()
	{

	}

	destroy()
	{
		this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this)    
	}

}
