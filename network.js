class NeuralNetwrok {
  constructor(neuralCounts) {
    this.levels = new Array(neuralCounts.length - 1);
    for (let i = 1; i < neuralCounts.length; i++)
      this.levels[i - 1] = new Level(neuralCounts[i - 1], neuralCounts[i]);
  }
  static feedForward(givenInputs, network) {
    for (let i = 0; i < givenInputs.length; i++)
      network.levels[0].inputs[i] = givenInputs[i];
    let output = Level.feedForward(givenInputs, network.levels[0]);
    for (let i = 1; i < network.levels.length; i++) {
      output = Level.feedForward(
        output,
        network.levels[i],
        i == network.levels.length - 1
      );
    }
    return output;
  }

  static mutate(netwrok, amount = 1) {
    netwrok.levels.forEach((level) => {
      level.weights.forEach((row) => {
        row.forEach((weight, i) => {
          row[i] = lerp(weight, Math.random() * 2 - 1, amount);
        });
      });
      level.biases.forEach((bias, i) => {
        level.biases[i] = lerp(bias, Math.random() * 2 - 1, amount);
      });
    });
  }
}

class Level {
  constructor(inputCount, outputCount) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount);
    this.weights = new Array(inputCount);
    for (let i = 0; i < inputCount; i++)
      this.weights[i] = new Array(outputCount);
    Level.#randomize(this);
  }
  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++)
      for (let j = 0; j < level.outputs.length; j++)
        level.weights[i][j] = Math.random() * 2 - 1;
    for (let i = 0; i < level.outputs.length; i++)
      level.biases[i] = Math.random() * 2 - 1;
  }
  static feedForward(givenInputs, level, last = false) {
    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++)
        sum += givenInputs[j] * level.weights[j][i];
      if (last) level.outputs[i] = sum + level.biases[i] > 0 ? 1 : 0;
      else {
        let activation = LreLU(sum + level.biases[i]);
        level.outputs[i] = activation;
      }
    }
    return level.outputs;
  }
}
