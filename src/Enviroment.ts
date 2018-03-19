import Entity from "./Entity"

export default class Enviroment {
  public x: number
  public y: number

  public trees        : Array<Entity>
  public vegetarians  : Array<Entity>
  public carnivorous  : Array<Entity>

  constructor (x, y) {
    this.x = x
    this.y = y
  }

  add (child :Entity) {
    if (child.tree) {
      this.trees.push(child)
    } else if (child.carnivore) {
      this.carnivorous.push(child)
    } else {
      this.vegetarians.push(child)
    }
  }

  remove (child :Entity) {
    if (child.tree) {
      this.trees.splice(this.trees.indexOf(child), 1)
    } else if (child.carnivore) {
      this.carnivorous.splice(this.carnivorous.indexOf(child), 1)
    } else {
      this.vegetarians.splice(this.vegetarians.indexOf(child), 1)
    }
  }
}

