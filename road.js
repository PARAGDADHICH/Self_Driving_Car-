class Road {
  constructor(x, width, laneCount = 3) {
    this.x = x; //centre x of the road
    this.width = width; // width of the road
    this.laneCount = laneCount;

    const infinity = 10000000;//setting a much larger value will makes the dashed lanes diappear
    this.top = -infinity;
    this.bottom = infinity;
    this.left = x - width / 2;
    this.right = x + width / 2;

    this.borders = [
        [{ x: this.left, y: this.top },{ x: this.left, y: this.bottom }], //top border
        [{ x: this.right, y: this.top },{ x: this.right, y: this.bottom }], //bottom border
    ]
  }
  draw(ctx) {
    ctx.lineWidth = 5; //width of the road
    ctx.strokeStyle = "white"; //color of the road

    for (let i = 1; i < this.laneCount; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount); //get x position of current lane
      ctx.setLineDash([40, 10]); //draw dashed lines for lanes
      
  
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }
    ctx.setLineDash([]); //reset the line dash to solid line
    for (let i = 0; i < this.borders.length; i++) {
      const border = this.borders[i];
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    }
  }

  //get the x position of the center of the particular lane
  get_lane_center(laneIdx){
    laneIdx = Math.max(0,Math.min(this.laneCount-1,laneIdx));
    const laneWidth = this.width / this.laneCount;
    return laneWidth/2 +  lerp(this.left, this.right, laneIdx / this.laneCount);
  }
}