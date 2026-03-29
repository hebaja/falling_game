import { Scene } from 'phaser';
import { Player } from '../objects/Player';
import { Gold } from '../objects/Gold';
import { Cloud } from '../objects/Cloud';
import { getRandomX } from '../utils/random';
import { MOVEMENT } from '../objects/constants';

export class Game extends Scene
{
    player: Player
    // golds: Gold[] = []
	clouds: Cloud[] = []
	gold: any
	private spawnTimer?: Phaser.Time.TimerEvent

    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        this.load.setPath('src/game/assets');
        this.load.image('background', 'default_background.png');

        Player.preload(this)
        Gold.preload(this)
		Cloud.preload(this)
    }

    create ()
    {
        // this.physics.world.gravity.y = 75
        // this.physics.world.setBounds(0, 0, 3072, 1024)
        // for (let x = 0; x < 3; x++) {
            // this.add.image(512 * (x + (x + 1)) , 1024 / 2, 'background')
        // }
        this.add.image(1024 / 2, 1024 / 2, 'background')

        Player.createAnims(this)
        // Gold.createAnims(this)

        this.player = new Player(this, 1024 / 2, 1024 / 2, 'player_idle')
		// const cloud = new Cloud(this);

		// this.gold = new Gold(this, 412, 1044, 'gold')

		this.physics.add.overlap(this.player.attackHitbox, this.gold, this.destroyGold, undefined, this)

        // this.golds.push(new Gold(this, 512, 900, 'gold'))
        // this.golds.push(new Gold(this, 712, 900, 'gold'))
        // this.golds[0].body?.setSize(55, 35)

        // this.cameras.main.startFollow(this.player, true)
        // this.cameras.main.setBounds(0, 0, 3072, 1024)
		this.scheduleNextCloud()
		this.scheduleNextStreak()
		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
			this.spawnTimer?.remove(false)
			this.spawnTimer = undefined
		})
    }

	private scheduleNextStreak() {
		this.spawnTimer = this.time.delayedCall(this.getRandomDelay(), () => {
			const lineStreak = this.physics.add.image(getRandomX(), 1104, "")
				.setDisplaySize(1, 150)
				.setTint(0xffffff)
			lineStreak.setGravityY(-400 * MOVEMENT)
			this.scheduleNextStreak()
		})
	}

	private scheduleNextCloud() {
		this.spawnTimer = this.time.delayedCall(this.getRandomDelay(), () => {
			this.clouds.push(new Cloud(this))
			this.scheduleNextCloud()
		})
	}

	getRandomDelay() {
		return Phaser.Math.Between(500, 2000)
	}

    update ()
    {
		// Cleanup clouds once they are fully off-screen (above the top edge).
		for (let i = this.clouds.length - 1; i >= 0; i--) {
			const cloud = this.clouds[i]
			if (!cloud.active) {
				this.clouds.splice(i, 1)
				continue
			}
			const b = cloud.getBounds()
			if (b.bottom < 0) {
				cloud.destroy()
				this.clouds.splice(i, 1)
			}
		}

		if (this.gold && this.gold.y < -100) {
			console.log('destroying gold')
			this.gold.disableBody(true, true)
			this.gold.destroy()
			this.gold = null
		}
    }

	destroyGold(_player: any, _gold: any)
    {
		console.log('destroying gold')
		_gold.disableBody(true, true)
		_gold.destroy()
		_gold = null
    }
}
