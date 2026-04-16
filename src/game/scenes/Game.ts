import { Scene } from 'phaser';
import { Player } from '../objects/Player';
import { Gold } from '../objects/Gold';
import { getCloudMovement, speedMultiplier } from '../utils/random'

export class Game extends Scene
{
    player: Player
    golds: Gold[] = []
	// clouds: Cloud[] = []
	// lines:  Phaser.Physics.Arcade.Image[] = []
	gold: any
	private spawnTimer?: Phaser.Time.TimerEvent
	private countdownText?: Phaser.GameObjects.Text
	private countdownEndsAt = 0
	private remainingMs: number
	
	cloudsLayer0: any[] = []
	cloudsLayer1: any[] = []
	cloudsLayer2: any[] = []

    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        this.load.setPath('src/game/assets');
        // this.load.image('background', 'default_background.png');

		this.load.tilemapTiledJSON('level', 'tiny/tilemap.json')

		this.load.image('cloud_1', 'tiny/Terrain/Decorations/Clouds/Clouds_01.png')
		this.load.image('cloud_2', 'tiny/Terrain/Decorations/Clouds/Clouds_02.png')
		this.load.image('cloud_3', 'tiny/Terrain/Decorations/Clouds/Clouds_03.png')
		this.load.image('cloud_4', 'tiny/Terrain/Decorations/Clouds/Clouds_04.png')
		this.load.image('cloud_5', 'tiny/Terrain/Decorations/Clouds/Clouds_05.png')
		this.load.image('cloud_6', 'tiny/Terrain/Decorations/Clouds/Clouds_06.png')
		this.load.image('cloud_7', 'tiny/Terrain/Decorations/Clouds/Clouds_07.png')
		this.load.image('cloud_8', 'tiny/Terrain/Decorations/Clouds/Clouds_08.png')

