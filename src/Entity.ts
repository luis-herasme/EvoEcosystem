import Vector from './Vector'
import Enviroment from './Enviroment';
import * as dibujo from './dibujo/index'

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
  }
} 
