
import Entity from "./Entity"
import World from "./World"
import Plant from './Plant'
import * as dibujo from './dibujo/index'


export default class Enviroment {
  public x: number
  public y: number
  public world        : World
  public trees        : Array<Entity> = []
  public vegetarians  : Array<Entity> = []
  public carnivorous  : Array<Entity> = []
  public graphic
  public limit: boolean
  constructor (x, y, world) {

    this.graphic = new dibujo.Rect({
      position: {
        x: world.size.x * x,
        y: world.size.y * y,
      },
      width: world.size.x,
      height: world.size.y,
      stroke: true,
      fill: true,
      color: '#333',
      z_index: 1,
      lineColor: 'rgba(255, 255, 255, 0.5)',
      lineWidth: 1
    })

    world.render.add(this.graphic)
    this.world = world
    this.x = x
    this.y = y
  }

  add (child) {
    child.enviroment = this

    if (child.vegetarian) {
      this.vegetarians.push(child)
    } else if (child.carnivore) {
      this.carnivorous.push(child)
    } else {
      if (this.trees.length <= 5) {
        this.world.render.add(child.circle)
        this.trees.push(child)
      }
    }
  }

  insideWorldBounds (particle: Entity): void {
    if (particle.position.x >= this.world.maxPositionX) {
      particle.position.x = this.world.minPositionX + 1
    } else if (particle.position.x <= this.world.minPositionX) {
      particle.position.x = this.world.maxPositionX - 1
    }

    if (particle.position.y >= this.world.maxPositionY) {
      particle.position.y = this.world.minPositionY + 1
    } else if (particle.position.y <= this.world.minPositionY) {
      particle.position.y = this.world.maxPositionY - 1
    }
  }

  update () {
    /*
    if (this.limit) {
      this.vegetarians.forEach((v) => this.insideWorldBounds(v))
      this.carnivorous.forEach((c) => this.insideWorldBounds(c))
    }
    */
    this.graphic.color = new dibujo.Color(0.2, 0.1+ this.trees.length / 5,0.1).rgb()
    this.trees.forEach((t) => t.update())
  }

  remove (child) {
    if (child.vegetarian) {
      this.vegetarians.splice(this.vegetarians.indexOf(child), 1)
    } else if (child.carnivore) {
      this.carnivorous.splice(this.carnivorous.indexOf(child), 1)
    } else {
      this.trees.splice(this.trees.indexOf(child), 1)
    }
  }
}

