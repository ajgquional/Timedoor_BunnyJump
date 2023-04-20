import Phaser from 'phaser'

// according to the book, a global replayButton variable is needed but this can actually be deleted
//var replayButton;

export default class GameOverScene extends Phaser.Scene 
{
    constructor() 
    {
        super('game-over-scene');
    }

    preload() 
    {
        // loading the image assets
        this.load.image('background', 'images/bg_layer1.png');      // background image
        this.load.image('game-over-text', 'images/gameover.png');   // game over text image
        this.load.image('replay-button', 'images/replay.png');      // replay button image
    }

    create() 
    {
        // creating the scene
        this.add.image(240, 320, 'background');
        this.add.image(240, 280, 'game-over-text');

        // creating the button and making it clickable
        this.replayButton = this.add.image(240, 420,
            'replay-button').setInteractive();
        
        // switch to the bunny jump scene when the replay button is clicked
        this.replayButton.once('pointerup', () => {
            this.scene.start('bunny-jump-scene');
        }, this);
    }
}