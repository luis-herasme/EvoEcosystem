
import Vector from './Vector'
import World from './World'
import Plant from './Plant'

const world = new World()

for (let i = 0; i < 100; i++) {
  world.add(new Plant())
}
