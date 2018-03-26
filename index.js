export function createMachine(config) {
  const machine = {
    // private API
    _state: config.initialState,
    _warnNonExistingTransition() {
      console.warn(`Failed to fire "${transition}". State ${this._state} has no transition named "${transition}".`)
    },
    _listeners: [],
    _callListeners() {
      this._listeners.forEach(listener => listener());
    },

    // public API
    getState() {
      return this._state
    },
    fire(transition) {
      const nextState = config.states[this._state].transitions[transition]
      if (nextState) {
        this._state = nextState
        this._callListeners()
      } else {
        this._warnNonExistingTransition()
      }
    },
    reset() {
      this._state = config.initialState;
      this._callListeners()
    },
    subscribe(listener) {
      this._listeners.push(listener);
      return () => {
        this._listeners = this._listeners.filter(l => l !== listener)
      }
    },
  }
  
  return machine
}
