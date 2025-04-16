//dataset: pulled museum images from publicly available museum websites. 18 Rouen cathedral paintings and the associated museum data
//performed k-means color palette extraction to find the 10 dominant colors and pixels grouped towards each cluter
//performed LLE on a dataset of color proportions to group the images by their proportions of dominant colors (example: 40% blue with 20% brown)
//This is part of my senior thesis work on reimagining Impressionist color through statistics

//Who is your audience: art historians and general art/museum lovers
//Where are they before they see your piece: hopefully they have some exposure to Monet's paintings and have maybe even seen the cathedral paintings before
//Where are they after: I hope they have a greater appreciation and statistical understanding of the color in these paintings. Also the power of digital methods to present art!

//themes in class I tried to cover: interactivity, multiple viewpoints, datagrid, color, typography/layout
//used chatgpt for some of the animation work

let myFont;
let click = false;
let transitionFactor = 0; // New variable for smooth transitions
let transitionX, transitionY; // Variables for interpolated positions
let space = false;
let radiusGrowth = 0; // New variable for radius growth animation
let imagescale = 0;
let special_k = -1;

//load in all of the datasets and images, as well as font
function preload() {
	coordinates = loadTable("coordinates.csv", "csv", "header").getRows();
	rouen_colors = loadTable("rouen_colors.csv", "csv", "header").getRows();
	rouen_prop = loadTable("rouen_colors_prop.csv", "csv", "header").getRows();
	museums = loadTable("rouen_museum.csv", "csv", "header").getRows();
	names = loadTable("rouen_names.csv", "csv", "header").getRows();
	myFont = loadFont('Butler_Regular.otf');
	rouen_1 = loadImage('rouen_1.jpg');
	rouen_2 = loadImage('rouen_2.jpg');
	rouen_3 = loadImage('rouen_3.jpg');
	rouen_4 = loadImage('rouen_4.jpg');
	rouen_5 = loadImage('rouen_5.jpg');
	rouen_6 = loadImage('rouen_6.jpg');
	rouen_7 = loadImage('rouen_7.jpg');
	rouen_8 = loadImage('rouen_8.jpg');
	rouen_9 = loadImage('rouen_9.jpg');
	rouen_10 = loadImage('rouen_10.jpg');
	rouen_11 = loadImage('rouen_11.jpg');
	rouen_12 = loadImage('rouen_12.jpg');
	rouen_13 = loadImage('rouen_13.jpg');
	rouen_14 = loadImage('rouen_14.jpg');
	rouen_15 = loadImage('rouen_15.jpg');
	rouen_16 = loadImage('rouen_16.jpg');
	rouen_17 = loadImage('rouen_17.jpg');
	rouen_18 = loadImage('rouen_18.jpg');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	background(255, 255, 255);
	textFont(myFont);
	//working on the text and legend
	leftpanel();
	homeview();
	//print(rouen_colors);
	//print(rouen_colors[1].getNum('cluster1r'));
	let buttonposy = windowHeight*1.7/3;
	let buttonposx1 = width*18/250;
	let buttonposx2 = width*42/250;
}

//draw function checks for states continuously and calls functions to draw them
function draw() {
	leftpanel();
	// Update transition factor
  updateTransitionFactor();

  // Draw the transition elements using interpolation
  drawTransitionElements();

  if (space && !click && transitionFactor >= 0) {
    // Increase radius growth up to 1
    radiusGrowth = min(radiusGrowth + 0.025, 0.6);
		//opacity = min(opacity + 5, 255);
  } else if (!space && radiusGrowth > 0) {
    // Decrease radius growth to 0
    radiusGrowth = max(radiusGrowth - 1, 0);
		//opacity = max(opacity - 5, 0);
  }
	if (space && click && transitionFactor >= 0) {
    // Increase radius growth up to 1
    radiusGrowth = min(radiusGrowth + 0.025, 0.6);
		//opacity = min(opacity + 5, 255);
  } else if (!space && radiusGrowth > 0) {
    // Decrease radius growth to 0
		radiusGrowth = max(radiusGrowth - 1, 0);
		//opacity = min(opacity - 5, 0);
  }
	
  if (click == false && !space && transitionFactor > 0) {
    homeview();
  } else if (!click && !space && transitionFactor == 0) {
    homeview();
  } else if (click == true && space == false) {
    mappingimages();
  }

  if (space == true && !click && transitionFactor > 0) {
    colorview();
  } else if (space && !click && transitionFactor == 0) {
    colorview();
  } else if (space == true && click == true) {
    mapping_color();
  }
}

