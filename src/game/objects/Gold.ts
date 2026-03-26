export class Gold extends Phaser.Physics.Arcade.Sprite {

    static preload(scene: Phaser.Scene) {
        scene.load.spritesheet('gold', 'Gold Stone 3_Highlight.png', {
           frameHeight: 128,
           frameWidth: 128
        })
    }

    static createAnims(scene: Phaser.Scene) {
        scene.anims.create({
            key: 'gold_shine',
            frames: scene.anims.generateFrameNumbers('gold', {frames: [0, 1, 2, 3, 4, 5]}),
            frameRate: 8,
            repeat: 2
        })
    }
    
    static collect(player: any, gold: any)
    {
        gold.disableBody(true, true)
    }

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture)

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setCollideWorldBounds(true)
        this.setGravityY(5000)
        
        this.body?.setSize(55, 35)
        
        scene.time.addEvent({
            delay: 4000,
            loop: true,
            callback: () => {
                this.play('gold_shine');
            }
        });

    }

}