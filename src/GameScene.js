import { Scene } from 'phaser'

import gameSettings from './gameSettings'

// к сцене применить паттерн Singleton
export class GameScene extends Scene {

  openedCards = []

  overlapsValues = []

  cards = []

  finished = false

  onAssetsLoad = () => null

  constructor() {
    if (GameScene.exists) {
      return GameScene.instance
    }
    super('Game')

    GameScene.instance = this
    GameScene.exists = true
  }

  create() {
    this.add.sprite(0, 0, 'bg').setOrigin(0, 0)
    this.onAssetsLoad()
    
    this.initEvents()
  }

  async start() {
    await this.showCards()
    this.timer.start()
  }

  addCard(card) {
    this.cards.push(card)
  }

  async restart() {
    await this.fadeCards()
    this.finished = false
    this.timer.reset()
    this.cards.forEach(card => card.setPosition(-100, -100))
    this.openedCards = []
    this.overlapsValues = []
    this.start()
  }

  async showCards() {
    const positions = this.getCardsPositions()

    Phaser.Utils.Array.Shuffle(this.cards)

    let idx = 0
    for (const card of this.cards) {
      this.add.existing(card) // вставляем карту на сцену
      card.depth = idx // для того, что бы последующие карты отображались поверх других 
      const position = positions[idx] // получаем позицию карты
      await card.move(position)
      idx += 1
    }
  }

  async fadeCards() {
    for (const card of this.cards) {
      card.close()
      await card.move({ x: 1000, y: 1000 })
    }
  }

  finishGame() {
    this.finished = true
    this.timer.shutdown()

    if (this.overlapsValues.length === gameSettings.cards.length) {
      this.events.emit('victory')
      return
    }
    this.events.emit('loose')
  }

  initEvents() {
    this.input.on('gameobjectdown', this.onCardClicked, this)
    this.timer.events.on('timeout', this.finishGame, this)
  }

  createBackground() {
    this.add.sprite(0, 0, 'bg').setOrigin(0, 0)
  } 

  onCardClicked(_, card) {
    if (this.finished) return
    if (card.isOpened) return

    card.open()

    this.openedCards.push(card)

    if (this.openedCards.length < 2) return

    const firstCard = this.openedCards[0]
    const secondCard = this.openedCards[1]

    if (firstCard.value !== secondCard.value) {
      this.openedCards.shift().close()
      return
    }

    this.overlapsValues.push(firstCard.value)
    this.openedCards = []
    
    if (this.overlapsValues.length === gameSettings.cards.length) {
      this.finishGame()
    }

    return
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

    return positions
  }
}