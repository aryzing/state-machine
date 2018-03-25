export function createMachine(config) {
  const machine = {
    currentState: config.initialState,
    fire(transition) {
      const nextState = config.states[this.currentState].transitions[transition]
      if (nextState) {
        this.currentState = nextState

        // notify subscribers
        console.log('Notified...')

        const worker = config.states[nextState].worker
        if (worker) {
          setTimeout(() => {
            worker(fire.bind(this))
          })
        }
      } else {
        console.warn(`Failed to fire ${transition}. State ${this.currentState} has no transition named ${transition}.`)
      }
    },
    reset() {
      this.currentState = config.initialState;
    },
  }

  return machine
}
