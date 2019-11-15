var canvasWidth = 1000;
var canvasHeight = 400;
var xmid = canvasWidth / 2;
var ymid = canvasHeight / 2;
var xlen = 0.8 * canvasWidth; // x-axis length
var ylen = 0.8 * canvasHeight; // y-axis length
var amps; // amplitudes
var marked; // the solution state
var iteration = 0; // grover iteration count
var beginPhaseStep = true; // set to true to begin phase inversion
var inPhaseStep = false; // set to true during lerp
var beginMeanStep = false; // true to begin mean inversion
var inMeanStep = false; // set to true during lerp
var prevAmps; // amplitudes from previous step
var drawPrev = false; // draw amps from previous step
var phaseText = false; // display phase inversion text
var meanText = false; // display mean inversion text
var input; // input box
var lerpParam = 0;
var targetStateAmp;

function bar(x, h, w) {
    this.height = h;
    this.width = w;
    this.x = x; // x coordinate of left side of bar
    this.flag = false;
}

function createBars(nStates) {
    var startAmp = 1 / Math.sqrt(nStates);
    var barWidth = 0.9*xlen/nStates
    var barList = [];
    for(var i = 0; i < nStates; ++i) {
  	var newBar = new bar(xmid-xlen/2 + (i+0.05)*xlen/nStates, startAmp, barWidth);
  	barList.push(newBar);
    }
    return barList;
}

function amplitudes(nQ) {
    this.nStates = Math.pow(2,nQ);
    this.bars = createBars(this.nStates);
    this.mean = 1 / Math.sqrt(this.nStates);
    
    this.recalculateMean = function() {
	this.mean = 0;
  	for(var i = 0; i < this.nStates; ++i) {
	    this.mean += this.bars[i].height;
	}
	this.mean = this.mean / this.nStates;
    }
    
    this.drawBars = function(opacity, shift) {
	
  	for(var i = 0; i < this.bars.length; ++i) {
	    strokeWeight(0);
	    if(this.bars[i].flag == true) {
      		fill(50+shift,205+shift,50+shift,opacity);
	    } else {
		fill(0+shift,0+shift,255-shift,opacity);
	    }
	    rect(this.bars[i].x, ymid - this.bars[i].height * ylen/2, this.bars[i].width, this.bars[i].height * ylen/2);
	}
    }
    
    this.drawMean = function() {
    	stroke('red');
	strokeWeight(2);
	line(xmid - xlen/2, ymid - this.mean * (ylen/2), xmid + xlen/2, ymid - this.mean * (ylen/2));
  	
	fill('black')
	textAlign(CENTER)
	strokeWeight(0);
	text('Mean', xmid - xlen/2 - 30, ymid - this.mean * ylen/2 - 7);
	text((amps.mean).toFixed(4), xmid - xlen/2 - 30, ymid - this.mean * ylen/2 + 7);
    }
}

function phaseInversion(s) {
    console.log('Phase Inversion');
    amps.bars[marked].height = lerp(prevAmps.bars[marked].height, -prevAmps.bars[marked].height, s); 
}

function meanInversion(s) {
    console.log('Mean Inversion');
    for(var i = 0; i < amps.bars.length; ++i) {
  	amps.bars[i].height = lerp(prevAmps.bars[i].height, 2*amps.mean - prevAmps.bars[i].height, s);
    }
}

function nextStep() {
    if(beginPhaseStep == true) {
	for(var i = 0; i < amps.nStates; ++i) {
     	    prevAmps.bars[i].height = amps.bars[i].height; 
	}
	targetStateAmp = - prevAmps.bars[marked].height;

	inPhaseStep = true;
	beginPhaseStep = false;
	drawPrev = true;
	iteration += 1;
    } else if (beginMeanStep == true) {
	for(var i = 0; i < amps.nStates; ++i) {
     	    prevAmps.bars[i].height = amps.bars[i].height; 
	}
	targetStateAmp = 2*amps.mean - prevAmps.bars[marked].height;

	inMeanStep = true;
	beginMeanStep = false;
	drawPrev = true; 
	iteration += 1;
    }
}

