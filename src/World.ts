import Enviroment from "./Enviroment"

export default class World {
  public limitSpeed     :number = 10     
  public limitSize      :number = 10
  public limitVision    :number = 10
  public limitLifeTime  :number = 10
  public limitFertility :number = 10

  public enviroments    :Array<Array<Enviroment>>
  public resolution     :Array<number>

  constructor (limitSpeed, limitSize, limitVision, limitLifeTime, limitFertility) {
    this.limitSpeed     = limitSpeed
    this.limitSize      = limitSize
    this.limitVision    = limitVision
    this.limitLifeTime  = limitLifeTime
    this.limitFertility = limitFertility

    this.resolution = [3, 3]
    this.helpers = []

    for (let x = 0; x <= this.resolution[0]; x++) {
      this.helpers.push([])
      for (let y = 0; y <= this.resolution[1]; y++) {
        this.helpers[x].push(new Collision(x, y))
      }
    }
  }

  organizeParticle (particle) {
    const positionX = Math.floor((particle.position.x / this.maxPositionX) * this.resolution[0])
    const positionY = Math.floor((particle.position.y / this.maxPositionY) * this.resolution[1])
    if (particle.collider) particle.collider.remove(particle)
    this.helpers[positionX][positionY].add(particle)
  }

  organizeSharedParticles (particle) {
    const BorderMaxX = Math.floor(((particle.position.x + particle.size) / this.maxPositionX) * this.resolution[0])
    const BorderMinX = Math.floor(((particle.position.x - particle.size) / this.maxPositionX) * this.resolution[0])

    const BorderMaxY = Math.floor(((particle.position.y + particle.size) / this.maxPositionY) * this.resolution[1])
    const BorderMinY = Math.floor(((particle.position.y - particle.size) / this.maxPositionY) * this.resolution[1])

    if (BorderMaxX !== particle.collider.x) {
      if (BorderMaxX < this.resolution[0]) {
        this.helpers[BorderMaxX][particle.collider.y].simpleAdd(particle)
      }
    }

    if (BorderMinX !== particle.collider.x) {
      if (BorderMinX > 0) {
        this.helpers[BorderMinX][particle.collider.y].simpleAdd(particle)
      }
    }

    if (BorderMaxY !== particle.collider.y) {
      if (BorderMaxY < this.resolution[1]) {
        this.helpers[particle.collider.x][BorderMaxY].simpleAdd(particle)
      }
    }

    if (BorderMinY !== particle.collider.y) {
      if (BorderMinY > 0) {
        this.helpers[particle.collider.x][BorderMinY].simpleAdd(particle)
      }
    }
  }
}