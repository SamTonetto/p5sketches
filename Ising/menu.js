var results = [];

var menuSketch = function(p) {

    p.setup = function() {

	p.menuCanvas = p.createCanvas(800,200);

    	var solver = p.createButton('Solve for Ground States!');
    	solver.position(0.05*p.width, p.height/3);
	solver.style('background-color', 'white');
    	solver.style('border', '2px solid #4CAF50');
    	solver.style('color', '#4CAF50');
    	solver.style('padding', '15px 32px');
    	solver.style('text-align', 'center');
    	solver.style('text-decoration', 'none');
    	solver.style('display', 'inline-block');
    	solver.style('font-size', '16px');
	solver.mouseOver(function() { 
            solver.style('background-color', '#4CAF50');
            solver.style('color', 'white');
	});
	solver.mouseOut(function() {
            solver.style('background-color', 'white');
            solver.style('color', '#4CAF50');
	});
    	solver.mousePressed(GenerateResults);

	var clearResults = p.createButton('Clear Solutions');
	clearResults.position(0.05*p.width, 2*p.height/3);
	clearResults.style('background-color', 'white');
	clearResults.style('border', '2px solid #4CAF50');
	clearResults.style('color', '#4CAF50');
	clearResults.style('padding', '15px 32px');
	clearResults.style('text-align', 'center');
	clearResults.style('text-decoration', 'none');
	clearResults.style('display', 'inline-block');
	clearResults.style('font-size', '16px');
	//saveDot.style('transition-duration', '0.4s');
	clearResults.mouseOver(function() { 
            clearResults.style('background-color', '#4CAF50');
            clearResults.style('color', 'white');
	});
	clearResults.mouseOut(function() {
            clearResults.style('background-color', 'white');
            clearResults.style('color', '#4CAF50');
	});
	clearResults.mousePressed(ClearResults);

	var saveDot = p.createButton('Save graph as .dot');
	saveDot.position(0.4*p.width, p.height/3);
	saveDot.style('background-color', 'white');
	saveDot.style('border', '2px solid #4CAF50');
	saveDot.style('color', '#4CAF50');
	saveDot.style('padding', '15px 32px');
	saveDot.style('text-align', 'center');
	saveDot.style('text-decoration', 'none');
	saveDot.style('display', 'inline-block');
	saveDot.style('font-size', '16px');
	//saveDot.style('transition-duration', '0.4s');
	saveDot.mouseOver(function() { 
            saveDot.style('background-color', '#4CAF50');
            saveDot.style('color', 'white');
	});
	saveDot.mouseOut(function() {
            saveDot.style('background-color', 'white');
            saveDot.style('color', '#4CAF50');
	});
	saveDot.mousePressed(SaveToDot);

	var saveAdjMat = p.createButton('Save Adj. Matrix');
	saveAdjMat.position(0.4*p.width, 2*p.height/3);
	saveAdjMat.style('background-color', 'white');
	saveAdjMat.style('border', '2px solid #4CAF50');
	saveAdjMat.style('color', '#4CAF50');
	saveAdjMat.style('padding', '15px 32px');
	saveAdjMat.style('text-align', 'center');
	saveAdjMat.style('text-decoration', 'none');
	saveAdjMat.style('display', 'inline-block');
	saveAdjMat.style('font-size', '16px');
	//saveDot.style('transition-duration', '0.4s');
	saveAdjMat.mouseOver(function() { 
            saveAdjMat.style('background-color', '#4CAF50');
            saveAdjMat.style('color', 'white');
	});
	saveAdjMat.mouseOut(function() {
            saveAdjMat.style('background-color', 'white');
            saveAdjMat.style('color', '#4CAF50');
	});
	saveAdjMat.mousePressed(SaveAdjMat);

    }

    p.draw = function() {

    }


}

var menu = new p5(menuSketch, 'menuDiv'); 


