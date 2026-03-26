type PlayerControls = {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    W: Phaser.Input.Keyboard.Key;
    J: Phaser.Input.Keyboard.Key;
};

export class Player extends Phaser.Physics.Arcade.Sprite {
    private controls: PlayerControls
    private keyboard: any
    isAttacking: boolean = false
	attackHitbox: any
    mainScene: any
    private isTakingHit: boolean = false
    private attackEnableTimer?: Phaser.Time.TimerEvent

    static preload(scene: Phaser.Scene) {
        scene.load.spritesheet('player_idle', 'Warrior_Idle.png', {
            frameWidth: 192,
            frameHeight: 192
        })
        scene.load.spritesheet('player_run', 'Warrior_Run.png', {
            frameWidth: 192,
            frameHeight: 192
        })
        scene.load.spritesheet('player_attack', 'Warrior_Attack1.png', {
           frameHeight: 192,
           frameWidth: 192
        })
        scene.load.spritesheet('player_take_hit', 'Warrior_Guard.png', {
           frameHeight: 192,
           frameWidth: 192
        })
    }

    static createAnims(scene: Phaser.Scene) {
        scene.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNumbers('player_idle', { frames: [0, 1, 2, 3, 4, 5, 6, 7]}),
            frameRate: 8,
            repeat: -1
        })
        scene.anims.create({
            key: 'attack',
            frames: scene.anims.generateFrameNumbers('player_attack', { frames: [0, 1, 2, 3]}),
            frameRate: 8,
            repeat: 0
        })
        scene.anims.create({
            key: 'run',
            frames: scene.anims.generateFrameNumbers('player_run', { frames: [0, 1, 2, 3, 4, 5]}),
            frameRate: 8,
            repeat: -1
        })
        scene.anims.create({
            key: 'take_hit',
            frames: scene.anims.generateFrameNumbers('player_take_hit', { frames: [0, 1, 2, 3, 4, 5]}),
            frameRate: 8,
            repeat: 0
        })
    }

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture)
        this.mainScene = scene
        this.keyboard = scene.input.keyboard
        if (!this.keyboard) throw new Error('Keyboard plugin not available')
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setScale(1.5)
        this.setCollideWorldBounds(true)
        // this.setGravityY(5000)
        this.setDamping(true)
        this.setDrag(0.01)

        this.body?.setSize(84, 70)
        this.on('animationcomplete-attack', () => {
            this.isAttacking = false
        })
        this.on('animationstop-attack', () => {
            this.isAttacking = false
        })

        this.controls = this.keyboard?.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            W: Phaser.Input.Keyboard.KeyCodes.W,
            J: Phaser.Input.Keyboard.KeyCodes.J
        })
		this.attackHitbox = scene.physics.add.sprite(this.x, this.y, "")
		this.attackHitbox.body.setSize(40, 110)
		this.attackHitbox.setVisible(false)
		this.attackHitbox.body.enable = false
		this.attackHitbox.body.setAllowGravity(false)
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    }

    update() {
        this.angle = this.flipX ? -45 : 45

        const isAnimAttack = this.anims.currentAnim?.key === 'attack' && this.anims.isPlaying
        if (!this.isAttacking)
        {
            if (this.controls.left.isDown || this.controls.A.isDown) {
                this.setFlipX(true)
                // this.play('run', true)
                this.setVelocityX(-300)
            }
            else if (this.controls.right.isDown || this.controls.D.isDown) {
                this.setFlipX(false)
                // this.play('run', true)
                this.setVelocityX(300)
            }
            else {
                this.play('idle', true)
            }
            if (!isAnimAttack)
                this.attackHitbox.body.enable = false;
        }
        if (this.controls.J.isDown && !this.isAttacking) {
            this.isAttacking = true;
            if (this.attackEnableTimer) {
                this.attackEnableTimer.remove(false)
                this.attackEnableTimer = undefined
            }
            this.attackEnableTimer = this.mainScene.time.delayedCall(250, () => {
                this.attackHitbox.body.enable = true;
            })
            if (this.flipX)
                this.attackHitbox.setPosition(this.x - 70, this.y)
            else
                this.attackHitbox.setPosition(this.x + 70, this.y)
            this.play('attack');
        }
    }
}
