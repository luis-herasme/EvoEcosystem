
class Entity { 
 
  public carnivore : boolean
  public tree : boolean
  public vegetarian : boolean
  public speed : number 
  public fertility : number 
  public fieldVision : number[] 
  public lifetime : number 
  public size : number 
  public sizeLimit : number 
  private calConsumption : number 
 
  public position = { 
    x: 0, 
    y: 0 
  } 
  public environment 
 
  constructor (properties) { 
     
    if(properties.first == true){ 
      this.speed = properties.speed; 
      this.fertility = properties.fertility; 
      this.fieldVision = properties.fieldVision; 
      this.lifetime = properties.lifetime; 
      this.sizeLimit = properties.sizeLimit;
      this.carnivore = properties.carnivore;
      this.tree = properties.tree;
      this.vegetarian = properties.vegetarian;
    }else{ 
      this.generatingChild(properties.parents) 
    } 
  } 
  generatingChild(parents){ 
    let rand_mut = Math.random(); 
    this.speed = (parents[1].speed + parents[0].speed)*(1/2 + 0.05*(rand_mut-0.05)); 
    this.fertility = (parents[1].fertility + parents[0].fertility)*(1/2 + 0.05*(rand_mut-0.05)); 
    this.fieldVision[1] = (parents[1].fieldVision[1] + parents[0].fieldVision[1])*(1/2 + 0.05*((-1)*rand_mut-0.05)); 
    this.fieldVision[2] = (parents[1].fieldVision[0] + parents[0].fieldVision[0])*(1/2 + 0.05*((-1)*rand_mut-0.05)); 
    this.lifetime = (parents[1].lifetime + parents[0].lifetime)*(1/2 + 0.05*((-1)*rand_mut-0.05)); 
    this.sizeLimit = (parents[1].sizeLimit + parents[0].sizeLimit)*(1/2 + 0.05*((-1)*rand_mut-0.05)); 
  } 
} 
