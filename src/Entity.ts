import Vector from './Vector'
import Enviroment from './Enviroment';
import * as dibujo from './dibujo/index'

<<<<<<< HEAD
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
=======
export default class Entity { 
 
  public carnivore : boolean
  public vegetarian : boolean
  public speed : number 
  public fertility : number 
  public fieldVision : number
  public lifetime : number 
  public size : number = 1
  public sizeLimit : number
  public speedLimit : number 
  private calConsumption : number
  public foodLevel : number 
 
  public position :Vector
  public environment :Enviroment

  public circle
 
  constructor (properties) { 
    if(!properties.parents){ 
      this.speedLimit = properties.speedLimit;
      this.speed = this.speedLimit*0.9;
      this.fertility = properties.fertility; 
      this.fieldVision = properties.fieldVision; 
      this.lifetime = properties.lifetime; 
      this.sizeLimit = properties.sizeLimit;
      this.carnivore = properties.carnivore;
      this.vegetarian = properties.vegetarian;
    }else{ 
      this.generatingChild(properties.parents) 
    }
    this.position = properties.position
    //this.environment = properties.environment
    this.circle = new dibujo.Circle({
      position : this.position,
      radius : this.size,
      color : "red",
      fill : true
    })
  } 
  generatingChild(parents){ 
    let rand_mut = Math.random(); 
    this.carnivore = parents[1].carnivore;
    this.vegetarian = parents[1].vegetarian;
    this.speedLimit = (parents[1].speedLimit + parents[0].speedLimit)*(1/2 + 0.05*(rand_mut-0.05));
    this.speed = this.speedLimit*0.9;
    this.fertility = (parents[1].fertility + parents[0].fertility)*(1/2 + 0.05*(rand_mut-0.05)); 
    this.fieldVision = (parents[1].fieldVision + parents[0].fieldVision)*(1/2 + 0.05*((-1)*rand_mut-0.05)); 
    this.lifetime = (parents[1].lifetime + parents[0].lifetime)*(1/2 + 0.05*((-1)*rand_mut-0.05)); 
    this.sizeLimit = (parents[1].sizeLimit + parents[0].sizeLimit)*(1/2 + 0.05*((-1)*rand_mut-0.05)); 
  } 

  findNearest (population) {
    let relativo  = population.map((e) => Vector.sub(e.position, this.position))
    let distances = relativo.map((e) => e.mag())
  
    let distance  = Math.min(...relativo)
    let entity    = population[distances.indexOf(distance)]
  
    return {
      distance,
      entity
    }
  }
  
  see () {
    let nearPeligro
    let near
    if(this.vegetarian){
      near = this.findNearest(this.environment.trees)

      nearPeligro = this.findNearest(this.environment.carnivorous) 
      console.log("seeing");
    }else{
      near = this.findNearest(this.environment.carnivorous.filter((x)=>x.size<this.size))

      nearPeligro = this.findNearest(this.environment.carnivorous.filter((x) => x.size > this.size))
      console.log("notseeing");
    }
    if (nearPeligro.distance < this.fieldVision) {
      this.position.moveTowards(nearPeligro.entity, -1 * this.speed, 0)
    } else {
      if (near.distance < this.fieldVision) {
        this.position.moveTowards(near.entity, this.speed, 0)
        if (near.distance < this.size + near.entity.size) {
          this.eat(near.entity)
        }
      } else {
        this.moveRandom()
      }
    }
  }

  eat(entity){
    this.foodLevel += (entity.size/this.environment.world.limitSize)*25
    this.environment.world.remove(entity)
  }

  moveRandom(){
    let direction = new Vector(Math.random() - 0.5, Math.random() - 0.5)
    direction.normalize();
    direction.mult(this.size*2)
    this.position.moveTowards(direction, -1 * this.speed, 0)
  }

  /*dayPassed(){

  }*/

  update(){
    this.circle.radius = this.size;
    this.see(); 
>>>>>>> 54e9c8b47bfa54f4601d4032e2177b80bd6104b7
  }
} 
