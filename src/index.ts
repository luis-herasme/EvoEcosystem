console.log('hello')

import Vector from './Vector'


function findNearest (population) {
  let relativo  = population.map((e) => Vector.sub(e.position, this.position))
  let distances = relativo.map((e) => e.mag())

  let distance  = Math.min(...relativo)
  let entity    = population[distances.indexOf(distance)]

  return {
    distance,
    entity
  }
}


function see () {
  this.enviroment.Entities.forEach(element => {
    let near = this.findNearest(this.enviroment.Plants)

    let nearPeligro = this.findNearest(this.enviroment.carnivoros) 
     
    if (nearPeligro.distance < this.fieldOfVision) {
      this.position.moveTowards(near.entity, -1 * this.speed)  

      if (nearPeligro.distance < this.size + near.entity.size) {
        this.eat(near.entity)
      }
    } else {

      if (near.distance < this.fieldOfVision) {
        this.position.moveTowards(near.entity, this.speed)

        if (near.distance < this.size + near.entity.size) {
          this.eat(near.entity)
        }
      } else {
        this.moveRandom()
      }
    }

  })
}
