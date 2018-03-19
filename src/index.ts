console.log('hello')

import Vector from './Vector'


function findNearest (population) {
  let relativo  = population.map((e) => Vector.sub(e.position, this.position))
  let distances = relativo.map((e) => e.mag())

  let distance  = Math.min(...relativo)
  let index     = distances.indexOf(distance)
  let entity    = population[index]

  return {
    distance,
    entity
  }
}


function see () {
  this.enviroment.Entities.forEach(element => {
    let near = this.findNearest(this.enviroment.Plants)
    this.position.moveTowards(near.entity)
  })
}
