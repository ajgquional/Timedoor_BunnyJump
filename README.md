# Bunny Jump

<p align='center'>
  <img src='https://github.com/ajgquional/Timedoor_BunnyJump/blob/0d89644b137fd9e32ff8e221fe91deedbfa6b4be/BunnyJumpSampleoutput.png' alt='Sample Bunny Jump game' width='309.5' height='446.5'>
</p>

## Description of the game
This is the second Phaser game of Intermediate 2 of the Intermediate JavaScript class of Timedoor Coding Academy. In this game, players have to control a bunny character using left and right arrow keys in the keyboard to move left and right, respectively. Once the bunny touches a platform, it would automatically jump upwards and the player has to control the bunny to get to the next upper platform. The platforms have a single carrot above them that is needed to be collected by the bunny. Once the bunny collects the carrot, it would be added to the score displayed in the upper part of the game screen. The main objective of the player is to collect as many carrots as possible. If the bunny goes below the bottommost platform, it would be game over but the player has a chance to play the game again by clicking the replay button in the Game Over Scene.

The codes for this game  are mostly copied from Timedoor's Intermediate JavaScript course book, but modified due to personal preference and due to existence of errors in the original source code. The codes here (especially the scenes code) are highly annotated and documented for clarity.

## About the repository
This repository only contains the source codes as well as assets linked in the book (as a Google Drive link). Thus, this repository is mainly for reference. Should you wish to use these files, you may download them and copy them to the template folder but make sure first that a Phaser framework is installed in your local machine and necessary steps have been conducted (such as installation of node.js and Visual Studio Code). Afterwards, the public (which contains the assets) and src (which contains all the source codes) folders can be copied in the game folder. The "game" can be run by typing the command ```npm run start``` in the terminal within Visual Studio Code, then clicking on the local server link (for instance, localhost:8000) in the terminal. The game will then open in your default browser.

## Summarized game mechanics and link to sample game
- Controls: 
  - Left Arrow to move left
  - Right Arrow to move right
- Rules:
  - Collect as many carrots as possible and earn as many points as you can (1 carrot = 1 point). 
  - The game has no limits and the bunny has to jump and collect carrots for an infinite time.
  - The bunny would automatically jump when it touches a platform.
  - The bunny can re-merge on the other side of the screen if the bunny exits the left/right edge of the screen.
  - Once the bunny goes below the bottommost platform, the game is over.
- Link to the sample game: https://td-bunnyjump-adrian.netlify.app/
  
