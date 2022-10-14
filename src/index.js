import { GameScene } from './GameScene'
import Phaser from 'phaser'

export const config = {
	type: Phaser.AUTO, // webgl or canvas
	width: 1280,
	height: 720,
	scene: new GameScene()
}

const game = new Phaser.Game(config)
