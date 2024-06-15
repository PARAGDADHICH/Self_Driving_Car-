class Sensor {
  constructor(car,length=120,rayCount=6,rayWidth=0.5) {
    this.car = car;
    this.length = length;
    this.rayCount = rayCount;
    this.rayWidth = Math.PI * rayWidth; //spread of total 3 rays
    this.rays = [];
    this.readings = []; //stores the point of intersection of rays with border, if one exists else null
  }
  update(roadBorders, traffic) {
    this.#castRay();
    this.readings = [];
    for (let i = 0; i < this.rayCount; i++)
      this.readings.push(this.#getReadings(this.rays[i], roadBorders, traffic));
  }

  #getReadings(ray, roadBorder, traffic) {
    let curTouch = null;
    let curOffset = Infinity;
    for (let i = 0; i < roadBorder.length; i++) {
      const touch = intersection(
        ray[0],
        ray[1],
        roadBorder[i][0],
        roadBorder[i][1]
      );
      if (touch) {
        if (curOffset > touch.offset) {
          curTouch = touch;
          curOffset = touch.offset;
        }
      }
    }
    traffic.forEach((traf) => {
      for (let i = 0; i < traf.poygon.length; i++) {
        const touch = intersection(
          ray[0],
          ray[1],
          traf.poygon[i],
          traf.poygon[(i + 1) % traf.poygon.length]
        );
        if (touch) {
          if (curOffset > touch.offset) {
            curTouch = touch;
            curOffset = touch.offset;
          }
        }
      }
    });
    return curTouch;
  }
  #castRay() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle = lerp(
        this.rayWidth / 2,
        -this.rayWidth / 2,
        this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
      ); //modified so that rayCount 1 also works
      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(this.car.angle + rayAngle) * this.length,
        y: this.car.y - Math.cos(this.car.angle + rayAngle) * this.length,
      };
      this.rays.push([start, end]);
    }
  }
  draw(ctx) {
    ctx.lineWidth = 2;
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1];
      if (this.readings[i]) end = this.readings[i];
      ctx.beginPath();
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);

      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);

      ctx.stroke();
    }
  }
}
