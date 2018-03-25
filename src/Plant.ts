
import Vector from './Vector'
import Enviroment from './Enviroment'
import * as dibujo from './dibujo/index'

export default class Plant {
  public position   : Vector
  public enviroment : Enviroment
  public size       : number = 3
  public maxSize    : number = 5
  public circle

  constructor (position?) {
    if (position) {
      this.position = position
    } else {
      this.position = Vector.randomPositive(1000, 1000)// this.enviroment.world.maxPositionX, this.enviroment.world.maxPositionY)
    }

    this.circle = new dibujo.Circle({
      position: this.position,
      color: 'green',
     // stroke: true,
     // lineColor: 'black',
     // lineWidth: 1,
      z_index: 2,
      radius: this.size
    })
  }

  update () {
    this.grow()
    if (Math.random() < 0.01) this.haveChild()
    if (this.size > this.maxSize) {
      this.haveChild()
      this.haveChild()
      this.dead()
    }
    this.circle.radius = this.size
  }

  dead () {
    this.enviroment.world.render.remove(this.circle)
    this.enviroment.remove(this)
  }

  grow () {
    this.size += 0.005
  }

  haveChild () {
    this.enviroment.world.addPlant(
      new Plant(Vector.add(this.position, Vector.random(this.size* 15, this.size * 15)))
    )
  }
}
