import { GameScene } from './GameScene'
import { Card } from './Card'
import { Menu } from './Menu'
import { Timer } from './Timer'
import gameSettings from './gameSettings'
import assetsLoader from './assetsLoader'
import Phaser from 'phaser'

const scene = new GameScene()

scene.preload = assetsLoader
scene.onAssetsLoad = () => {
	new Menu()

	scene.timer = new Timer(30)

	gameSettings.cards
		.map(value => ({ value, x: 0, y: 0 }))
		.forEach((cardConfig) => {
			scene.addCard(new Card(cardConfig))
			scene.addCard(new Card(cardConfig))
		})

	scene.start()
}


export const config = {
	type: Phaser.AUTO, // webgl or canvas
	width: 1280,
	height: 720,
	scene
}

new Phaser.Game(config)