function setup() {
    
    cnv = createCanvas(canvasWidth, canvasHeight); 
    var cnvx = (windowWidth - width) / 2;
    var cnvy = (windowHeight - height) / 2;
    cnv.position(cnvx, cnvy);
    cnv.parent("canvasDiv");

    input = createInput(2);
    input.parent("canvasDiv");
    input.position(cnvx + 60, cnvy + 5);

    init = createButton('Reset');
    init.parent("canvasDiv")
    init.position(input.x + input.width, input.y);
    init.mouseClicked(function () {
	amps = new amplitudes(input.value());
  	marked = Math.floor(Math.random() * amps.nStates);
  	amps.bars[marked].flag = true;
	prevAmps = new amplitudes(input.value());
  	prevAmps.bars[marked].flag = true;
	targetStateAmp = 1 / Math.sqrt(amps.nStates);
	beginPhaseStep = true;
	beginMeanStep = false;
	inPhaseStep = false;
	inMeanStep = false;
	drawPrev = false;
	lerpParam = 0;
	iteration = 0;
    })
    
    amps = new amplitudes(2);
    marked = Math.floor(Math.random() * amps.nStates);
    amps.bars[marked].flag = true;
    prevAmps = new amplitudes(2);
    prevAmps.bars[marked].flag = true;
    targetStateAmp = 0.5;
    
    iterate = createButton('Iterate');
    iterate.parent("canvasDiv")
    iterate.position(init.x + 60,input.y);
    iterate.mouseClicked(nextStep);

}

function draw() {
    
    background(255);
    stroke(0);
    strokeWeight(3);
    fill('white')
    rect(0,0,width,height);
    
    fill('black');
    stroke(0);
    strokeWeight(0.5);
    textAlign(RIGHT);
    text("Qubits:",53,19);
    textAlign(LEFT);
    text("Grover Iterations: " + iteration/2, 320, 19);
    
    if(inMeanStep == true) {
	meanInversion(lerpParam / 20);
	lerpParam += 1
	if(lerpParam == 21) {
	    inMeanStep = false;
	    beginPhaseStep = true;
	    lerpParam = 0;
	}
    } else if(inPhaseStep == true) {
	phaseInversion(lerpParam / 20);
	lerpParam += 1
	if(lerpParam == 21) {
	    inPhaseStep = false;
	    beginMeanStep = true;
	    lerpParam = 0;

	}
    }
    amps.recalculateMean();    
    amps.drawBars(200,0);
    amps.drawMean();

    if(drawPrev == true) {
	prevAmps.drawBars(25,10);
    }

    strokeWeight(2);
    // Horizontal Axis
    stroke(0);
    line(xmid-xlen/2, ymid, xmid+xlen/2, ymid);
    // Vertical Axis
    line(xmid-xlen/2, ymid-ylen/2, xmid-xlen/2, ymid+ylen/2);
    
//    if(beginPhaseStep == true && iteration > 0) {
//  	amps.drawMean();
//    }



    fill('black')
    strokeWeight(0.5);
    textAlign(RIGHT);
    text('1', xmid-xlen/2-10, ymid-ylen/2+5);
    text('-1', xmid-xlen/2-10, ymid+ylen/2);
    
    stroke(0);
    textAlign(CENTER);
    if(iteration != 0) {
	if(inPhaseStep == true || beginMeanStep == true) {
   	    fill('black')
	    rect(0.48*width, 0.015*height, 0.2*width, 0.05*height);
	    fill('white')
	    text('Phase Inversion', 0.58*width, 0.05*height); 
	} else if (inMeanStep == true || beginPhaseStep == true) {
	    fill('white')
	    stroke(200,0,0)
	    rect(0.48*width, 0.015*height, 0.2*width, 0.05*height);
	    fill(200,0,0)
	    text('Mean Inversion', 0.58*width, 0.05*height);
	}
    }

    stroke(0,0,0,100)
    strokeWeight(1)
    line(xmid-xlen/2, ymid-ylen/2-1, xmid+xlen/2, ymid-ylen/2-1);
    line(xmid-xlen/2, ymid+ylen/2, xmid+xlen/2, ymid+ylen/2);


    noStroke();
    textAlign(LEFT);
    textSize(14);
    fill('black')
    text('Amplitude = ', 0.35*width, 0.965*height);
    text('Probability = ', 0.55*width, 0.965*height);
    fill(50, 150, 50, 255);
    text(targetStateAmp.toFixed(5), 0.45*width, 0.965*height);
    text((targetStateAmp*targetStateAmp).toFixed(5), 0.655*width, 0.965*height);
}