//create the axes
function xaxis() {
	strokeWeight(2);
	stroke(130, 130, 136);
	line(width*28/100, height*9.4/10, width*95/100, height*9.4/10);
	let numTicksX = 8; // Number of ticks on the X-axis
  for (let i = 0; i <= numTicksX; i++) {
		let x = map(i, 0, numTicksX, width * 28 / 100, width * 95 / 100);
		stroke(130, 130, 136, 20);
		line(x, height*9.4/10, x, height*1/25 - 10);
		stroke(130, 130, 136, 50);
    strokeWeight(2);
    line(x, height * 9.4 / 10 - 5, x, height * 9.4 / 10 + 5);
    textSize(15);
  }
	fill(255)
	noStroke();
	rect(width*((95-28)/2+28)/100, height*9.4/10, width/15, height/60)
	fill(130, 130, 136);
	noStroke();
	textSize(20);
	//strokeWeight(0);
	text("Lightness", width*((95-28)/2+28)/100, height*9.39/10);
}

function yaxis() {
	fill(130, 130, 136)
	stroke(130, 130, 136);
	strokeWeight(2);
	line(width*28/100, height*9.4/10, width*28/100, height*1/25);
	let numTicksY = 8; // Number of ticks on the Y-axis
  for (let i = 1; i <= numTicksY; i++) {
    let y = map(i, 0, numTicksY, height * 9.4 / 10, height * 1 / 25);
		strokeWeight(1);
		stroke(130, 130, 136, 20);
		line(width * 28 / 100, y, width * 95 / 100 + 10, y);
		strokeWeight(2);
		stroke(130, 130, 136, 50);
    line(width * 28 / 100 - 5, y, width * 28 / 100 + 5, y);
		noStroke();
  }
	fill(255)
	noStroke();
	rect(width*28/100, height*4.8/10, width/60, height/5)
	push();
	translate(width*28/100 - 10, height*4.8/10);
	angleMode(DEGREES);
	rotate(-90);
	fill(130, 130, 136);
	textSize(20);
	strokeWeight(0);
	text("Hue Combinations", 0, 0, 100);
	pop();
}

//create a constant left panel
function leftpanel() {
	textAlign(CENTER, CENTER);
	let buttonposy = windowHeight*1.7/3 + 50;
	let buttonposx1 = width*18/250;
	let buttonposx2 = width * 42 / 250;
	fill(130, 130, 136);
	noStroke();
	rect(width*30/250, height/2, width*60/250, height);
	fill(232, 248, 255);
	textSize(42);
	strokeWeight(0);
	text("Colorful Cathedrals", width*30/250, height*0.6/3, width*1/10);
	textSize(18);
	fill(255)
	text("In 1892, Impressionist painter Claude Monet rented rooms across from the Rouen cathedral and painted the façade, resulting in a series of famous cathedral paintings.", width*30/250, height*1.1/3, width*1/5.2);
	textSize(14);
	fill(230, 230, 236);
	text("Click the buttons below to switch between viewing these paintings in a gallery, their 10 dominant colors, and a mapping by their color palettes.", width*30/250, height*1.6/3, width*1/5);
	textSize(18);
	if (click) {
		text("Map View", buttonposx1, buttonposy, width*1/5);
	} else if (!click) {
		text("Gallery View", buttonposx1, buttonposy, width*1/5);
	}
	if (space) {
		text("Palette View", buttonposx2, buttonposy, width*1/5);
	} else if (!space) {
	text("Painting View", buttonposx2, buttonposy, width*1/5);
	}
	noFill();
	stroke(230, 230, 236);
	strokeWeight(3)
	rect(buttonposx1, buttonposy, width/12, height/20);
	rect(buttonposx2, buttonposy, width/12, height/20);
	noStroke()
	hoverline();
}

