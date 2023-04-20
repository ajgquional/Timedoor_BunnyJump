import Phaser from 'phaser'

export default class Carrot extends Phaser.Physics.Arcade.Sprite 
{
    constructor(scene, x, y, texture) 
    {
        super(scene, x, y, texture);
        this.setScale(0.5); // every time a carrot is created, its size would be reduced to 50% of the original image size
    }
}