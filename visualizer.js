class Visualizer {
  static drawNetwrok(ctx, netwrok) {
    const margin = 50;
    let top = margin;
    const left = margin;
    const height = ctx.canvas.height - margin * 2;
    const width = ctx.canvas.width - margin * 2;
    const numLevels = netwrok.levels.length;
    const htPerLev = height / numLevels;
    for (let i = numLevels - 1; i >= 0; i--) {
      //drawing in reverse, so that biases drawn on intermediate levels dont get over-written by input nodes drawn later on the same
      ctx.setLineDash([7,3]);//for showing the dashed lines
      Visualizer.drawLevel(
        ctx,
        netwrok.levels[i],
        left,
        top,
        width,
        htPerLev,
        i == numLevels - 1 ? ["←", "→", "↑", "↓"] : []
      );
      top += htPerLev;
    }
    // console.log(htPerLev);
    // console.log(lerp(0,250,(i+1)/(car.brain.levels.length)))
  }
  static drawLevel(ctx, level, left, top, width, height, labels) {
    const { inputs, outputs, weights, biases } = level;
    const radius = 18;

    for (let i = 0; i < inputs.length; i++)
      for (let j = 0; j < outputs.length; j++) {
        const x1 = this.#getNodeX(inputs.length, i, left, left + width);
        const x2 = this.#getNodeX(outputs.length, j, left, left + width);
        const y1 = top + height;
        const y2 = top;
        Visualizer.drawConnection(ctx, x1, y1, x2, y2, getRGBA(weights[i][j]));
      }

    for (let i = 0; i < inputs.length; i++) {
      const x = this.#getNodeX(inputs.length, i, left, left + width);
      Visualizer.drawNode(ctx, x, top + height, radius, "black");
      Visualizer.drawNode(
        ctx,
        x,
        top + height,
        radius * 0.6,
        getRGBA(inputs[i])
      );
    }
    for (let i = 0; i < outputs.length; i++) {
      const x = lerp(left, left + width, i / (outputs.length - 1));
      Visualizer.drawNode(ctx, x, top, radius, "black");
      Visualizer.drawNode(ctx, x, top, radius * 0.6, getRGBA(outputs[i]));
      if (labels.length > 0) {
        ctx.beginPath();
        ctx.font = "20px Arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 1.5;
        ctx.strokeText(labels[i], x,top);

        // Draw the arrow inside
        ctx.fillStyle = "black";
        ctx.font = "bold 20px Arial";
        ctx.fillText(labels[i], x, top);
      }
      Visualizer.drawNode(ctx, x, top, radius, getRGBA(biases[i]), true);
    }
  }

  static drawConnection(ctx, x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
  }

  static #getNodeX(nodes, index, left, right) {
    return lerp(left, right, nodes == 1 ? 0.5 : index / (nodes - 1));
  }

  static drawNode(ctx, x, y, radius, color, dash = null) {
    ctx.beginPath();
    if (dash) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
    } else ctx.fillStyle = color;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    if (dash) ctx.stroke();
    else ctx.fill();
    ctx.setLineDash([]);
    ctx.closePath();
  }
}
