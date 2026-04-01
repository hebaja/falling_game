import { getRandomMovement, getRandomX } from "../utils/random"

export class Gold extends Phaser.Physics.Arcade.Sprite {

	private shineTimer?: Phaser.Time.TimerEvent

    static preload(scene: Phaser.Scene) {
        scene.load.spritesheet('gold', 'Gold Stone 3_Highlight.png', {
           frameHeight: 128,
           frameWidth: 128
        })
        scene.load.spritesheet('explosion', 'Explosion_02.png', {
           frameHeight: 192,
           frameWidth: 192
        })
    }

    static createAnims(scene: Phaser.Scene) {
        scene.anims.create({
            key: 'gold_shine',
            frames: scene.anims.generateFrameNumbers('gold', {frames: [0, 1, 2, 3, 4, 5]}),
            frameRate: 8,
            repeat: 2
        })
        scene.anims.create({
            key: 'gold_explosion',
            frames: scene.anims.generateFrameNumbers('explosion', {frames: [0, 1, 2, 3, 4, 5, 6, 7]}),
            frameRate: 8,
            repeat: 0
        })
    }
    
    constructor(scene: Phaser.Scene) {
        super(scene, getRandomX(), 1044, 'gold')

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setGravityY(getRandomMovement())
        
        this.body?.setSize(55, 35)
        
		this.shineTimer = scene.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
				// Don't interrupt the explosion animation.
				if (!this.active || this.anims.currentAnim?.key === 'gold_explosion') return
				this.play('gold_shine');
            }
        });

    }

	update()
	{

	}

	destroy(fromScene?: boolean)
	{
		this.shineTimer?.remove(false)
		this.shineTimer = undefined
		super.destroy(fromScene)
	}

}
