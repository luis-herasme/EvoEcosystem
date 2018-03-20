
import Entity from "./Entity"
import World from "./World"
import Plant from './Plant'

export default class Enviroment {
  public x: number
  public y: number
  public world        : World
  public trees        : Array<Entity> = []
  public vegetarians  : Array<Entity> = []
  public carnivorous  : Array<Entity> = []

  constructor (x, y, world) {
    this.world = world
    this.x = x
    this.y = y
  }

  add (child) {
    child.environment = this
    if (child.vegetarian) {
      this.vegetarians.push(child)
    } else if (child.carnivore) {
      this.carnivorous.push(child)
    } else {
      this.trees.push(child)
    }
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

