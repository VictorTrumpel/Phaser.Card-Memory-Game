import { GameScene } from "./GameScene"

export class Menu {
  cacheDOM = {}
  elementDOM = null

  scene = new GameScene()

  onRestart = () => {
    this.elementDOM.remove()
    this.scene.restart()
  }

  constructor() {
    this.render()
    this.initEvents()
  }

  showModal(result) {
    const modalTitle = this.cacheDOM['modal-title']
    if (result === 'victory') {
      modalTitle.innerHTML = 'Вы победили!'
    }
    if (result === 'loose') {
      modalTitle.innerHTML = 'Пройгрыш!'
    }
    document.body.append(this.elementDOM)
  } 

  render() {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = this.template()
    this.elementDOM = wrapper.firstElementChild
    
    const activeElements = this.elementDOM.querySelectorAll('[data-active]')

    for (const element of activeElements) {
      const key = element.dataset.active
      this.cacheDOM[key] = element
    }
  }

  initEvents() {
    this.scene.events.on('victory', this.showModal.bind(this, 'victory'), this)
    this.scene.events.on('loose', this.showModal.bind(this, 'loose'), this)
    
    this.cacheDOM.button.addEventListener('click', this.onRestart)
  }

  template() {
    return /*html*/`
      <div class='dialog-menu'>
        <h5 data-active='modal-title'>Вы победили</h5>
        <button data-active='button'>
          Повторить
        </button>
      </div>
    `
  }
}