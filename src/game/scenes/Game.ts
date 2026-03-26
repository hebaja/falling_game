import { Scene } from 'phaser';
import { Player } from '../objects/Player';
import { Enemy } from '../objects/Enemy';
import { Gold } from '../objects/Gold';

export class Game extends Scene
{
    player: Player
    golds: Gold[] = []

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
        Gold.createAnims(this)
        Enemy.createAnims(this)
        this.player = new Player(this, 1024 / 2, 1024 / 2, 'player_idle')

        // this.golds.push(new Gold(this, 512, 900, 'gold'))
        // this.golds.push(new Gold(this, 712, 900, 'gold'))
        // this.golds[0].body?.setSize(55, 35)

        // this.cameras.main.startFollow(this.player, true)
        // this.cameras.main.setBounds(0, 0, 3072, 1024)
    }

    update ()
    {
    }
}
