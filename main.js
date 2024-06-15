async function start({
  carHeight, carWidth, carMaxSpeed, carType, alpha, intermediates, lanes,
  sensorLength, sensorRays, sensorSpread, carCanvasWidth, networkCanvasWidth,
  bestBrain, numberCars, carColor
}
) {
  const intermediate_neurons = intermediates
    .split(",")
    .map((num) => parseInt(num, 10));
  const carCanvas = document.getElementById("carCanvas");
  carCanvas.width = carCanvasWidth;
  const networkCanvas = document.getElementById("networkCanvas");
  networkCanvas.width = networkCanvasWidth;
  const scoreCanvas = document.getElementById("scoreCanvas");
  scoreCanvas.width = 170;
  scoreCanvas.height = 200;

  const carCtx = carCanvas.getContext("2d");
  const networkCtx = networkCanvas.getContext("2d");
  const scoreCtx = scoreCanvas.getContext("2d");
  const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, lanes);
  const score = new Counter();

  const N = numberCars;
  let cars = [],
    traffic = [],
    bestCar;
  const max_traffic_Cars = 7;
  let countofUndamaged = N;
  let maxScore = 0.0;

  if (bestBrain) await loadBestBrain();
  else discardorKeepPrevBrain([sensorRays, ...intermediate_neurons]);

  function init() {
    cars = generate_cars(N); //x,y,width,height
    traffic = [
      new Car(road.get_lane_center(getRandom(lanes)), 0, carWidth, carHeight, "DUMMY", 2, getRandomColor2(colors[carColor])),
      new Car(road.get_lane_center(getRandom(lanes)), -200, carWidth, carHeight, "DUMMY", 2, getRandomColor2(colors[carColor])),
      new Car(road.get_lane_center(getRandom(lanes)), -200, carWidth, carHeight, "DUMMY", 2, getRandomColor2(colors[carColor])),
      new Car(road.get_lane_center(getRandom(lanes)), -500, carWidth, carHeight, "DUMMY", 2, getRandomColor2(colors[carColor])),
      new Car(road.get_lane_center(getRandom(lanes)), -500, carWidth, carHeight, "DUMMY", 2, getRandomColor2(colors[carColor])),
      new Car(road.get_lane_center(getRandom(lanes)), -700, carWidth, carHeight, "DUMMY", 2, getRandomColor2(colors[carColor])),
      new Car(road.get_lane_center(getRandom(lanes)), -700, carWidth, carHeight, "DUMMY", 2, getRandomColor2(colors[carColor]))
    ];
    

    function generate_cars(N) {
      const cars = [];
      for (let i = 1; i <= N; i++)
        cars.push(
          new Car(road.get_lane_center(1), 100, carWidth, carHeight, carType, carMaxSpeed, carColor, sensorLength, sensorRays, sensorSpread, intermediate_neurons)
        );
      return cars;
    }
    bestCar = cars[0];

    if (localStorage.getItem("Brain")) {
      cars.forEach((car, i) => {
        car.brain = JSON.parse(localStorage.getItem("Brain"));
        if (i != 0) NeuralNetwrok.mutate(car.brain, alpha);
      });
    }

    if (localStorage.getItem("maxScore")) {
      maxScore = Number(localStorage.getItem("maxScore"));
    }
  }

  init();
  //The request animation frame also gives the time as parameter

  function savehighScore() {
    localStorage.setItem("maxScore", maxScore);
  }
  
  let flag = 1;
  let firstTIme = 1;
  let animationId = 1;
  const scale = 0.0762 / 250;

  function animate(time) {
    traffic = traffic.filter((traf) => traf.y < bestCar.y + 400);
    while (traffic.length < max_traffic_Cars) {
      let i = 200;
      // Generate new traffic car
      const laneIndex = Math.floor(Math.random() * road.laneCount); // Random lane index
      const laneCenter = road.get_lane_center(laneIndex);
      const mainCar = bestCar; // Assuming the main car is at index 0
      const newTrafficCar = new Car(
        laneCenter,
        mainCar.y - carCanvas.height - i, // Start above the main car, adjust the value as needed
        30,
        50,
        "DUMMY",
        2,
        getRandomColor2(colors[carColor])
      );
      traffic.push(newTrafficCar);
      i += 400;
    }
    traffic.forEach((traf) => {
      traf.update(road.borders, []);
    });

    cars.forEach((car) => car.update(road.borders, traffic));
    countofUndamaged = cars.reduce((cnt, cur) => cnt + !cur.damaged, 0);
    if (countofUndamaged == 0) pauseAnimation("Reset");

    const maxHt = cars.reduce((minn, cur) => Math.min(cur.y, minn), Infinity);
    bestCar = cars.find((car) => car.y == maxHt);

    carCanvas.height = window.innerHeight; //by resetting height each time, the previous drawn rectangle also gets cleared
    networkCanvas.height = window.innerHeight; //by resetting height each time, the previous drawn rectangle also gets cleared
    scoreCtx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7); //translate the canvas so that the road moves but not the car, like a drone camera following the car
    road.draw(carCtx);
    traffic.forEach((traf) => traf.draw(carCtx));
    carCtx.globalAlpha = 0.2;
    cars.forEach((car) => car.draw(carCtx, car == bestCar));

    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, true);

    carCtx.restore();
    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwrok(networkCtx, bestCar.brain);
    const distance = round(scale * (-bestCar.y + 100), 2);
    if (distance > maxScore) {
      savehighScore();
      maxScore = distance;
    }
    score.draw(scoreCtx, distance, maxScore);
    if (flag) return;
    if (firstTIme == 0) animationId = requestAnimationFrame(animate);
  }
  // setInterval(animate,1000/60);//can use setInterval or requestAnimationFrame to animate

  animate();
  firstTIme = 0;
  function startAnimation() {
    flag = false;
    overlay.style.display = "none";
    animate();
  }

  function pauseAnimation(type = "") {
    if (type) isEnterPressed = !isEnterPressed;
    flag = true;
    overlay.style.display = "flex";
    mediaTitle.textContent = type ? "LOST" : "PAUSED";
    mediaMessage.innerHTML = type
      ? "Press R to restart. <br> Press I for Input."
      : "Press Enter to Resume. <br> Press R for restart. <br> Press I for entering inputs";
  }

  function reset() {
    // flag = 1;
    cancelAnimationFrame(animationId);
    overlay.style.display = "none";
    init();
    flag = false;
    animate();
  }
  document.addEventListener("keydown", handlekeyPress);

  let isEnterPressed = true;
  function handlekeyPress(e) {
    if (e.key == "Enter" && countofUndamaged) {
      isEnterPressed = !isEnterPressed;
      mediaTitle.textContent = "PAUSED";
      mediaMessage.innerHTML =
        "Press Enter to Resume. <br> Press R for restart. <br> Press I for entering inputs";
      if (!flag) pauseAnimation();
      else startAnimation();
    }
    if (isEnterPressed && e.key == "r" && mediaTitle.textContent != "START") {
      reset();
      isEnterPressed = !isEnterPressed;
    }
    if (isEnterPressed && e.key === "i") {
      switchToInput();
    }
  }

  function switchToInput() {
    document.removeEventListener("keydown", handlekeyPress);
    overlay.style.display = "none";
    document.querySelector("form").classList.remove("hidden");
    document.querySelector("#overlay").classList.add("hidden");
    document.querySelector("#canvas").classList.add("hidden");
    document.querySelector("body").classList.add("padding");
  }
  function save() {
    localStorage.setItem("Brain", JSON.stringify(bestCar.brain));
  }
  saveBtn.addEventListener('click',save);
}


