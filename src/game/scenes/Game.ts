import { Scene } from 'phaser';
import { Player } from '../objects/Player';
import { Gold } from '../objects/Gold';
import { Cloud } from '../objects/Cloud';
import { flipMovement, getMovement, getRandomX } from '../utils/random';
import { GameOverOverlay } from '../scenes/GameOverOverlay'

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

    create ()
    {
        // this.add.image(1024 / 2, 1024 / 2, 'background')
		const map = this.make.tilemap({ key: 'level' })

		console.log(map)

		const cloudsLayer = map.getObjectLayer('background01')
		if (cloudsLayer) {
			const cloudsTileset = map.tilesets.find(ts => ts.name === 'Clouds')
			const firstGid = cloudsTileset?.firstgid ?? 1
			for (const obj of cloudsLayer.objects) {
				if (!('gid' in obj) || typeof obj.gid !== 'number') continue
				const tileIndex = obj.gid - firstGid // 0..7
				if (tileIndex < 0 || tileIndex > 7) continue
				this.add.image(obj.x ?? 0, obj.y ?? 0, `cloud_${tileIndex + 1}`)
					.setOrigin(0, 1)
					.setDepth(50)
			}
			// const CLOUDS_FIRST_GID = 56
			// for (const obj of cloudsLayer.objects) {
			// 		if (!('gid' in obj) || typeof obj.gid !== 'number') continue
			// 		const tileIndex = obj.gid - CLOUDS_FIRST_GID; // 0..7
			// 		const textureKey = `cloud_${tileIndex + 1}`

			// 		this.add.image(obj.x ?? 0, obj.y ?? 0, textureKey).setOrigin(0, 1).setDepth(50)
			// }
		}

        Player.createAnims(this)
        Gold.createAnims(this)

        this.player = new Player(this)

		this.physics.add.overlap(this.player.attackHitbox, this.gold, this.destroyGold, undefined, this)

		// this.scheduleNextCloud()
		// this.scheduleNextStreak()
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

	// private scheduleNextStreak() {
	// 	this.spawnTimer = this.time.delayedCall(this.getRandomDelay(), () => {
	// 		const lineStreak = this.physics.add.image(getRandomX(), 1104, "")
	// 			.setDisplaySize(1, 150)
	// 			.setTint(0xffffff)
	// 		lineStreak.setGravityY(-400 * getMovement())
	// 		this.lines.push(lineStreak)
	// 		this.scheduleNextStreak()
	// 	})
	// }

	// private scheduleNextCloud() {
	// 	this.spawnTimer = this.time.delayedCall(this.getRandomDelay(), () => {
	// 		this.clouds.push(new Cloud(this))
	// 		this.scheduleNextCloud()
	// 	})
	// }
	
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

    update ()
    {
		if (this.countdownText) {
			this.remainingMs = Math.max(0, this.countdownEndsAt - this.time.now)
			this.countdownText.setText(String(Math.ceil(this.remainingMs / 1000)))
			// TODO: handle remainingMs === 0 (time up)
		}

		// Cleanup clouds once they are fully off-screen (above the top edge).
		// for (let i = this.clouds.length - 1; i >= 0; i--) {
		// 	const cloud = this.clouds[i]
		// 	if (!cloud.active) {
		// 		this.clouds.splice(i, 1)
		// 		continue
		// 	}
		// 	const b = cloud.getBounds()
		// 	if (b.bottom < 0) {
		// 		cloud.destroy()
		// 		this.clouds.splice(i, 1)
		// 	}
		// }
		
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
		
		// for (let i = this.lines.length - 1; i >= 0; i--) {
		// 	const line = this.lines[i]
		// 	if (!line.active) {
		// 		this.lines.splice(i, 1)
		// 		continue
		// 	}
		// 	const l = line.getBounds()
		// 	if (l.bottom < 0) {
		// 		line.destroy()
		// 		this.lines.splice(i, 1)
		// 	}
		// }
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

		for (const gold of this.golds) {
			const y = gold.body?.gravity.y
			if (y !== undefined) {
				gold.setGravityY(-y)
				this.time.delayedCall(1000, () => {
					if (!gold.active) return
					gold.setGravityY(y) // restore original
				})
			}
		}

		// for (const cloud of this.clouds) {
		// 	const y = cloud.body?.gravity.y
		// 	if (y !== undefined) {
		// 		cloud.setGravityY(-y)
		// 		this.time.delayedCall(1000, () => {
		// 			if (!cloud.active) return
		// 			cloud.setGravityY(y) // restore original
		// 		})
		// 	}
		// }
		
		// for (const line of this.lines) {
		// 	const y = line.body?.gravity.y
		// 	if (y !== undefined) {
		// 		line.setGravityY(-y)
		// 		this.time.delayedCall(1000, () => {
		// 			if (!line.active) return
		// 			line.setGravityY(y) // restore original
		// 		})
		// 	}
		// }
		
		flipMovement()
		this.time.delayedCall(1000, () => {
			flipMovement()
		})

		const finish = () => {
			if (!_gold || !_gold.active) return
			_gold.disableBody(true, true)
			_gold.destroy()
			// Add 2 seconds per destroyed gold.
		}
		this.countdownEndsAt += 4_000

		_gold.once('animationcomplete-gold_explosion', finish)

		// Fallback: if the explosion animation is replaced, still clean up.
		// _gold.once('animationcomplete', finish)
    }
}
