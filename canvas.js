/***
 * @param {object} ctx canvas context 
 * @param {string} color of the pause 
 */
const pauseButton = (ctx, color) => {
    // create a white rectangle to avoid overlays.
    ctx.rect(400, 100, 40, 40); 
    ctx.fillStyle = "white";
    ctx.fill();
    // create two line strokes for pause button.
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(410, 110);
    ctx.lineTo(410, 140);
    ctx.stroke();
    ctx.moveTo(430, 110);
    ctx.lineTo(430, 140);
    ctx.stroke();
  };

/***
 * @param {object} ctx canvas context 
 * @param {string} color of the pause 
 */
const playButton = (ctx, color) => {
    // create a white rectangle to avoid overlays.
    ctx.rect(400, 100, 40, 40);
    ctx.fillStyle = "white";
    ctx.fill();
    // create a triangle for play button
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(410, 110);
    ctx.lineTo(410, 140);
    ctx.lineTo(440, 130);
    ctx.fill();
  };

// utility function to draw line segment in the audio waveform 
/***
 * @param {object} ctx canvas context 
 * @param {string} color of the pause 
 * @param {number} x to represent the point in x axis on the canvas
 * @param {number} height height of the segment
 * @param {number} isEven is the segment upward or downward faing
 */
const drawLineSegment = (ctx, x, height, isEven, color) => {
    ctx.lineWidth = 3; // how thick the line is
    ctx.strokeStyle = color; // what color our line is
    ctx.beginPath(); // starts a new path by emptying the list of sub-paths. Call this when you want to create a new path.
    height = isEven ? height : -height;
    isEven ? ctx.moveTo(x, -10) : ctx.moveTo(x, 10); //begins a new sub-path at the point specified
    ctx.lineTo(x, height); // draws a line to the cordinates specified
    ctx.stroke(); // outline the path
  };

// utility function to draw tags ove the waveform
/***
 * @param {object} ctx canvas context 
 * @param {string} color of the pause 
 * @param {number} x to represent the point in x axis on the canvas
 * @param {number} height height of the segment
 * @param {number} text to display
 * @param {number} tagWidth width of the tag 
 * @param {number} tagX to represent the starting cordinate in the X axis
 * @param {number} tagY to represent the starting cordinate in the X axis
 */
const drawntags = (ctx, color, tagX, tagY, x, height, text = "", tagWidth) => {
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.beginPath();
    // create the circle
    ctx.moveTo(tagX, tagY);
    ctx.arc(tagX, tagY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    // create the line
    ctx.moveTo(tagX, tagY);
    ctx.lineTo(x, height - 10);
    ctx.stroke();
    // create the rectangle part of the tag.
    ctx.rect(x - 15, height - 10, tagWidth, 15);
    ctx.fill();
    ctx.font = "10px serif";
    ctx.fillStyle = "white";
    ctx.moveTo(tagX-10,tagY-10);
    ctx.fillText(text, x - 10, height + 1);
  };

// hander to draw the tags 
/***
 * @param {object} ctx canvas context 
 * @param {number} width canvas width
 * @param {array} normalizedData audio data to create waveform normalized using the normalizeData function  
 */
const drawTagsHandler = (ctx, width, normalizedData) => {
    for (let i = 0; i < normalizedData.length; i++) {
      const x = width * i;
      if (i === 8) {
        drawntags(ctx, "blue", x, -5, x, -50, "introduction", 60);
      }
      if (i === 30) {
        drawntags(ctx, "lightgreen", x, -5, x, -60, "one_six", 45);
      }
      if (i === 123) {
        drawntags(ctx, "grey", x, -5, x, -58,'legal', 30);
      }
      if (i === 125) {
        drawntags(ctx, "cyan", x, -5, x, -60, "Rapport Building - Empathy", 130);
      }
      if (i === 130) {
        drawntags(ctx, "brown", x, -5, x, -40, "Rapport Building - Energy",120);
      }
      if (i === 145) {
        drawntags(ctx, "green", x, -5, x, -30, "Polite", 60);
      }
    }
  };

  export {pauseButton, playButton, drawLineSegment, drawTagsHandler}