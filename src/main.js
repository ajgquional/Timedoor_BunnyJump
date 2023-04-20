import Phaser from 'phaser'

// importing the scenes from the "scenes" folder
import BunnyJumpScene from './scenes/BunnyJumpScene'
import GameOverScene from './scenes/GameOverScene';

const config = {
	type: Phaser.AUTO,
	width: 480,
	height: 640,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},

	// IMPORTANT: It should be "GameOverScene", not "GameOver" as indicated in the book
	scene: [BunnyJumpScene,  GameOverScene]
}

export default new Phaser.Game(config)
