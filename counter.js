class Counter {
  constructor(maxLimit = 999.99, digitSize = 20, digitSpacing = 2, font = "bold 15px Arial") {
    this.maxLimit = 999.99;
    this.digitSize = 20;
    this.digitSpacing = 2;
    this.font = "bold 15px Arial";
  }
  #drawDigit(ctx,x, y, digit) {
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, this.digitSize, this.digitSize);
    ctx.fillStyle = "white";
    ctx.font = this.font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(digit, x + this.digitSize / 2, y + this.digitSize / 2);
  }
  #drawNumber(ctx, number, startX, startY, label) {
    const numberString = number.toFixed(2).toString().padStart(6, "0");
    const digitCount = numberString.length;

    const totalWidth = digitCount * (this.digitSize + this.digitSpacing) - this.digitSpacing;

    // Draw the label
    ctx.fillStyle = "black";
    ctx.font = this.font;
    ctx.textAlign = "center";
    ctx.fillText(label, startX + totalWidth / 2, startY - 10);

    for (let i = 0; i < digitCount; i++) {
      const x = startX + i * (this.digitSize + this.digitSpacing);
      const y = startY;

      this.#drawDigit(ctx,x, y, numberString[i]);
    }
  }

  draw(ctx,number,maxNumber){
      this.#drawNumber(ctx,maxNumber,20,50,"Max Score");
      this.#drawNumber(ctx,number,20,120,"Score");
  }
}
