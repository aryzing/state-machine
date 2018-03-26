export function createMachine(config) {
  const machine = {
    // private API
    _state: config.initialState,
    _warnNonExistingTransition() {
      console.warn(`Failed to fire "${transition}". State ${this._state} has no transition named "${transition}".`)
    },

    // public API
    getState() {
      return this._state
    },
    fire(transition) {
      const nextState = config.states[this._state].transitions[transition]
      if (nextState) {
        this._state = nextState

        // notify subscribers
        console.log('Notified...')

        const worker = config.states[nextState].worker
        if (worker) {
          setTimeout(() => {
            worker(this.fire.bind(this))
          })
        }
      } else {
        this._warnNonExistingTransition()
      }
    },
    reset() {
      this._state = config.initialState;
    },
  }

  return machine
}
