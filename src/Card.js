import { GameObjects } from 'phaser'
import { GameScene } from './GameScene'

// сделать промисификацию для всех методов анимации
export class Card extends GameObjects.Sprite {
  isOpened = false

  scene = new GameScene()

  position = { x: 0, y: 0 }
  value = null

  constructor({
    value = null,
    x = 0,
    y = 0,
  }) {    
    super(new GameScene(), x, y, 'card')

    this.value = value
    this.position = { x, y }

    this.setInteractive() // делает карту кликабельной
  }

  init(position) {
    this.position = position
    this.close()
    this.setPosition(-this.width, -this.height)
  }

  move({ x = 0, y = 0}) {
    return new Promise((res) => {
      this.scene.tweens.add({
        targets: this,
        ease: 'Linear',
        x,
        y,
        duration: 250,
        onComplete: res
      })
    })
  }

  flip() {
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      ease: 'Linear',
      duration: 150,
      onComplete: () => {
        this.show()
      }
    })
  }

  show() {
    const texture = this.isOpened
      ? 'card' + this.value
      : 'card'

    this.setTexture(texture)
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      ease: 'Linear',
      duration: 150,
    })
  }

  open() {
    if (this.isOpened) return
    this.isOpened = true
    this.flip()
  }

  close() {
    if (!this.isOpened) return
    this.isOpened = false
    this.flip()
  }
}