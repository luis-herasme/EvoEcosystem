
import Vector from './Vector'
import World from './World'
import Plant from './Plant'
import Entity from './Entity'
import * as dibujo from './dibujo/index'
const world = new World()

const mouse = {
  velocity: new Vector(0, 0),
  acceleration: new Vector(0, 0),
  friction: 0.9,
  position: new Vector(0, 0),
  zoom: 0,
  zV: 0,
  zA: 0,
  x: 0,
  y: 0,
  update () {
    this.velocity.add(this.acceleration)
    // this.zV += this.zA
    world.render.context.translate(this.velocity.x, this.velocity.y)
    this.position.add(this.velocity)
    this.velocity.mult(this.friction)
    // this.zV *= 0.7
    this.acceleration.zero()
    // this.zA = 0

  //  world.render.context.translate(window.innerWidth / 2 + this.position.x, window.innerHeight /2 + this.position.y)
  //  world.render.context.scale(1 + this.zV, 1 + this.zV)
  //  world.render.context.translate(-window.innerWidth / 2 + this.position.x, -window.innerHeight /2 + this.position.y)
  },
  addForce(force) {
    this.acceleration.add(force)
  },
  addZoom (z) {
    this.zA += z
  }
}

document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX
  mouse.y = e.clientY
})
/*
document.addEventListener('mousewheel', (m) => {
  if (m.wheelDelta < 0) {
    */
    /*
    world.render.context.translate(mouse.x,mouse.y)
    world.render.context.scale(0.9,0.9);
    world.render.context.translate(-mouse.x,-mouse.y);
    */
   /*
   mouse.addZoom(-0.2)
  } else {
    mouse.addZoom(0.2)
    */
    /*
    world.render.context.translate(mouse.x,mouse.y)
    world.render.context.scale(1.1,1.1);
    world.render.context.translate(-mouse.x,-mouse.y);
    */
  //}
//})

document.addEventListener('keypress', (e) => {
  if (e.key.toLowerCase() === 'w') {
    mouse.addForce(new Vector(0, 10))
  }
  if (e.key.toLowerCase() === 's') {
    world.render.context.translate(0, -10)
    mouse.addForce(new Vector(0, -10))
  }
  if (e.key.toLowerCase() === 'a') {
    world.render.context.translate(10, 0)
    mouse.addForce(new Vector(10, 0))
  }
  if (e.key.toLowerCase() === 'd') {
    mouse.addForce(new Vector(-10, 0))
  }

  if (e.key === '+') {
    world.render.context.translate(mouse.x,mouse.y)
    world.render.context.scale(1.1,1.1);
    world.render.context.translate(-mouse.x,-mouse.y);
  }
  if (e.key === '-') {
    world.render.context.translate(mouse.x,mouse.y)
    world.render.context.scale(0.9,0.9);
    world.render.context.translate(-mouse.x,-mouse.y);
  }

})


const NUMBER_PLANTS      = 1000
const NUMBER_VEGETARIANS = 300
const NUMBER_CARNIVORS   = 100

for (let x = 0; x < NUMBER_PLANTS; x++) {
  world.addPlant(new Plant(Vector.randomPositive(3000, 3000)))
}

for (let i = 0; i < NUMBER_VEGETARIANS; i++) {
  world.add(new Entity({
    speedLimit: Math.random(),
    fertility: Math.random(),
    fieldVision: 100,
    lifetime: Math.random(),
    sizeLimit: Math.random(),
    carnivore: false,
    vegetarian:  true,
    position: Vector.randomPositive(3000, 3000)
  }))
}

for (let i = 0; i < NUMBER_CARNIVORS; i++) {
  world.add(new Entity({
    first: true,
    speedLimit: Math.random(),
    fertility: Math.random(),
    fieldVision: 100,
    lifetime: Math.random(),
    sizeLimit: Math.random(),
    carnivore: true,
    vegetarian:  false,
    position: Vector.randomPositive(3000, 3000)
  }))
}
let p = new dibujo.Text({
  position: {
    x: 100,
    y: 100
  }
})
setInterval(() => {
  // mouse.update()
  world.update()
}, 0)
