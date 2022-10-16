// Таймер
import { Time, Events} from "phaser"
import { GameScene } from "./GameScene";

export class Timer extends Time.Clock {

  cacheDOM = {}
  elementDOM = null

  time = 0
  limit = 0
  events = new Events.EventEmitter()

  constructor(limit) {
    super(new GameScene())

    this.limit = limit

    this.initEvents()
    this.render()
    document.body.append(this.elementDOM)
  }

  onTimerTick() {
    const timerIndicator = this.cacheDOM['timer-indicator']

    this.time += 1
    timerIndicator.innerHTML = this.time

    if (this.time === this.limit) {
      this.events.emit('timeout')
      this.shutdown()
    }
  }

  reset() {
    this.time = 0
    const timerIndicator = this.cacheDOM['timer-indicator']
    timerIndicator.innerHTML = 0
    this.initEvents()
  }

  initEvents() {
    this.addEvent({
      delay: 1000,
      callback: this.onTimerTick,
      loop: true,
      callbackScope: this
    })
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

  template() {
    return /*html*/`
      <div class='timer-window'>
        TIME: 
        <span 
          class='timer-indicator' 
          data-active='timer-indicator'
        >0</span>
      </div>
    `
  }
}