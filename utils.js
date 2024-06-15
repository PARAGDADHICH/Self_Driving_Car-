// Linear interpolatin from a to b by t like using the python range function
function lerp(a, b, t) {
  return a + (b - a) * t;
}

//THe explanation of the intersection function is done in a project in the same directory as this one
function intersection(A, B, C, D) {
  const uTop = (A.x - C.x) * (B.y - A.y) - (B.x - A.x) * (A.y - C.y);
  const tTop = (D.y - C.y) * (A.x - C.x) - (D.x - C.x) * (A.y - C.y);
  const bottom = (B.y - A.y) * (D.x - C.x) - (B.x - A.x) * (D.y - C.y);
  if (bottom != 0) {
    const u = uTop / bottom;
    const t = tTop / bottom;
    if (0 <= u && u <= 1 && 0 <= t && t <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }
  return null;
}

//utility function to fund whether one polygon intersects with another
function polyIntersect(poly1,poly2){
  for(let i=0;i<poly1.length;i++){
    for(let j=0;j<poly2.length;j++){
      if(intersection(poly1[i],poly1[(i+1)%(poly1.length)],poly2[j],poly2[(j+1)%(poly2.length)]))
        return true;
    }
  }
  return 0;
}

function getRGBA(value){
  const alpha = Math.abs(value);
  const B = value<0?255:0;
  const G = 255;
  const R = value>0?255:0;
  return `rgba(${R},${G},${B},${alpha})`;
}

function getRandomColor(){
  const hue = 290 + Math.random()*260;//gives all hues which can make any color other than blue, as our main color is blue
  return `hsl(${hue}, 100%,60%)`;
}

function getRandomColor2(excludeColor) {
  let hue = excludeColor+40 + Math.random()*260;
  return `hsl(${hue}, 100%, 60%)`;
}


function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function relu(x) {
  return Math.max(0, x);
}

function LreLU(x) {
  return x < 0 ? 0.01 * x : x;
}

function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function getRandom(n){
  return Math.floor(Math.random() * n);
}