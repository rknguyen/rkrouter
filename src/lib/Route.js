// @flow

import '../packages/polyfill'

class Route {
  __next: boolean = false
  __enter: boolean = false
  next() { this.__next = true }
  enter() { this.__enter = true }
  async Path() { return "" }
  async Handle() {}
  async PreEnter() {
    this.enter()
  }
  async InputSchema() {
    return {}
  }
}

export default Route