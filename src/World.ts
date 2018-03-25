
import * as dibujo from './dibujo/index'
import Enviroment  from './Enviroment'
import Entity      from './Entity'
import Point       from './dibujo/Point'

class World {
  public limitSpeed     : number
  public limitSize      : number
  public limitVision    : number
  public limitLifeTime  : number
  public limitFertility : number
  public enviromentSize : Point
  public resolution     : Array<number>            = []

  // ------------------- Fixed properties -------------------

  public render         : dibujo.Render            = new dibujo.Render()
  public scene          : dibujo.Scene             = new dibujo.Scene()
  public entities       : Array<Entity>            = []
  public enviroments    : Array<Array<Enviroment>> = []

  // World size
  public minPositionX   : number
  public minPositionY   : number
  public maxPositionX   : number
  public maxPositionY   : number
  
  constructor (
    limitSize = 10,
    limitSpeed = 10,
    limitVision = 10,
    limitLifeTime = 10,
    limitFertility = 10,
    resolution = [10, 10],
    enviromentSize = {x: 100, y: 100}
  ) {
    this.render.setScene(this.scene)
    this.enviromentSize = enviromentSize

    this.limitSpeed     = limitSpeed
    this.limitSize      = limitSize
    this.limitVision    = limitVision
    this.limitLifeTime  = limitLifeTime
    this.limitFertility = limitFertility

    this.resolution = resolution
    this.maxPositionX = this.resolution[0] * this.enviromentSize.x
    this.maxPositionY = this.resolution[1] * this.enviromentSize.y

    for (let x = 0; x <= this.resolution[0]-1; x++) {
      this.enviroments.push([])
      for (let y = 0; y <= this.resolution[1]-1; y++) {
        this.enviroments[x].push(new Enviroment(x, y, this))
        if (x === 0) this.enviroments[x][y].limit = true
        if (x === this.resolution[0]-1) this.enviroments[x][y].limit = true
        if (y === 0) this.enviroments[x][y].limit = true
        if (y === this.resolution[1]-1) this.enviroments[x][y].limit = true
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
    if (particle.position.x >= this.maxPositionX) {
      particle.position.x = this.minPositionX + 1
    } else if (particle.position.x <= this.minPositionX) {
      particle.position.x = this.maxPositionX - 1
    }

    if (particle.position.y >= this.maxPositionY) {
      particle.position.y = this.minPositionY + 1
    } else if (particle.position.y <= this.minPositionY) {
      particle.position.y = this.maxPositionY - 1
    }
  }

  addPlant (plant) {
    this.insideWorldBounds(plant)
    this.organizeParticle(plant)
  }

  add (child) {
    if (child.text) {
      this.render.add(child.text)
    }
    this.render.add(child.circle)
    this.entities.push(child)
  }

  remove (child): void {
    this.entities.splice(this.entities.indexOf(child), 1)
  }

  update (): void {   
    this.render.render()
    this.entities.forEach((entity) => {
      this.insideWorldBounds(entity)
      this.organizeParticle(entity)
      entity.update()
    })
    this.enviroments.forEach((en) => en.forEach((e) => e.update()))
  }
}

export default World
