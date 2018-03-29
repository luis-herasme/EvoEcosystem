
import Vector from './Vector'
import Enviroment from './Enviroment'
import * as dibujo from './dibujo/index'

export default class Plant {
  public position   : Vector
<<<<<<< HEAD
  public enviroment : Enviroment
  public size       : number = 3
=======
  public environment : Enviroment
  public size       : number = 1
>>>>>>> 54e9c8b47bfa54f4601d4032e2177b80bd6104b7
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
<<<<<<< HEAD
    this.enviroment.world.render.remove(this.circle)
    this.enviroment.remove(this)
=======
    this.environment.world.remove(this)
>>>>>>> 54e9c8b47bfa54f4601d4032e2177b80bd6104b7
  }

  grow () {
    this.size += 0.005
  }

  haveChild () {
<<<<<<< HEAD
    this.enviroment.world.addPlant(
      new Plant(Vector.add(this.position, Vector.random(this.size* 15, this.size * 15)))
=======
    this.environment.world.add(
      new Plant(Vector.add(this.position, Vector.random(this.size* 5, this.size * 5)))
>>>>>>> 54e9c8b47bfa54f4601d4032e2177b80bd6104b7
    )
  }
}