function GenerateResults() {

    var resultsObject = new Results();
    resultsObject.GraphToAdjMat();
    resultsObject.Spectrum();

    var groundStateEnergy = resultsObject.energies[0];
    var degeneracy = 1;
    while(Math.abs(resultsObject.energies[degeneracy] - groundStateEnergy) < 0.000001 && degeneracy - 1 < resultsObject.energies.length) {
	degeneracy += 1;
    }
    var firstExcitedEnergy = resultsObject.energies[degeneracy];
    var excitedDegeneracy = degeneracy + 1;
    while(Math.abs(resultsObject.energies[excitedDegeneracy] - firstExcitedEnergy) < 0.000001 && excitedDegeneracy + degeneracy - 1 < resultsObject.energies.length) {
	excitedDegeneracy += 1;
    }

    console.log("ADJMAT");
    console.log(resultsObject.adjMat);

    console.log("CONFIGS");
    console.log(resultsObject.configs);
    console.log("ENERGIES");

    console.log(resultsObject.energies);
    console.log(degeneracy);

    console.log('excitedDegen');
    console.log(excitedDegeneracy);

    for(var sol = 0; sol < degeneracy; ++sol) { 
	
	var solutionSketch = function(c) {

	    c.VertexList = [];
	    c.EdgeList = [];
	    
	    c.setup = function() {
		c.createCanvas(200,200);

		for(var i = 0; i < main.VertexList.length; ++i) {
		    c.VertexList.push(new SimpleVertex());
		    c.VertexList[i].x = main.VertexList[i].x * c.width/main.width;
		    c.VertexList[i].y = main.VertexList[i].y * c.width/main.width;
		    c.VertexList[i].radius = 10;
		    c.VertexList[i].tag = main.VertexList[i].tag.value();
		    if(resultsObject.configs[sol][i] == 1) {
			c.VertexList[i].spin = 1;
			c.VertexList[i].col = [0, 150, 0];
		    } else {
			c.VertexList[i].spin = -1;
			c.VertexList[i].col = [200, 0, 0];
		    }
		}
		
		for(var i = 0; i < main.EdgeList.length; ++i) {
		    c.EdgeList.push(new SimpleEdge());
		    c.EdgeList[i].v1x = main.EdgeList[i].v1.x * c.width/main.width;
		    c.EdgeList[i].v2x = main.EdgeList[i].v2.x * c.width/main.width;
		    c.EdgeList[i].v1y = main.EdgeList[i].v1.y * c.width/main.width;
		    c.EdgeList[i].v2y = main.EdgeList[i].v2.y * c.width/main.width;
		    c.EdgeList[i].tag = main.EdgeList[i].tag.value();
		    if(parseFloat(main.EdgeList[i].tag.value()) < 0) {
			c.EdgeList[i].col = [255,100,100]; 
		    } else {
			c.EdgeList[i].col = [100,100,255];
		    }
		    c.EdgeList[i].thickness = 2*Math.log2(Math.abs(main.EdgeList[i].tag.value())+1);
		}

	    }

	    c.draw = function() {

		c.stroke(0);
		c.strokeWeight(4);
		c.fill(255);
		c.rect(0,0,c.width,c.height);

		c.noStroke();
		c.fill(150,150,150);
		c.textSize(40);
		c.text("E = " + groundStateEnergy, 0.25*c.width, 0.9*c.height);

		c.textSize(12);

		//Draw Edges
		for(var i = 0; i < c.EdgeList.length; ++i) {

		    var e = c.EdgeList[i];
		    c.stroke(e.col[0], e.col[1], e.col[2]);
		    c.strokeWeight(e.thickness);
		    c.line(e.v1x, e.v1y, e.v2x, e.v2y);

		    c.fill(0);
		    c.stroke(0);
		    c.strokeWeight(1);
		    c.text(e.tag, (e.v1x+e.v2x)/2, (e.v1y + e.v2y)/2);
		}

		//Draw Spin Arrows
		for(var i = 0; i < c.VertexList.length; ++i) {

		    var v = c.VertexList[i]; //short-hand

		    c.stroke(0);
		    c.strokeWeight(1);
		    c.fill(v.col[0], v.col[1], v.col[2]);

		    if(v.spin == 1) {
			c.triangle(v.x, v.y - v.radius, v.x - v.radius/2, v.y, v.x + v.radius/2, v.y);
			c.rect(v.x - v.radius/6, v.y, v.radius/3, v.radius*Math.sqrt(15)/4);
		    } else {
			c.triangle(v.x, v.y + v.radius, v.x - v.radius/2, v.y, v.x + v.radius/2, v.y);
			c.rect(v.x - v.radius/6, v.y - v.radius*Math.sqrt(15)/4, v.radius/3, v.radius*Math.sqrt(15)/4);
		    }
		    c.fill(0);
		    c.text(v.tag, v.x + 10, v.y + 10);
		}

	    }

	} //END SKETCH PROTOTYPE

	results.push(new p5(solutionSketch, 'resultsDiv'));
	
    } //END SOLUTION LOOP

    for(var sol = degeneracy; sol < degeneracy + excitedDegeneracy; ++sol) { 
	
	var solutionSketch2 = function(c) {

	    c.VertexList = [];
	    c.EdgeList = [];
	    
	    c.setup = function() {
		c.createCanvas(200,200);

		for(var i = 0; i < main.VertexList.length; ++i) {
		    c.VertexList.push(new SimpleVertex());
		    c.VertexList[i].x = main.VertexList[i].x * c.width/main.width;
		    c.VertexList[i].y = main.VertexList[i].y * c.width/main.width;
		    c.VertexList[i].radius = 10;
		    c.VertexList[i].tag = main.VertexList[i].tag.value();
		    if(resultsObject.configs[sol][i] == 1) {
			c.VertexList[i].spin = 1;
			c.VertexList[i].col = [0, 150, 0];
		    } else {
			c.VertexList[i].spin = -1;
			c.VertexList[i].col = [200, 0, 0];
		    }
		}
		
		for(var i = 0; i < main.EdgeList.length; ++i) {
		    c.EdgeList.push(new SimpleEdge());
		    c.EdgeList[i].v1x = main.EdgeList[i].v1.x * c.width/main.width;
		    c.EdgeList[i].v2x = main.EdgeList[i].v2.x * c.width/main.width;
		    c.EdgeList[i].v1y = main.EdgeList[i].v1.y * c.width/main.width;
		    c.EdgeList[i].v2y = main.EdgeList[i].v2.y * c.width/main.width;
		    c.EdgeList[i].tag = main.EdgeList[i].tag.value();
		    if(parseFloat(main.EdgeList[i].tag.value()) < 0) {
			c.EdgeList[i].col = [255,100,100]; 
		    } else {
			c.EdgeList[i].col = [100,100,255];
		    }
		    c.EdgeList[i].thickness = 2*Math.log2(Math.abs(main.EdgeList[i].tag.value())+1);
		}

	    }

	    c.draw = function() {

		c.stroke(0);
		c.strokeWeight(4);
		c.fill(255);
		c.rect(0,0,c.width,c.height);

		c.noStroke();
		c.fill(150,150,150);
		c.textSize(40);
		c.text("E = " + firstExcitedEnergy, 0.25*c.width, 0.9*c.height);

		c.textSize(12);

		//Draw Edges
		for(var i = 0; i < c.EdgeList.length; ++i) {

		    var e = c.EdgeList[i];
		    c.stroke(e.col[0], e.col[1], e.col[2]);
		    c.strokeWeight(e.thickness);
		    c.line(e.v1x, e.v1y, e.v2x, e.v2y);

		    c.fill(0);
		    c.stroke(0);
		    c.strokeWeight(1);
		    c.text(e.tag, (e.v1x+e.v2x)/2, (e.v1y + e.v2y)/2);
		}

		//Draw Spin Arrows
		for(var i = 0; i < c.VertexList.length; ++i) {

		    var v = c.VertexList[i]; //short-hand

		    c.stroke(0);
		    c.strokeWeight(1);
		    c.fill(v.col[0], v.col[1], v.col[2]);

		    if(v.spin == 1) {
			c.triangle(v.x, v.y - v.radius, v.x - v.radius/2, v.y, v.x + v.radius/2, v.y);
			c.rect(v.x - v.radius/6, v.y, v.radius/3, v.radius*Math.sqrt(15)/4);
		    } else {
			c.triangle(v.x, v.y + v.radius, v.x - v.radius/2, v.y, v.x + v.radius/2, v.y);
			c.rect(v.x - v.radius/6, v.y - v.radius*Math.sqrt(15)/4, v.radius/3, v.radius*Math.sqrt(15)/4);
		    }
		    c.fill(0);
		    c.text(v.tag, v.x + 10, v.y + 10);
		}

	    }

	} //END SKETCH PROTOTYPE

	results.push(new p5(solutionSketch2, 'resultsDiv'));
	
    } //END SOLUTION LOOP

}

