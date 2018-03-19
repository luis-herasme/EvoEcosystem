
import Enviroment from './Enviroment'
import * as dibujo from './dibujo/index'
import Entity from './Entity'

console.log(dibujo)

export default class World {
  public limitSpeed     :number     
  public limitSize      :number
  public limitVision    :number
  public limitLifeTime  :number
  public limitFertility :number

  public enviroments    :Array<Array<Enviroment>> = []
  public resolution     :Array<number>  = []

  public maxPositionX
  public maxPositionY

  public minPositionX :number = 0
  public minPositionY :number = 0

  public render

  public entities  = []//: Array<Entity> = []

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
      x: 500/*this.render.getHeight()*/,
      y: 500// this.render.getWidth()
    }

    console.log(size)

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
        this.enviroments[x].push(new Enviroment(x, y, this))
      }
    }
  }

  organizeParticle (particle: Entity): void {
    const positionX = Math.floor((particle.position.x / this.maxPositionX) * this.resolution[0])
    const positionY = Math.floor((particle.position.y / this.maxPositionY) * this.resolution[1])

    if (particle.enviroment) {
      if (particle.enviroment.x !== positionX || particle.enviroment.y !== positionY) {
        particle.enviroment.remove(particle)
        this.enviroments[positionX][positionY].add(particle)
      }
    } else {
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

  isInsideWorldBounds (particle) {
    if (particle.position.x > this.maxPositionX) {
      return false
    } else if (particle.position.x < this.minPositionX) {
      return false
    }

    if (particle.position.y > this.maxPositionY) {
      return false
    } else if (particle.position.y < this.minPositionY) {
      return false
    }
    return true
  }

  add (child) {
    this.render.add(child.circle)
    this.entities.push(child)
  }

  remove (child) {
    this.render.remove(child.circle)
    this.entities.splice(this.entities.indexOf(child), 1)
  }

  update (): void {
    this.render.render()
    this.entities.forEach((entity) => {
      this.insideWorldBounds(entity)
      this.organizeParticle(entity)
      entity.update()
    })
  }
}