//control the transition state of the viz
function drawTransitionElements() {
  // Interpolate positions based on transitionFactor
  let image_width = lerp(width / 10, width / 22, transitionFactor); // Adjust size during transition
  let image_height = image_width * 1.5;
  let homeviewX = width * 15.7 / 25;
  let homeviewY = height / 2;
  let mappingimagesX = width * 16.5 / 25;
  let mappingimagesY = height / 2.6;

  // Use lerp() for smooth transition
  let startX, startY, endX, endY;

  if (click == true) {
    startX = homeviewX;
    startY = homeviewY;
    endX = mappingimagesX;
    endY = mappingimagesY;
  } else if (click == false){
		startX = mappingimagesX;
    startY = mappingimagesY;
    endX = homeviewX;
    endY = homeviewY;
  }

  let transitionX = lerp(startX, endX, transitionFactor);
  let transitionY = lerp(startY, endY, transitionFactor);
}

function updateTransitionFactor() {
  let targetFactor;

  if (click && transitionFactor < 1) {
    // If transitioning to mappingimages
    targetFactor = 1;
  } else if (!click && transitionFactor > 0) {
    // If transitioning to homeview
    targetFactor = 0;
  }

  // Only update if the targetFactor is different
  if (targetFactor !== undefined && transitionFactor !== targetFactor) {
    let direction = click ? 0.01 : -0.01; // Adjust direction based on click
    transitionFactor = constrain(transitionFactor + direction, 0, 1);
  }
}

function mousePressed() {
  let buttonposy = height * 1.7 / 3 + 50;
  let buttonposx1 = width * 18 / 250;
	let buttonposx2 = width * 42 / 250;
  if (mouseX > buttonposx1 - width/23 && mouseX < buttonposx1 + width/23 && mouseY < buttonposy + height/30 && mouseY > buttonposy - height/30) {
    click = !click;
		updateTransitionFactor();
  }
  if (mouseX > buttonposx2 - width/23 && mouseX < buttonposx2 + width/23 && mouseY < buttonposy + height/30 && mouseY > buttonposy - height/30) {
    space = !space;
  }
}

// Modify homeview() and mappingimages() to consider the transition
function homeview() {
  fill(255);
  rect(width * 15.5 / 25, height / 2, width * 19 / 25, height);

  // Interpolate positions based on transitionFactor
  let image_width = lerp(width / 10, width / 22, transitionFactor);
  let image_height = image_width * 1.5;

  // Draw elements during the transition
  imageMode(CENTER);
  let imagegroup = [rouen_1, rouen_2, rouen_3, rouen_4, rouen_5, rouen_6, rouen_7, rouen_8, rouen_9, rouen_10, rouen_11, rouen_12, rouen_13, rouen_14, rouen_15, rouen_16, rouen_17, rouen_18];
  let k = 0;

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 3; j++) {
      let homeX = lerp(width * 4.7 / 25 + width * 18.6 / 25 / 6 * (i + 1), width * 16.5 / 25 + 1050 * float(coordinates[k]['arr'][0]), transitionFactor);
      let homeY = lerp(height / 3 * j + height / 6, height / 2.6 + 600 * float(coordinates[k]['arr'][1]), transitionFactor);

      image(imagegroup[k], homeX, homeY, image_width, image_height);
      if (transitionFactor == 0){
				hovering(homeX, homeY, image_width, image_height, museums, k, rouen_colors);
			}
      k += 1;
    }
  }
}

