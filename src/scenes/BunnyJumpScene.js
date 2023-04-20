import Phaser from 'phaser'

// importing the Carrot class inside the "game" folder
import Carrot from '../game/Carrot'

// according to the book, global variables are needed so they're here, but these can actually be deleted
/*
var platforms;
var player;
var carrots;
var carrotsCollected;
*/

export default class BunnyJumpScene extends Phaser.Scene
{
	constructor()
	{
		super('bunny-jump-scene')
	}

	preload()
    {
        // loading the image assets
        this.load.image('background', 'images/bg_layer1.png');      // background image
        this.load.image('platform', 'images/ground_grass.png');     // platform image
        this.load.image('carrot', 'images/carrot.png');             // carrot image
        this.load.image('bunny_jump', 'images/bunny1_jump.png');    // bunny jump animation
        this.load.image('bunny_stand', 'images/bunny1_stand.png');  // bunny stand animation

        // loading the sound asset to be used when the bunny jumps
        this.load.audio('jumpSound', 'sfx/phaseJump1.ogg');
    }

    create()
    {
		// =============== OBJECT CREATION ===============

		// creating the background
		// setScrollFactor method is used so that the background will follow the player bunny as it moves upw
		this.add.image(240, 320, "background").setScrollFactor(1, 0);

		// initializing a group of platforms that the bunny has to jump upon
		this.platforms = this.physics.add.staticGroup();

		// creating 5 initial platforms in random x positions
		for (let i = 0; i < 5; i++) {
			const x = Phaser.Math.Between(80, 400); // setting a random x-coordinate between 80-400 for the platform
			const y = 150 * i; // y-coordinate of the platforms; they will be created in a fixed distance of 150 px above each other

			// creating a single platform
			const platformChild = this.platforms.create(x, y, "platform");
			platformChild.setScale(0.5); // shrinking the platform to 50% of the original size of the image
			platformChild.refreshBody(); // refreshing the platform
			const body = platformChild.body;
			body.updateFromGameObject();
		}

		// creating the player bunny
		this.player = this.physics.add
			.sprite(240, 320, "bunny_stand")
			.setScale(0.5);

		// creating the keyboard object for control
		this.cursors = this.input.keyboard.createCursorKeys();

		// creating the group of carrots
		this.carrots = this.physics.add.group({
			classType: Carrot,
		});

		// =============== CAMERA ===============

		// to enable the camera to follow the player wherever the player goes
		this.cameras.main.startFollow(this.player);

		// setting the dead zone with the layout width multiplied by 1.5
        // the dead zone is the area that the player can't access
		this.cameras.main.setDeadzone(this.scale.width * 1.5);

		// =============== COLLISIONS AND OVERLAPS ===============

		// enabling collision between the player and the platforms
		this.physics.add.collider(this.player, this.platforms);

		// turning off the collison between the platforms and the top, left, and right sides of the player
		// only the feet of the bunny should collide with the platform
		this.player.body.checkCollision.up = false;
		this.player.body.checkCollision.left = false;
		this.player.body.checkCollision.right = false;

		// enabling collision between the platforms and the carrots
		// carrots, when created, would sit on top of the platforms
		this.physics.add.collider(this.platforms, this.carrots);

		// enabling overlap between the player and the carrots
		this.physics.add.overlap(
			this.player,
			this.carrots,
			this.handleCollectCarrot,
			undefined,
			this
		);

		// =============== SCORE TEXT ===============

		// initializing collected carrots to 0
		this.carrotsCollected = 0;

		// creating a style for the score text
		// color can be changed by varying the hex code
		const style = { color: "#D69539", fontSize: 40, fontStyle: "bold" };

		// text style according to the book:
		//      const style = {color: '#000', fontSize:24}

        // creating the next using the style defined above
		this.carrotsCollectedText = this.add
			.text(240, 10, "Carrots: 0", style)
			.setScrollFactor(0)
			.setOrigin(0.5, 0);
	}

