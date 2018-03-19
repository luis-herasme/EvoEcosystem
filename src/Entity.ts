import Vector from './Vector'

class Entity { 
 
  public carnivore : boolean
  public vegetarian : boolean
  public speed : number 
  public fertility : number 
  public fieldVision : number
  public lifetime : number 
  public size : number 
  public sizeLimit : number
  public speedLimit : number 
  private calConsumption : number 
 
  public position :Vector
  public environment 
 
  constructor (properties) { 
    if(properties.first == true){ 
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
    this.environment = properties.environment;
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
    this.environment.Entities.forEach(element => {
      let near = this.findNearest(this.environment.Plants)
  
      let nearPeligro = this.findNearest(this.environment.carnivoros) 
       
      if (nearPeligro.distance < this.fieldVision) {
        this.position.moveTowards(near.entity, -1 * this.speed, 0)  
  
        if (nearPeligro.distance < this.size + near.entity.size) {
          this.eat(near.entity)
        }
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
  
    })
} 