function mappingimages() {
  fill(255);
  rect(width * 15.7 / 25, height / 2, width * 19 / 25, height);
  xaxis();
  yaxis();

  // Interpolate positions based on transitionFactor
  let image_width = lerp(width / 22, width / 10, 1-transitionFactor);
  let image_height = image_width * 1.5;
  let k = 0;

  // Draw elements during the transition
  imageMode(CENTER);
  let imagegroup = [rouen_1, rouen_2, rouen_3, rouen_4, rouen_5, rouen_6, rouen_7, rouen_8, rouen_9, rouen_10, rouen_11, rouen_12, rouen_13, rouen_14, rouen_15, rouen_16, rouen_17, rouen_18];

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 3; j++) {
      let mappingX = lerp(width * 16.5 / 25 + 1050 * float(coordinates[k]['arr'][0]), width * 4.7 / 25 + width * 18.6 / 25 / 6 * (i + 1), 1-transitionFactor);
      let mappingY = lerp(height / 2.6 + 600 * float(coordinates[k]['arr'][1]), height / 3 * j + height / 6, 1-transitionFactor);

      image(imagegroup[k], mappingX, mappingY, image_width, image_height);
			if (transitionFactor == 1) {
      hovering(mappingX, mappingY, image_width, image_height, museums, k, rouen_colors);
			}
      k += 1;
    }
		if(special_k != -1 && !space && transitionFactor == 1){
			let mappingX = lerp(width * 16.5 / 25 + 1050 * float(coordinates[special_k]['arr'][0]), width * 4.7 / 25 + width * 18.6 / 25 / 6 * (special_k%6 + 1), 1-transitionFactor);
			let mappingY = lerp(height / 2.6 + 600 * float(coordinates[special_k]['arr'][1]), height / 3 * special_k/6 + height / 6, 1-transitionFactor);
			if(mouseX > mappingX - image_width/2 - 5 &&
				mouseX < mappingX + image_width/2 + 5 &&
				mouseY > mappingY - image_height/2 - 5 &&
				mouseY < mappingY + image_height/2 + 5
    	) {
			stroke(color(rouen_colors[special_k]['arr'][0], rouen_colors[special_k]['arr'][1], rouen_colors[special_k]['arr'][2]))
			strokeWeight(5);
			fill(255, 150);
			rect(mappingX, mappingY, image_width + 15, image_height + 15)
			noStroke();
			image(imagegroup[special_k], mappingX, mappingY, image_width, image_height);
			}
		}
  }
	if(transitionFactor == 1){
		textSize(14);
		fill(130, 130, 136);
		textAlign(LEFT, CENTER);
		text("Paintings here appear to favor combinations of desaturated and dark browns", width*9.5/25, height*7.2/10, width/10);
		text("Paintings with lighter color palettes appear towards the right", width*21/25, height*7.5/10, width/10);
		text("Paintings near the top appear to express greater contrast in warm colors and blue skies", width*16.5/25, height*0.6/10, width/5);
	}
}

function colorview() {
  fill(255);
  rect(width * 15.5 / 25, height / 2, width * 18.6 / 25, height);

  // Interpolate positions based on transitionFactor
  let circleSize = lerp(150, 70, transitionFactor);
  let innerSize = lerp(50, 20, transitionFactor);
  let k = 0;

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 3; j++) {
      let homeX = lerp(width * 4.7 / 25 + width * 18.6 / 25 / 6 * (i + 1), width * 16.5 / 25 + 1050 * float(coordinates[k]['arr'][0]), transitionFactor);
      let homeY = lerp(height / 3 * j + height / 6, height / 2.6 + 600 * float(coordinates[k]['arr'][1]), transitionFactor);

      // Adjust circle size based on radius growth
      let animatedCircleSize = circleSize * (0.4 + radiusGrowth);

      pieChart(innerSize, animatedCircleSize, rouen_prop[k], rouen_colors[k], homeX, homeY);

      // Add hovering logic when transition is complete
      if (transitionFactor == 0) {
        hovering(homeX, homeY, animatedCircleSize, animatedCircleSize, museums, k, rouen_colors);
      }
      k += 1;
    }
  }
}