    update()
    {
        // local variable to hold the status of the player to check if the player touches down
        const touchingDown = this.player.body.touching.down;

        // checking if the player touches down
        if(touchingDown)
        {
            // if the player touches the platform, the player will jump with a velocity of 300 upward
            // negative sign is due to movement upward
            this.player.setVelocityY(-300);
            // plays the jump "animation" as the player moves up
            // only changes the image so it appears that the player has a jump "animation"
            this.player.setTexture('bunny_jump');

            // jump sound effect as the player jumps
            this.sound.play('jumpSound');
        }

        // local variable to hold the player's upward velocity
        const vy = this.player.body.velocity.y
        
        // checks if the player stops moving upward and if the player "animation" is not stand
        if (vy > 0 && this.player.texture.key !== 'bunny_stand')
        {
			// changes the player "animation" to stand
			// only changes the image so it appears that the player has a stand "animation"
			this.player.setTexture("bunny_stand");
		}

        // controlling the character
        // if left arrow key is pressed and the bunny moves upward, then move the bunny to the left
        if (this.cursors.left.isDown && !touchingDown) {
			this.player.setVelocityX(-200);
		}

		// if right arrow key is pressed and the bunny moves upward, then move the bunny to the right
        else if (this.cursors.right.isDown && !touchingDown)
        {
			this.player.setVelocityX(200);
        }
        
        // if neither left nor right arrow key is pressed, then the player will not have an x-velocity
        else
        {
			this.player.setVelocityX(0);
		}

        // continuously creating the platform as the bunny moves upward
        this.platforms.children.iterate(child => {
            // platformChild refers to each children of the platforms group/parent
            const platformChild = child;

            // accessing the vertical scroll of the camera
            const scrollY = this.cameras.main.scrollY;
        
            // checks if the platform is below the camera + 700 px
            if (platformChild.y >= scrollY + 700)
            {
                // if platform is below the camera + 70px, move that platform 50-100 px above the camera
                platformChild.y = scrollY - Phaser.Math.Between(50, 100);
                platformChild.body.updateFromGameObject();

                // once the platform respwans, spawn a carrot above it
                this.addCarrotAbove(platformChild);
            }
        });

        // IMPORTANT: ADD this. BEFORE horizontalWrap method call
        // this method call is for the player to re-emerge on the left side of the screen if it exits the right side of the screen
        // works in either way: exit on the right the enter on the left; exit on the left then enter on the right
        this.horizontalWrap(this.player);

        // holds the bottom platform returned by the findBottomMostPlatform method call
        const bottomPlatform = this.findBottomMostPlatform()
        
        // checks if the player is below the bottommost platform
        if (this.player.y > bottomPlatform.y + 200)
        {
            // if the player is below the bottommost platform + 200 px, play the game over scene
            this.scene.start('game-over-scene');
        }
    }

    // this method is to make the player (or any sprite) to re-emerge on the opposite side of the screen if the player exits the screen
    // taking in a sprite as a parameter
    horizontalWrap(sprite) 
    {
        // taking half of the sprite width as threshold
        const halfWidth = sprite.displayWidth * 0.5;
        // accessing the game width value
        const gameWidth = this.scale.width;
        
        // checks if the sprite exits the left end of the screen
        if (sprite.x < -halfWidth) {
			// re-assigns an x-coordinate for the sprite that is beyond the right edge of the screen
			sprite.x = gameWidth + halfWidth;
		}

		// checks if the sprite exits the right end of the screen
        else if (sprite.x > gameWidth + halfWidth) {
			// re-assigns an x-coordinate for the sprite that is beyond the left edge of the screen
			sprite.x = -halfWidth;
		}
    }

    // this method is to spawn a carrot above the platform
    // takes in a sprite as a parameter
    addCarrotAbove(sprite) 
    {
        // calculates the y-coordinate of the carrot
        // y-coordinate of the carrot depends on the position of the platform
        const y = sprite.y - sprite.displayHeight;
        // accesses the carrot sprite
        const carrot = this.carrots.get(sprite.x, y, 'carrot');
        
        carrot.setActive(true); // activates the carrot
        carrot.setVisible(true); // displays the carrot
        
        this.add.existing(carrot);
        carrot.body.setSize(carrot.width, carrot.height);
        
        this.physics.world.enable(carrot);
        return carrot;
    }

    // this method handles the collection of the carrot
    handleCollectCarrot(player, carrot) 
    {
        // destroys the carrot from the game
        this.carrots.killAndHide(carrot);
        this.physics.world.disableBody(carrot.body);

        // increments the carrots collected
        this.carrotsCollected++;

        // updates the score text
        const value = `Carrots: ${this.carrotsCollected}`
        this.carrotsCollectedText.text = value;
    }

    // this method is to find the bottommost platform
    findBottomMostPlatform() 
    {
        // getting the children from global variable platforms
        const platforms = this.platforms.getChildren();
        // getting the first item from the array of local platforms
        let bottomPlatform = platforms[0];

        // iterating through all of the platforms in the array
        for (let i = 1; i < platforms.length; i++)
        {
            const platform = platforms[i];
            
            // compares two platforms and determines which one is lower
            if (platform.y < bottomPlatform.y){
                // if the first item of the array is still the bottommost platform, then break one iteration of the loop
                continue;
            }

            // among all the children in the platforms group, one will be the assigned as the bottommost platform
            // continuously checks for the bottom platform then assign that platform to the bottomPlatform variable
            bottomPlatform = platform;

        }

        // returns the bottommost platform determined above
        return bottomPlatform;
    }
}
