const carHeght = document.getElementById("carHeight");
const carWidth = document.getElementById("carWidth");
const carMaxSpeed = document.getElementById("carMaxSpeed");

const networkAlpha = document.getElementById("alpha");
const networkIntermediates = document.getElementById("intermediates");

const roadLanes = document.getElementById("lanes");

const sensorLength = document.getElementById("sensorLength");
const sensorRays = document.getElementById("sensorRays");
const sensorSpread = document.getElementById("sensorSpread");
const carCanvasWidth = document.getElementById("carCanvasWidth");

const localStorageVars = ["numberCars","alpha","sensorSpread","intermediates","carType","lanes",
                          "networkCanvasWidth","sensorLength","sensorRays","carCanvasWidth",
                          "bestBrain","carHeight","carWidth","carMaxSpeed","carColor"
                        ];

function loadValuesFromJson() {
  fetch("best_config.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // Do something with the loaded JSON data
      carHeght.value = jsonData.car.height;
      carWidth.value = jsonData.car.width;
      carMaxSpeed.value = jsonData.car.maxSpeed;

      networkIntermediates.value =
        jsonData.network.intermediate_neurons;

      roadLanes.value = jsonData.road.laneCount;

      sensorLength.value = jsonData.sensor.length;
      sensorRays.value = jsonData.sensor.rayCount;
      sensorSpread.value = jsonData.sensor.raySpread;

      carCanvasWidth.value = 200;

      document.getElementById("networkCanvasWidth").value = 300;
    })
    .catch((error) => {
      // Handle any errors that occur during the fetch
      console.error("Error:", error);
    });
  // Assign values from JSON to form fields
}

function handleBestConfigChange() {
  const bestConfigCheckbox = document.getElementById("bestConfig");
  if (bestConfigCheckbox.checked) {
    loadValuesFromJson();
  }
}

function handleBestBrain() {
  const bestBrainCheckbox = document.getElementById("bestBrain");
  if (bestBrainCheckbox.checked) {
    fetch("best_config.json")
    .then((response) => response.json())
    .then((jsonData) => {
      document.getElementById("sensorRays").value = jsonData.sensor.rayCount;
      document.getElementById("intermediates").value =
        jsonData.network.intermediate_neurons;
    })
  }
  networkIntermediates.disabled = bestBrainCheckbox.checked;
  sensorRays.disabled = bestBrainCheckbox.checked;
}
function submitHandler(e) {
  e.preventDefault();
  try {
    localStorageVars.forEach(localVar => {
      if (localVar!='carType' && localVar!='bestBrain' && localVar!='carColor' && localVar!='intermediates')
      localStorage.setItem(localVar,JSON.stringify(Number(document.getElementById(localVar).value)))
      else if(localVar!='bestBrain')
      localStorage.setItem(localVar,JSON.stringify(document.getElementById(localVar).value))
      else
      localStorage.setItem(localVar,JSON.stringify(document.getElementById(localVar).checked))
    
    });
    switchBackToCanvas(getInputsFromLocal());
  } catch (error) {
    console.error("Error:", error);
  }
}

function inputsChangeHandler(){
  const bestConfigCheckbox = document.getElementById("bestConfig");
  bestConfigCheckbox.checked = false;
}

carHeght.addEventListener("change", inputsChangeHandler);
carWidth.addEventListener("change", inputsChangeHandler);
carMaxSpeed.addEventListener("change", inputsChangeHandler);

networkIntermediates.addEventListener("change", inputsChangeHandler);

roadLanes.addEventListener("change", inputsChangeHandler);

sensorLength.addEventListener("change", inputsChangeHandler);
sensorRays.addEventListener("change", inputsChangeHandler);
sensorSpread.addEventListener("change", inputsChangeHandler);
carCanvasWidth.addEventListener("change", inputsChangeHandler);

function getInputsFromLocal() {
  let isundefined = false;
  localStorageVars.forEach(localVar => {
    if(localStorage.getItem(localVar)===null) isundefined = true;
    else {
      if(localVar!='bestBrain')
      document.getElementById(localVar).value = JSON.parse(localStorage.getItem(localVar));
      else
      document.getElementById(localVar).checked = JSON.parse(localStorage.getItem(localVar));}
  });
  if(isundefined) return -1;

  const obj = localStorageVars.reduce((acc, key) => {
    acc[key] = JSON.parse(localStorage.getItem(key)); // Get value from localStorage
    return acc;
  }, {});

  return obj;
}

//different colors hue value so that they can be excluded for traffic
const colors = {
  red: 0,
  green: 100,
  blue: 240,
  yellow: 60,
  orange: 30,
  purple: 300,
  pink: 330,
  brown: 30,
};

clearBtn.addEventListener("click", function(){
  let form = document.querySelector("form");
  form.reset();
  const preservedVariable = localStorage.getItem('maxScore');
  localStorage.clear();
  localStorage.setItem('maxScore',preservedVariable);
});