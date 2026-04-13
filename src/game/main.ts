import { Game as MainGame } from './scenes/Game';
import { AUTO, Game, Scale,Types } from 'phaser';
import { GameOverOverlay } from "./scenes/GameOverOverlay";

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 1024,
    parent: 'game-container',
    backgroundColor: '#a7f2f2',
    pixelArt: true,
    physics: {
        default: 'arcade',
        // arcade: {
        //     debug: true
        // }
    },
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },
    scene: [
        MainGame,
		GameOverOverlay
    ]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}

export default StartGame;