function mapping_color() {
  fill(255);
  rect(width * 15.5 / 25, height / 2, width * 18.6 / 25, height);
	xaxis();
  yaxis();

  // Interpolate positions based on transitionFactor
  let circleSize = lerp(70, 150, 1 - transitionFactor);
	let innerSize = lerp(20, 50, 1 - transitionFactor);
  let k = 0;

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 3; j++) {
      let mappingX = lerp(width * 16.5 / 25 + 1050 * float(coordinates[k]['arr'][0]), width * 4.7 / 25 + width * 18.6 / 25 / 6 * (i + 1), 1 - transitionFactor);
      let mappingY = lerp(height / 2.6 + 600 * float(coordinates[k]['arr'][1]), height / 3 * j + height / 6, 1 - transitionFactor);
			let animatedCircleSize = circleSize * (0.4 + radiusGrowth);

      pieChart(innerSize, animatedCircleSize, rouen_prop[k], rouen_colors[k], mappingX, mappingY);

      // Add hovering logic when transition is complete
      if (transitionFactor == 1) {
        hovering(mappingX, mappingY, animatedCircleSize, animatedCircleSize, museums, k, rouen_colors);
      }
      k += 1;
    }
		if(special_k != -1 && space && transitionFactor == 1){
			let mappingX = lerp(width * 16.5 / 25 + 1050 * float(coordinates[special_k]['arr'][0]), width * 4.7 / 25 + width * 18.6 / 25 / 6 * (special_k%6 + 1), 1-transitionFactor);
			let mappingY = lerp(height / 2.6 + 600 * float(coordinates[special_k]['arr'][1]), height / 3 * special_k/6 + height / 6, 1-transitionFactor);
			if(mouseX > mappingX - circleSize * (0.4 + radiusGrowth)/2 - 5 &&
					mouseX < mappingX + circleSize * (0.4 + radiusGrowth)/2 + 5 &&
					mouseY > mappingY - circleSize * (0.4 + radiusGrowth)/2 - 5 &&
					mouseY < mappingY + circleSize * (0.4 + radiusGrowth)/2 + 5
				) {
			stroke(color(rouen_colors[special_k]['arr'][0], rouen_colors[special_k]['arr'][1], rouen_colors[special_k]['arr'][2]))
			strokeWeight(5);
			fill(255, 150);
			circle(mappingX, mappingY, circleSize * (0.4 + radiusGrowth) + 15)
			noStroke();
      pieChart(innerSize, circleSize, rouen_prop[special_k], rouen_colors[special_k], mappingX, mappingY);
			}
		}
  }
	if(transitionFactor == 1){
		textSize(14);
		fill(130, 130, 136);
		textAlign(LEFT, CENTER);
		text("Palettes here are on average composed of desaturated and dark browns", width*9.5/25, height*7.2/10, width/10);
		text("Combinations of light blues appear in these palettes", width*21/25, height*7.5/10, width/10);
		text("Warm tans or browns and cool blue greys appear in palettes near the top", width*16.5/25, height*0.6/10, width/5);
	}
}

