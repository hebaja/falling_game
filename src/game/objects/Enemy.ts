export class Enemy extends Phaser.Physics.Arcade.Sprite {

    enemyLife: number = 2
    isDead: boolean = false
    
    static preload(scene: Phaser.Scene) {
        scene.load.spritesheet('enemy', 'enemy_run.png', {
           frameHeight: 150,
           frameWidth: 150
        })
        scene.load.spritesheet('enemy_death', 'enemy_death.png', {
           frameHeight: 150,
           frameWidth: 150
        })
        scene.load.spritesheet('enemy_take_hit', 'enemy_take_hit.png', {
           frameHeight: 150,
           frameWidth: 150
        })
    }

    static createAnims(scene: Phaser.Scene) {
        scene.anims.create({
            key: 'enemy_run',
            frames: scene.anims.generateFrameNumbers('enemy', {frames: [0, 1, 2, 3, 4, 5, 6, 7]}),
            frameRate: 8,
            repeat: 2
        })
        scene.anims.create({
            key: 'enemy_death',
            frames: scene.anims.generateFrameNumbers('enemy_death', {frames: [0, 1, 2, 3]}),
            frameRate: 8,
            repeat: 0
        })
        scene.anims.create({
            key: 'enemy_take_hit',
            frames: scene.anims.generateFrameNumbers('enemy_take_hit', {frames: [1, 2, 3]}),
            frameRate: 8,
            repeat: 0
        })
    }

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture)

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setScale(3)
        this.setCollideWorldBounds(true)
        
        this.setGravityY(5000)
		this.body?.setSize(20, 50)
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    }

    update() 
    {
		this.setFlipX(true)
        if (!this.isDead && (this.anims.currentAnim?.key !== 'enemy_take_hit' || !this.anims.isPlaying)) {
            this.play('enemy_run', true)
		    this.setVelocityX(-150)
        } else if (this.isDead) {
            this.setVelocity(0)
             if (this.anims.currentAnim?.key !== 'enemy_death') {
                this.play('enemy_death')
            }
        }
    }
}
