class Car {
  constructor(x, y, width, height, controlsType, maxSpeed = 3, color= 'brown') {
    // Set initial position and dimensions
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // Set initial speed and movement properties
    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;
    this.angle = 0;
    this.damaged = false;
    
    // Determine if the car should use AI controls
    this.useBrain = controlsType == "AI";

    // If not a dummy car, add sensors and neural network
    if(controlsType != "DUMMY"){
      this.sensor = new Sensor(this);
      this.brain = new NeuralNetwork(
          [this.sensor.rayCount,6,4]
      );
    }
    // Create controls based on the specified type
    this.controls = new Controls(controlsType);

    // Load the car image
    this.img = new Image();
    this.img.src = 'car.png';

    this.mask = document.createElement("canvas");
    this.mask.width = this.width;
    this.mask.height = this.height;

    const maskCtx = this.mask.getContext("2d");
    this.img.onload = () => {
      maskCtx.fillStyle = color;
      maskCtx.rect(0,0,this.width,this.height);
      maskCtx.fill();

      maskCtx.globalCompositeOperation = "destination-atop";
      maskCtx.drawImage(this.img,0,0,this.width,this.height);
    }

  }

  update(roadBorders, traffic) {
    if(!this.damaged){
      // Move the car and check for damage
      this.#move();
      this.polygon = this.#createPolyon();
      this.damaged = this.#assessDamage(roadBorders, traffic);
    }
    if(this.sensor){
      // Update sensor readings and use neural network if AI-controlled
      this.sensor.update(roadBorders, traffic);
      const offsets = this.sensor.readings.map(
        s => s == null?0:1-s.offset
      );
      const outputs = NeuralNetwork.feedForward(offsets,this.brain);
      
      if(this.useBrain){
        // Apply neural network outputs to controls
        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.reverse = outputs[3];
      }
    }
  }

  #assessDamage(roadBorders, traffic){
    // Check for collision with road borders
    for(let i = 0; i < roadBorders.length; i++){
      if(polysIntersect(this.polygon, roadBorders[i])){
        return true;
      }
    }
    // Check for collision with traffic
    for(let i = 0; i < traffic.length; i++){
      if(polysIntersect(this.polygon, traffic[i].polygon)){
        return true;
      }
    }
    return false;
  }

  #createPolyon(){
    // Create a polygon representation of the car for collision detection
    const points=[];
    const rad = Math.hypot(this.width, this.height) /2;
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - Math.sin(this.angle - alpha)*rad ,
      y: this.y - Math.cos(this.angle - alpha)*rad
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha)*rad,
      y: this.y - Math.cos(this.angle + alpha)*rad
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha)*rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha)*rad
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha)*rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha)*rad
    });
    return points;
  }

  #move() {
    // Handle forward and reverse movement
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    // Limit speed
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    // Apply friction
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    // Handle turning
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    // Update position based on speed and angle
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(ctx, drawSensor = false) {
    // Draw the sensor if applicable
    if(this.sensor && drawSensor){
      this.sensor.draw(ctx);
    }
    // Draw the car image
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);
    if(!this.damaged){
      ctx.drawImage(this.mask,
        -this.width/2,
        -this.height/2,
        this.width,
        this.height);
        ctx.globalCompositeOperation = "multiply";
    }

    ctx.drawImage(this.img,
      -this.width/2,
      -this.height/2,
      this.width,
      this.height);
    ctx.restore();  

  }
}