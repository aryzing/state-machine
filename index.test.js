import { createMachine } from '.'

const config = {
  initialState: 'idle',
  states: {
    idle: {
      transitions: {
        start: 'working',
      },
      worker: function idleWorker(fire) {
        console.log('Worker is idle')
      }
    },
    working: {
      transitions: {
        stop: 'idle',
      },
      worker: function workingWorker(fire) {
        for (let i = 0; i < 10; i++) {
          console.log('working... ', i)
        }
        fire('stop')
      }
    }
  }
}

const machine = createMachine(config)

describe('Creating a state machine', () => {
  test('The library exports a `createMachine` function', () => {
    expect(typeof createMachine).toBe('function')
  })

  test('Function `createMachine` returns a well formatted machine object', () => {
    const machine = createMachine(config)

    expect(typeof machine.getState).toBe('function')
    expect(typeof machine.fire).toBe('function')
    expect(typeof machine.reset).toBe('function')
  })

  describe('Public API', () => {
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
        expect(machine.getState()).toBe('working')
      })
    })

    describe('reset()', () => {
      test('Resets the machine after calling `machine.reset()`', () => {
        const machine = createMachine(config)
        machine.fire('start')
        machine.reset()
        expect(machine.getState()).toBe('idle')
      })
    })
  })

  describe('Private API', () => {
    describe('fire()', () => {
      test('Firing unknown transitions logs warning', () => {
          const machine = createMachine(config)
          const mockWarnNonExistingTransition = jest.fn()
          machine._warnNonExistingTransition = mockWarnNonExistingTransition
          machine.fire('does not exist')
          expect(mockWarnNonExistingTransition.mock.calls.length).toBe(1)
      })
    })
    xdescribe('reset()', () => {
      test('Calls worker if present after resetting', () => {
      })
    })
  })
})