//check if hovering over image or pie chart
function hovering(x,y,image_width, image_height, museums, k, colors){
	if(mouseX > x - image_width/2 - 20 &&
      mouseX < x + image_width/2 + 20 &&
      mouseY > y - image_height/2 - 20 &&
      mouseY < y + image_height/2 + 20 && !click
    ) {
		if (space == true) {
			noFill();
			stroke(color(colors[k]['arr'][0], colors[k]['arr'][1], colors[k]['arr'][2]))
			strokeWeight(5);
			circle(x,y, image_width + 15)
		} else if (space == false) {
			noFill();
			stroke(color(colors[k]['arr'][0], colors[k]['arr'][1], colors[k]['arr'][2]))
			strokeWeight(5);
			rect(x,y, image_width + 15, image_height + 15)
		}
		noStroke();
		fill(255);
		textSize(18);
		rect(width*3/25, height*4/5, width/4.5, height/5.2);
		fill(50, 50, 50);
		text(str(museums[k]['arr'][0]), width*3/25, height*3.7/5, width/5);
		text(str(museums[k]['arr'][3]), width*3/25, height*4.1/5, width/5.5)
		text(str(museums[k]['arr'][1]), width*3/25, height*4.25/5, width/5.5)
		fill(color(colors[k]['arr'][0], colors[k]['arr'][1], colors[k]['arr'][2]))
		rect(width*3/25, height*4.4/5, width/5.5, height/70);
	}
		if(mouseX > x - image_width/2 - 5 &&
      mouseX < x + image_width/2 + 5 &&
      mouseY > y - image_height/2 - 5 &&
      mouseY < y + image_height/2 + 5 && click
    ) {
		if (space == true) {
			noFill();
			stroke(color(colors[k]['arr'][0], colors[k]['arr'][1], colors[k]['arr'][2]))
			strokeWeight(5);
			circle(x,y, image_width + 15)
		} else if (space == false) {
			noFill();
			stroke(color(colors[k]['arr'][0], colors[k]['arr'][1], colors[k]['arr'][2]))
			strokeWeight(5);
			rect(x,y, image_width + 15, image_height + 15)
		}
		noStroke();
		fill(255);
		textSize(18);
		rect(width*3/25, height*4/5, width/4.5, height/5.2);
		fill(50, 50, 50);
		text(str(museums[k]['arr'][0]), width*3/25, height*3.7/5, width/5);
		text(str(museums[k]['arr'][3]), width*3/25, height*4.1/5, width/5.5)
		text(str(museums[k]['arr'][1]), width*3/25, height*4.25/5, width/5.5)
		fill(color(colors[k]['arr'][0], colors[k]['arr'][1], colors[k]['arr'][2]))
		rect(width*3/25, height*4.4/5, width/5.5, height/70);
		special_k = k;
		}
}

//check if hovering over button to change appearance
function hoverline() {
	let buttonposy = height * 1.7 / 3 + 50;
  let buttonposx1 = width * 18 / 250;
	let buttonposx2 = width * 42 / 250;
	textSize(18);
  if (mouseX > buttonposx1 - width/23 && mouseX < buttonposx1 + width/23 && mouseY < buttonposy + height/30 && mouseY > buttonposy - height/30) {
		stroke(230, 230, 236);
		strokeWeight(3)
		fill(230, 230, 236);
		rect(buttonposx1, buttonposy, width/12, height/20);
		noStroke();
		fill(130, 130, 136);
		if (click) {
			text("Gallery View", buttonposx1, buttonposy, width*1/5);
		} else if (!click) {
			text("Map View", buttonposx1, buttonposy, width*1/5);
		}
  }
  if (mouseX > buttonposx2 - width/23 && mouseX < buttonposx2 + width/23 && mouseY < buttonposy + height/30 && mouseY > buttonposy - height/30) {
		stroke(230, 230, 236);
		strokeWeight(3)
		fill(230, 230, 236);
		rect(buttonposx2, buttonposy, width/12, height/20);
		noStroke()
		fill(130, 130, 136);
		if (space) {
			text("Painting View", buttonposx2, buttonposy, width*1/5);
		} else if (!space) {
		text("Palette View", buttonposx2, buttonposy, width*1/5);
		}
  }
}

function pieChart(inner, diameter, data, colors, x, y) {
	noStroke()
	angleMode(DEGREES);
	//print(data['arr'][1]);
	push();
  translate(x, y);
	let color_choice = [];

	let lastAngle = 0;
  for (let i = 0; i < 10; i++) {
		color_choice = color(colors['arr'][i*3], colors['arr'][i*3+1], colors['arr'][i*3+2]);
		fill(color_choice);

    // Calculate the angles
    let angle = float(data['arr'][i])*360;
		//noStroke();
    // Draw the slice
    arc(0, 0, diameter, diameter, lastAngle, lastAngle + angle);
    lastAngle += angle;
  }
	fill(255);
	circle(0,0, inner);
	pop();
}