        Player.preload(this)
        Gold.preload(this)
		// Cloud.preload(this)
    }

	populateCloudsLayer(backgroundLabel: string, map: Phaser.Tilemaps.Tilemap, cloudsLayer: any, depth: number) {
		const layer = map.getObjectLayer(backgroundLabel)
		if (layer) {
			const cloudsTileset = map.tilesets.find(ts => ts.name === 'Clouds')
			const firstGid = cloudsTileset?.firstgid ?? 1
			for (const obj of layer.objects) {
				if (!('gid' in obj) || typeof obj.gid !== 'number') continue
				const tileIndex = obj.gid - firstGid // 0..7
				if (tileIndex < 0 || tileIndex > 7) continue
				const cloud = this.add.image(obj.x ?? 0, obj.y ?? 0, `cloud_${tileIndex + 1}`)
					.setOrigin(0, 1)
					.setDepth(depth)
				const delay = Phaser.Math.Between(0, 10000)
				this.time.delayedCall(delay, () => {
					cloudsLayer.push(cloud)
				})
			}
		}
	}

    create ()
    {
		const map = this.make.tilemap({ key: 'level' })

		this.populateCloudsLayer('background01', map, this.cloudsLayer0, 10)
		this.populateCloudsLayer('background02', map, this.cloudsLayer1, 40)
		this.populateCloudsLayer('background03', map, this.cloudsLayer2, 90)
        Player.createAnims(this)
        Gold.createAnims(this)
        this.player = new Player(this)
		this.physics.add.overlap(this.player.attackHitbox, this.gold, this.destroyGold, undefined, this)
		this.scheduleNextGold()
		this.countdownText = this.add.text(16, 16, '10', {
			fontFamily: 'Arial',
			fontSize: '64px',
			color: '#000000',
		}).setDepth(1000).setScrollFactor(0)
		this.countdownEndsAt = this.time.now + 10_000
		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
			this.spawnTimer?.remove(false)
			this.spawnTimer = undefined
		})
    }
	
	private scheduleNextGold() {
		this.spawnTimer = this.time.delayedCall(this.getRandomDelay(), () => {
			const gold = new Gold(this)
			this.physics.add.overlap(this.player.attackHitbox, gold, this.destroyGold, undefined, this)
			this.golds.push(gold)
			this.scheduleNextGold()
		})
	}

	getRandomDelay() {
		return Phaser.Math.Between(500, 2000)
	}

	manageCloudsLayer(cloudsLayer: any, cloudSpeed: number, delta: number) {
		const cam = this.cameras.main
		const top = cam.scrollY

		for (const cloud of cloudsLayer) {
			cloud.y -= (cloudSpeed * getCloudMovement())* (delta / 1000)
			if (cloud.getBounds().bottom < top) {
				cloud.y = 1521
				cloud.x = Phaser.Math.Between(0, cam.width)
			}
		}
	}

    update (_time: number, delta: number)
    {
		this.manageCloudsLayer(this.cloudsLayer0, 100, delta)
		this.manageCloudsLayer(this.cloudsLayer1, 500, delta)
		this.manageCloudsLayer(this.cloudsLayer2, 1500, delta)

		if (this.countdownText) {
			this.remainingMs = Math.max(0, this.countdownEndsAt - this.time.now)
			this.countdownText.setText(String(Math.ceil(this.remainingMs / 1000)))
		}
		
		for (let i = this.golds.length - 1; i >= 0; i--) {
			const gold = this.golds[i]
			if (!gold.active) {
				this.golds.splice(i, 1)
				continue
			}
			const b = gold.getBounds()
			if (b.bottom < 0) {
				gold.destroy()
				this.golds.splice(i, 1)
			}
		}
		
		if (this.remainingMs == 0) {
			this.scene.pause()
			this.scene.launch("GameOverOverlay")
		}
    }

	destroyGold(_player: any, _gold: any)
    {
		if (!_gold || !_gold.active) return
		if (_gold.getData?.('destroying')) return
		_gold.setData?.('destroying', true)

		// Keep the body enabled until the explosion finishes, but freeze movement.
		_gold.play('gold_explosion', true)
		
		if (_gold.body) {
			_gold.body.setVelocity(0, 0)
			_gold.body.setAcceleration(0, 0)
			_gold.body.setAllowGravity(false)
		}
		
		this.tweens.killTweensOf(this.player)
		this.player.isRising = true
		this.tweens.add({
			targets: this.player,
			y: 350,
			duration: 600,
			yoyo: true,
			ease: 'Sine.easeInOut',
			onComplete: () => {
				this.player.isRising = false
			}
		})

		this.tweens.killTweensOf(speedMultiplier)
		speedMultiplier.value = 1
		this.tweens.add({
			targets: speedMultiplier,
			value: -1,
			duration: 600,
			yoyo: true,
			ease: 'Sine.easeInOut',
			onComplete: () => {
				speedMultiplier.value = 1
			}
		})

		for (const gold of this.golds) {
			if (!gold.active || !gold.body) continue
			const baseGravity = gold.getData?.('baseGravityY')
			if (typeof baseGravity !== 'number') continue

			this.tweens.killTweensOf(gold.body.gravity)
			gold.body.gravity.y = baseGravity

			this.tweens.add({
				targets: gold.body.gravity,
				y: -baseGravity,
				duration: 600,
				yoyo: true,
				ease: 'Sine.easeInOut',
				onComplete: () => {
					if (gold.body) {
						gold.body.gravity.y = baseGravity
					}
				}
			})
		}

		// for (const gold of this.golds) {
		// 	const y = gold.body?.gravity.y
		// 	if (y !== undefined) {
		// 		gold.setGravityY(-y)
		// 		this.time.delayedCall(1000, () => {
		// 			if (!gold.active) return
		// 			gold.setGravityY(y) // restore original
		// 		})
		// 	}
		// }

		// flipMovement()
		// this.time.delayedCall(1000, () => {
		// 	flipMovement()
		// })

		const finish = () => {
			if (!_gold || !_gold.active) return
			_gold.disableBody(true, true)
			_gold.destroy()
			// Add 2 seconds per destroyed gold.
		}
		this.countdownEndsAt += 4_000


		// console.log(this.player.isRising)

		// this.tweens.add({
		// 	targets: this.player,
		// 	y: 350,
		// 	duration: 500,
		// 	yoyo: true,
		// 	ease: 'Sine.easeInOut',
		// 	onComplete: () => {
		// 		this.player.isRising = false

		// 	} 
		// })
		//
		console.log(speedMultiplier)

		_gold.once('animationcomplete-gold_explosion', finish)
    }
}