function SimpleVertex() {
    
    this.x = 0;
    this.y = 0;
    this.radius = 1;
    this.col = [0,0,0];
    this.tag = '';
    this.spin = 0;
    
}

function SimpleEdge() {
    
    this.v1x = 0;
    this.v2x = 0;
    this.v1y = 0;
    this.v2y = 0;
    this.tag = '';
    this.thickness = 1;
    this.col = [0,0,0];
    
}


function SaveToDot() {

    var data ='graph G { \n\n';

    for(var i = 0; i < main.VertexList.length; ++i) {
	data += main.VertexList[i].index + " [weight = " + main.VertexList[i].tag.value() + "];\n";
    }
    data += "\n";
    for(var i = 0; i < main.EdgeList.length; ++i) {
	data += main.EdgeList[i].v1.index + "--" + main.EdgeList[i].v2.index + " [weight = " + main.EdgeList[i].tag.value() + "];\n"; 
    }
    data += "\n";
    data += "}";

    var blob = new Blob([data], {type: 'text/csv'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, 'graph.dot');
    }
    else{
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = 'graph.dot';        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
    }
}

function SaveAdjMat() {

    var temp_results = new Results();
    temp_results.GraphToAdjMat();
    var adjMat = temp_results.adjMat;

    console.log(adjMat);
    var data = '';
    for(var i = 0; i < adjMat.length; ++i) {
	for(var j = 0; j < adjMat[i].length; ++j) {
            data += adjMat[i][j] + '\t';
	}
	data += '\n';
    }

    var blob = new Blob([data], {type: 'text/text'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, 'adjMat');
    }
    else{
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = 'adjMat';        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
    }
}


function ClearResults() {

    for(var i = 0; i < results.length; ++i) {
	results[i].remove();
    }

}


