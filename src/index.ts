
import Vector from './Vector'
import World from './World'
import Plant from './Plant'
import Entity from './Entity'

const world = new World()

for (let i = 0; i < 100; i++) {
  world.add(new Plant())
  world.add(new Entity({
    speedLimit: Math.random(),
    fertility: Math.random(),
    fieldVision: 100,
    lifetime: Math.random(),
    sizeLimit: Math.random(),
    carnivore: false,
    vegetarian:  true,
    position: Vector.randomPositive(500, 500)
  }))
}

setInterval(() => world.update())
