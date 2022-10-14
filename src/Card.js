import { GameObjects } from 'phaser'

export class Card extends GameObjects.Sprite {
  isOpened = false
  value = null
  scene = null

  constructor(scene, value) {
    super(scene, 0, 0, 'card')
    this.scene = scene
    this.value = value

    this.scene.add.existing(this)

    this.setInteractive()
  }

  init(position) {
    this.position = position
    this.close()
    this.setPosition(-this.width, -this.height)
  }

  move(params) {
    this.scene.tweens.add({
      targets: this,
      ease: 'Linear',
      x: params.x,
      y: params.y,
      duration: 250
    })
    // this.setPosition(params.x, params.y)
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