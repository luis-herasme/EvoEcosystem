
import Enviroment from './Enviroment'
import dibujo from 'dibujo'
import Entity from './Entity'

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

  public minPositionX :number = 0
  public minPositionY :number = 0

  public render

  public Entities: Array<Entity>

  constructor (
    resolution = [3, 3],
    limitSpeed = 10,
    limitSize = 10,
    limitVision = 10,
    limitLifeTime = 10,
    limitFertility = 10
  ) {

    this.render = new dibujo.Render()

    let size = {
      x: this.render.getHeight(),
      y: this.render.getWidth()
    }

    this.limitSpeed     = limitSpeed
    this.limitSize      = limitSize
    this.limitVision    = limitVision
    this.limitLifeTime  = limitLifeTime
    this.limitFertility = limitFertility

    this.resolution = resolution
    this.maxPositionX = this.resolution[0] * size.x
    this.maxPositionY = this.resolution[1] * size.y

    for (let x = 0; x <= this.resolution[0]; x++) {
      this.enviroments.push([])
      for (let y = 0; y <= this.resolution[1]; y++) {
        this.enviroments[x].push(new Enviroment(x, y))
      }
    }
  }

  organizeParticle (particle: Entity): void {
    const positionX = Math.floor((particle.position.x / this.maxPositionX) * this.resolution[0])
    const positionY = Math.floor((particle.position.y / this.maxPositionY) * this.resolution[1])

    if (particle.enviroment.x !== positionX || particle.enviroment.y !== positionY) {
      particle.enviroment.remove(particle)
      this.enviroments[positionX][positionY].add(particle)
    }
  }

  insideWorldBounds (particle: Entity): void {
    if (particle.position.x > this.maxPositionX) {
      particle.position.x = this.minPositionX
    } else if (particle.position.x < this.minPositionX) {
      particle.position.x = this.maxPositionX
    }

    if (particle.position.y > this.maxPositionY) {
      particle.position.y = this.minPositionY
    } else if (particle.position.y < this.minPositionY) {
      particle.position.y = this.maxPositionY
    }
  }

  update (): void {
    this.Entities.forEach((entity) => {
      this.insideWorldBounds(entity)
      this.organizeParticle(entity)
    })
  }
}
