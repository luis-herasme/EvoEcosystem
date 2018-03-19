
import Vector from './Vector'
import Enviroment from './Enviroment'
import * as dibujo from './dibujo/index'

export default class Entity {

  // Propiedades
  public speed: number
  public foodLevel: number = 100000
  public position: Vector
  public enviroment: Enviroment
  private size: number = 2
  private timeSlot: number = 0  
  private calConsumption: number

  // Propiedades geneticas
  public carnivore: boolean
  public vegetarian: boolean
  public fieldVision: number
  public fertility: number
  public sizeLimit: number
  public lifetime: number  //Cuanto dura vivo
  public speedLimit: number

  public circle

  constructor(properties) {
    if (properties.first == true) {
      this.speedLimit = properties.speedLimit
      this.speed = this.speedLimit * 0.9
      this.fertility = properties.fertility
      this.fieldVision = properties.fieldVision
      this.lifetime = properties.lifetime
      this.sizeLimit = properties.sizeLimit
      this.carnivore = properties.carnivore
      this.vegetarian = properties.vegetarian
      this.position = properties.position
    } else {
      this.generatingChild(properties.parents)
    }
    /*
        this.text = new dibujo.Text({
          content: this.foodLevel
        })
    */
    this.circle = new dibujo.Circle({
      position: this.position,
      radius: this.size,
      color: new dibujo.Color(this.fertility, this.speedLimit, this.sizeLimit).rgb(),
      fill: true
    })
  }

  generatingChild(parents) {
    let rand_mut = Math.random()
    this.carnivore = parents[1].carnivore
    this.vegetarian = parents[1].vegetarian
    this.speedLimit = (parents[1].speedLimit + parents[0].speedLimit) * (1 / 2 + 0.05 * (rand_mut - 0.05))
    this.speed = this.speedLimit * 0.9
    this.fertility = (parents[1].fertility + parents[0].fertility) * (1 / 2 + 0.05 * (rand_mut - 0.05))
    this.fieldVision = (parents[1].fieldVision + parents[0].fieldVision) * (1 / 2 + 0.05 * ((-1) * rand_mut - 0.05))
    this.lifetime = (parents[1].lifetime + parents[0].lifetime) * (1 / 2 + 0.05 * ((-1) * rand_mut - 0.05))
    this.sizeLimit = (parents[1].sizeLimit + parents[0].sizeLimit) * (1 / 2 + 0.05 * ((-1) * rand_mut - 0.05))
  }

  findNearest (popu) {
    let positions = popu.map((x) => x.position) 
    let relativo = positions.map((x) => Vector.sub(x, this.position))
    let distances = relativo.map((x) => x.mag())
    let distance = Math.min(...distances)

    let index = distances.indexOf(distance)
    let entity = popu[index]

    return {distance, entity, index}
  }
  
  see() {
    //let danger
    let food
    if (this.vegetarian) {
      food = this.findNearest(this.enviroment.trees)
      // nearPeligro = this.findNearest(this.enviroment.carnivorous)
    }//  else {
      // food = this.findNearest(this.enviroment.carnivorous.filter((x) => x.size < this.size))
      // nearPeligro = this.findNearest(this.enviroment.carnivorous.filter((x) => x.size > this.size))
    // }
    // if (nearPeligro.distance < this.fieldVision) {
      // this.position.moveTowards(nearPeligro.entity.position, -1 * this.speed, 0)
    // } else {
      if (food.distance < 100/*this.fieldVision*/) {
        this.position.moveTowards(food.entity.position, this.speed, 0)
      }
      console.log(food.distance ,this.size + food.entity.size)
      if (food.distance < this.size + food.entity.size) {
        this.eat(food.entity)
      }

      // else {
       // this.moveRandom()
     // }
    // }
  }

  eat(entity) {
    // this.foodLevel += (entity.size / this.enviroment.world.limitSize) * 25
    this.enviroment.world.remove(entity)

  }

  moveRandom() {
    let direction = new Vector(Math.random() - 0.5, Math.random() - 0.5)
    direction.normalize();
    direction.mult(this.size * 2)
    this.position.moveTowards(direction, -1 * this.speed, 0)
  }

  dayPassed() {

  }

  dead() {
    
    this.enviroment.world.remove(this)
  }

  update() {
    this.see()
    this.circle.radius = this.size + 2
    this.circle.position = this.position
    this.timeSlot += 1
    //    this.foodLevel -= this.speed

    // if (this.foodLevel < 0) {
    //   this.dead()
    // }

    if (this.size < this.sizeLimit) {
      this.size = this.sizeLimit * this.timeSlot / 2500
    }


  }
} 
