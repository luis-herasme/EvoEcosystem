import Entity from "./Entity"

export default class Enviroment {
  public x: number
  public y: number
  public Entities: Array<Entity>

  constructor (x, y) {
    this.x = x
    this.y = y
  }
}

