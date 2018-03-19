import Enviroment from "./Enviroment"

export default class World {
  public limitSpeed     :number     
  public limitSize      :number
  public limitVision    :number
  public limitLifeTime  :number
  public limitFertility :number

  public enviroments    :Array<Array<Enviroment>> = []
  public resolution     :Array<number>

  public maxPositionX
  public maxPositionY

  constructor (
    limitSpeed = 10,
    limitSize = 10,
    limitVision = 10,
    limitLifeTime = 10,
    limitFertility = 10
  ) {
    this.limitSpeed     = limitSpeed
    this.limitSize      = limitSize
    this.limitVision    = limitVision
    this.limitLifeTime  = limitLifeTime
    this.limitFertility = limitFertility

    this.resolution = [3, 3]

    for (let x = 0; x <= this.resolution[0]; x++) {
      this.enviroments.push([])
      for (let y = 0; y <= this.resolution[1]; y++) {
        this.enviroments[x].push(new Enviroment(x, y))
      }
    }
  }

  organizeParticle (particle) {
    const positionX = Math.floor((particle.position.x / this.maxPositionX) * this.resolution[0])
    const positionY = Math.floor((particle.position.y / this.maxPositionY) * this.resolution[1])
    if (particle.collider) particle.collider.remove(particle)
    this.enviroments[positionX][positionY].add(particle)
  }
}