function discard() {
  localStorage.removeItem("Brain");
}

function switchBackToCanvas(inputs) {
  document.querySelector("form").classList.add("hidden");
  document.querySelector("#overlay").classList.remove("hidden");
  document.querySelector("#canvas").classList.remove("hidden");
  document.querySelector("body").classList.remove("padding");
  start(inputs);
  overlay.style.display = "flex";
  mediaMessage.innerHTML = "Press Enter to start.<br> Press I for Input.";
  mediaTitle.textContent = "START";
}

//If the inputs are lready saved in localstorage, than dont show the inputs page
const res = getInputsFromLocal();
if (res !== -1) {
  switchBackToCanvas(res);
}

async function loadBestBrain() {
  try {
    const response = await fetch("best_brain.json");
    const data = await response.json();
    const { levels } = data;
    localStorage.setItem("Brain", JSON.stringify({ levels: levels }));
    // Continue with further processing or return the data
  } catch (error) {
    console.error("Error:", error);
  }
}

function discardorKeepPrevBrain(curentInterMediateNeurons) {
  if (localStorage.getItem("Brain")) {
    const {levels} = JSON.parse(localStorage.getItem('Brain'));
    if(levels.length!==curentInterMediateNeurons.length)
      discard();
    else{
      for(let i = 0;i<levels.length;i++)
      if(curentInterMediateNeurons[i]!==levels[i].inputs.length){
        discard();
        break;
      }
    }
  }
}
