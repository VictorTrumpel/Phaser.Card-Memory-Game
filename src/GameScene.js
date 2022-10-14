import { Scene } from 'phaser'
import { Card } from './Card'
import background from './assets/background.png'

import card from './assets/card.png'
import card1 from './assets/card1.png'
import card2 from './assets/card2.png'
import card3 from './assets/card3.png'
import card4 from './assets/card4.png'
import card5 from './assets/card5.png'

import theme from './assets/sounds/theme.mp3'
import complete from './assets/sounds/complete.mp3'
import cardSound from './assets/sounds/card.mp3'
import success from './assets/sounds/success.mp3'
import timeout from './assets/sounds/timeout.mp3'

import gameSettings from './gameSettings'

export class GameScene extends Scene {

  openedCards = []

  overlapsValues = []

  cards = []

  sounds = {}

  timeOutText = null

  timeout = gameSettings.timeout

  constructor() {
    super('Game')
  }

  preload() {
    this.load.image('bg', background)
	  this.load.image('card', card)
	  this.load.image('card1', card1)
	  this.load.image('card2', card2)
	  this.load.image('card3', card3)
	  this.load.image('card4', card4)
	  this.load.image('card5', card5)

    this.load.audio('theme', theme)
    this.load.audio('complete', complete)
    this.load.audio('cardSound', cardSound)
    this.load.audio('success', success)
    this.load.audio('timeout', timeout)
  }

  onTimerTick() {
    this.timeout -= 1
    this.timeOutText.setText(`Time: ${this.timeout}`)
  }

  createTimer() {
    this.time.addEvent({
      delay: 1000,
      callback: this.onTimerTick,
      callbackScope: this,
      loop: true
    })
  }

  createSounds() {
    this.sounds = {
      theme: this.sound.add('theme'),
      complete: this.sound.add('complete'),
      card: this.sound.add('cardSound'),
      success: this.sound.add('success'),
      timeout: this.sound.add('timeout')
    }

    // this.sounds.theme.play({ volume: 0.01 })    
  }

  create() {
    this.createBackground()
    this.createSounds()
    this.createText()
    this.createCards()
    this.createTimer()
    this.start()
  }

  start() {
    this.initCards()
    this.showCards()
  }

  createCards() {
    gameSettings.cards.forEach((value) => {
      this.cards.push(new Card(this, value))
      this.cards.push(new Card(this, value))  
    })

    // паттерн обсервебле
    // вешаем один обработчик события на всю сцену вместо того, что бы 
    // вешать обработчик на каждую карту
    this.input.on('gameobjectdown', this.onCardClicked, this)
  }

  initCards() {
    const posistions = this.getCardsPositions()
    this.cards.forEach(card => {
      card.init(posistions.pop())
    })
  }

  showCards() {
    this.cards.forEach((card, idx) => {
      card.depth = idx
      card.move({
        x: card.position.x,
        y: card.position.y
      })
    })
  }

  createText() {
    this.timeOutText = this.add.text(10, 330, `Time: ${this.timeout}`, {
      font: '36px Arial',
      fill: '#ffffff'
    })
  }

  createBackground() {
    this.add.sprite(0, 0, 'bg').setOrigin(0, 0)
  } 

  onCardClicked(pointer, card) {
    if (card.isOpened) return

    // this.sounds.card.play({ volume: 0.01 })

    card.open()

    this.openedCards.push(card)

    if (this.openedCards.length < 2) return

    const firstCard = this.openedCards[0]
    const secondCard = this.openedCards[1]

    if (firstCard.value === secondCard.value) {
      this.overlapsValues.push(firstCard.value)
      this.openedCards = []

      // this.sounds.success.play({ volume: 0.01 })
      // Если все пары открыты - перезапуск игры
      if (this.overlapsValues.length === gameSettings.cards.length) {
        this.start()
        this.sounds.complete.play({ volume: 0.01 })
      }

      return
    }

    this.openedCards.shift().close()
  }

  getCardsPositions() {
    const config = { rows: 2, cols: 5 }

    const screenWidth = this.sys.game.config.width
    const screenHeight = this.sys.game.config.height

    const padding = 4

    const cardTexture = this.textures.get('card').getSourceImage()

    const cardWidth = cardTexture.width + padding
    const cardHeight = cardTexture.height + padding

    const offsetX = (screenWidth - cardWidth * config.cols) / 2 + cardWidth / 2
    const offsetY = (screenHeight - cardHeight * config.rows) / 2 + cardHeight / 2

    const rows = Array.from({ length: config.rows }, (_, i) => i)
    const cols = Array.from({ length: config.cols }, (_, i) => i)

    const positions = []

    rows.forEach(row => {
      cols.forEach(col => {
        const x = offsetX + cardWidth * col
        const y = offsetY + cardHeight * row

        positions.push({ x, y })
      })
    })

    return Phaser.Utils.Array.Shuffle(positions)
  }
}