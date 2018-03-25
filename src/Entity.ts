
import Vector from './Vector'
import Enviroment from './Enviroment'
import * as dibujo from './dibujo/index'

export default class Entity {

  // Propiedades
  public speed: number
  public foodLevel: number = 100
  public position: Vector
  public enviroment: Enviroment
  private size: number = 5
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
  public color
  public goal = new Vector(0 ,0)
  public circle
  public text
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
      this.color = properties.color?  properties.color : dibujo.Color.random().rgb()
    } else {
      this.generatingChild(properties.parents)
    }
    this.goal = Vector.add(this.position, Vector.random(100, 100))
    
    this.text = new dibujo.Text({
      content: this.foodLevel,
      position: this.position,
      z_index: 3,
      style: {
        textAlign: "center",
        font: '12px Arial',
        fillStyle : 'white',
      }
    })
    if (this.vegetarian) {
      this.circle = new dibujo.Circle({
        z_index: 2,
        position: this.position,
        radius: this.size,
        color: this.color,
        stroke: true,
        lineColor: 'green',
        lineWidth: 1
      })
    } else {
      this.circle = new dibujo.Circle({
        z_index: 2,
        position: this.position,
        radius: this.size,
        color: this.color,
        stroke: true,
        lineColor: 'red',
        lineWidth: 1
      })
    }
  }

  generatingChild (parents) {
    let rand_mut     = Math.random()
    this.carnivore   = parents[1].carnivore
    this.vegetarian  = parents[1].vegetarian
    this.speedLimit  = (parents[1].speedLimit + parents[0].speedLimit) * (1 / 2 + 0.05 * (rand_mut - 0.05))
    this.speed       = this.speedLimit * 0.9
    this.fertility   = (parents[1].fertility + parents[0].fertility) * (1 / 2 + 0.05 * (rand_mut - 0.05))
    this.fieldVision = (parents[1].fieldVision + parents[0].fieldVision) * (1 / 2 + 0.05 * ((-1) * rand_mut - 0.05))
    this.lifetime    = (parents[1].lifetime + parents[0].lifetime) * (1 / 2 + 0.05 * ((-1) * rand_mut - 0.05))
    this.sizeLimit   = (parents[1].sizeLimit + parents[0].sizeLimit) * (1 / 2 + 0.05 * ((-1) * rand_mut - 0.05))
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
  
  think () {
    if (this.vegetarian) {
      if (this.enviroment.carnivorous.length > 0) {
        let food = this.findNearest(this.enviroment.carnivorous)

        if (food.distance < this.fieldVision * 100) {
          this.position.moveTowards(food.entity.position,-1* this.speed * 5, 0)
        }
      } else if (this.enviroment.trees.length > 0) {
        let food = this.findNearest(this.enviroment.trees)

        if (food.distance < this.fieldVision * 100) {
          if (food.distance < this.size + food.entity.size) {
            this.eatPlant(food.entity)
          } else {
            this.position.moveTowards(food.entity.position, this.speed * 5, 0)
          }
        }
      }

      else {
        this.moveRandom()
      }
    }

    if (this.carnivore) {
      if (this.enviroment.vegetarians.length > 0) {
        let food = this.findNearest(this.enviroment.vegetarians)

        if (food.distance < this.fieldVision * 100) {
          if (food.distance < this.size + food.entity.size) {
            this.eat(food.entity)
          } else {
            
            this.position.moveTowards(food.entity.position, this.speed * 12.5, 0)
          }
        }
      }

      else {
        this.moveRandom()
      }
    }
  }

  eat(entity) {
    this.foodLevel += (entity.size / this.enviroment.world.limitSize) * 25
    entity.dead()
    if (Math.random() < this.fertility * 0.5) this.haveChild()
  }

  eatPlant(entity) {
    this.foodLevel += (entity.size / this.enviroment.world.limitSize) * 25
    entity.dead()
    if (Math.random() < this.fertility * 0.5) this.haveChild()
  }

  haveChild() {
    let C= 0.5
    if (this.carnivore) C * 3
    if (Math.random() < this.fertility * C) {
      this.enviroment.world.add(
        new Entity({
          first: true,
          speedLimit: 0.5 + Math.random() / 2,
          fertility: this.fertility,
          fieldVision: 100,
          lifetime: Math.random(),
          sizeLimit: Math.random(),
          carnivore: this.carnivore,
          vegetarian: this.vegetarian,
          color: this.color,
          position: Vector.add(this.position, Vector.random(10, 10))
        })
      )
    }
  }

  moveRandom () {    
    if (this.position.distance(this.goal) < 10) {
      this.goal = Vector.add(this.position, Vector.random(100, 100))
    }
    this.position.moveTowards(this.goal, this.speed * 5, 0)
    
  }

  dead () {
    this.enviroment.world.render.remove(this.circle)
    this.enviroment.world.render.remove(this.text)
    this.enviroment.world.remove(this)
    this.enviroment.remove(this)
  }

  update() {
    this.think()

    this.text.content = Math.round(this.foodLevel)
    this.circle.radius = this.size

    this.timeSlot += 1
    this.foodLevel -= (this.speed/4)
    if (this.vegetarian) this.foodLevel -= (this.speed/1.5)

    if (this.foodLevel < 0) {
      this.dead()
    }

    if (this.size < this.sizeLimit) {
      this.size = this.sizeLimit * this.timeSlot / 2500
    }
  }
} 
