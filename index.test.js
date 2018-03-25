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
})
