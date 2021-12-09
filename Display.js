export const Display = function(canvas, world) {
  this.bufferCanvas = document.createElement("canvas");
  this.bufferCanvas.width = world.width;
  this.bufferCanvas.height = world.height;
  this.buffer = this.bufferCanvas.getContext("2d");
  this.buffer.imageSmoothingEnabled = false;

  /*
  this.buffer.shadowOffsetX = 15;
  this.buffer.shadowOffsetY = 5;
  this.buffer.shadowBlur = 15;
  this.buffer.shadowColor = 'rgba(255, 255, 255, 0.5)';
  */

  this.context = canvas.getContext("2d");
  this.context.imageSmoothingEnabled = false;

  this.clear = function() {
    this.buffer.fillStyle = 'black';
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
    //this.context.imageSmoothingEnabled = false;
  }

  this.drawObject = function(image, source_x, source_y, destination_x, destination_y, width, height) {
    this.buffer.drawImage(image, source_x, source_y, width, height, Math.round(destination_x), Math.round(destination_y), width, height);
  };
  this.drawImage = function(image, source_x, source_y, source_width, source_height, destination_x, destination_y, destination_width, destination_height) {
    this.buffer.drawImage(image, source_x, source_y, source_width, source_height, Math.round(destination_x), Math.round(destination_y), destination_width, destination_height);
  };
  this.drawSprite  = function(obj) {
    const sprite = obj.sprite;
    //let sY = sprite.y + obj.frameIndex * (sprite.sHeight + 1);
    let sY = sprite.y + sprite.frames[obj.frameIndex] * (sprite.sHeight + 1);
    this.buffer.drawImage(sprite.spriteSheet, sprite.x, sY, sprite.sWidth, sprite.sHeight, Math.round(obj.x), Math.round(obj.y), sprite.dWidth, sprite.dHeight);
  };

  this.drawDisk = function(disk) {
    this.buffer.beginPath();
    this.buffer.arc(disk.x, disk.y, disk.radius, 0, 2 * Math.PI, true);
    this.buffer.closePath();
    this.buffer.lineWidth = 1;
    this.buffer.fillStyle = disk.color;
    this.buffer.fill();
  };

  this.drawBox = function(box) {
    this.buffer.fillStyle = box.color;
    this.buffer.fillRect(Math.floor(0.5 + box.x), Math.floor(0.5 + box.y), Math.floor(0.5 + box.width), Math.floor(0.5 + box.height));
  };

  this.drawRectangle = function(box) {
    this.buffer.strokeStyle = box.color;
    this.buffer.strokeRect(Math.floor(0.5 + box.x), Math.floor(0.5 + box.y), Math.floor(0.5 + box.width), Math.floor(0.5 + box.height));
  };

  this.drawText = function(text) {
    this.buffer.fillStyle = text.fillStyle;
    this.buffer.font = (text.bold ? 'bold ' : '') + text.size + 'px ' + text.font;
    const width = this.buffer.measureText(text.text).width;
    //this.buffer.fillText(text.text, (text.x - (text.centerAligned ? width / 2 : 0)), (text.y + text.size));
    this.buffer.textBaseline = 'top';
    this.buffer.fillText(text.text, (text.x - (text.centerAligned ? width / 2 : 0)), text.y);

    /* Java
    paint = new Paint();
    paint.setColor(Color.RED);
    int fontSize = 20;
    paint.setTextSize(fontSize);
    Typeface tf = Typeface.create("FONT_NAME", Typeface.BOLD);
    paint.setTypeface(tf);
    paint.setTextAlign(Align.LEFT);
    canvas.drawText("your_text", 0, (0+paint.getTextSize()), paint);
    */
  };
};

Display.prototype = {
  constructor: Display,
  render: function() {
    this.bufferCanvas.style.imageRendering = false;
    this.context.imageSmoothingEnabled = false;
    this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height);
  }
};
