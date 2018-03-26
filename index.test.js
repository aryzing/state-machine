import { createMachine } from '.'

describe('Creating a state machine', () => {
  const config = {
    initialState: 'idle',
    states: {
      idle: {
        transitions: {
          start: 'doingSomething',
        },
      },
      doingSomething: {
        transitions: {
          stop: 'idle',
        },
      }
    }
  }
  test('The library exports a `createMachine` function', () => {
    expect(typeof createMachine).toBe('function')
  })

  test('Function `createMachine` returns a well formatted machine object', () => {
    const machine = createMachine(config)

    expect(typeof machine.getState).toBe('function')
    expect(typeof machine.fire).toBe('function')
    expect(typeof machine.reset).toBe('function')
  })
})

describe('Public API', () => {
  const config = {
    initialState: 'idle',
    states: {
      idle: {
        transitions: {
          start: 'anotherState',
        },
      },
      anotherState: {
        transitions: {
          stop: 'idle',
        },
      }
    }
  }
  describe('getState()', () => {
    test('Machine correctly returns current state', () => {
      const machine = createMachine(config)
      expect(machine.getState()).toBe('idle')
    })
  })

  describe('fire()', () => {
    test('Next state reached after firing transition', () => {
      const machine = createMachine(config)
      machine.fire('start')
      expect(machine.getState()).toBe('anotherState')
    })
  })

  describe('reset()', () => {
    test('Resets the machine after calling `machine.reset()`', () => {
      const machine = createMachine(config)
      machine.fire('start')
      expect(machine.getState()).toBe('anotherState')
      machine.reset()
      expect(machine.getState()).toBe('idle')
    })
  })
})

describe('Private API', () => {
  describe('fire()', () => {
    test('Firing unknown transitions logs warning', () => {
      const config = {
        initialState: 'idle',
        states: {
          idle: {
            transitions: {
              start: 'anotherState',
            },
          },
          anotherState: {
            transitions: {
              stop: 'idle',
            },
          }
        }
      }
      const machine = createMachine(config)
      const mockWarnNonExistingTransition = jest.fn()
      machine._warnNonExistingTransition = mockWarnNonExistingTransition
      machine.fire('does not exist')
      expect(mockWarnNonExistingTransition.mock.calls.length).toBe(1)
    })

    test('Will call worker after firing transition', (done) => {
      const config = {
        initialState: 'idle',
        states: {
          idle: {
            transitions: {
              start: 'doingSomething',
            },
          },
          doingSomething: {
            transitions: {
              stop: 'idle',
            },
            worker() {
              done()
            }
          }
        }
      }

      const machine = createMachine(config)
      machine.fire('start')
    })
  })
  xdescribe('reset()', () => {
    test('Calls worker if present after resetting', () => {
    })
  })
})
