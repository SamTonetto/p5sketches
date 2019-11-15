/*--------------------------------------------------------------------------
  VERTEX
--------------------------------------------------------------------------*/
function Vertex(index, p5obj) {
  this.x = p5obj.mouseX;
  this.y = p5obj.mouseY;
  this.index = index;
  this.radius = 16;
  this.col = [0,0,0];

  this.tag = main.createInput('0');
  this.tag.position(this.x + 5, this.y + 5);

  //Tag CSS style
  this.tag.style('width','20px');
  this.tag.style('text-align', 'center');
  this.tag.style('background-color', 'transparent');
  this.tag.style('border', 'none');
  this.tag.style('font-size', '16px');
  this.tag.style('font-weight', 'bold');
  this.tag.hover = false;
  this.tag.mouseOver(embiggenTag);
  this.tag.mouseOut(ensmallenTag);

  this.display = function() {

    //If cursor is over vertex, embiggen vertex!
    if((p5obj.dist(p5obj.mouseX, p5obj.mouseY, this.x, this.y) < this.radius || this.tag.hover === true)
      && this.index !== p5obj.flaggedVertex) {
        p5obj.noFill();
        p5obj.stroke(0);
        p5obj.ellipse(this.x, this.y, 20, 20);
    }
    
    p5obj.noStroke();
    p5obj.fill(this.col[0], this.col[1], this.col[2]);
    p5obj.ellipse(this.x, this.y, this.radius, this.radius);

  }

  this.log = function() {
    console.log("Vertex " + this.index + " at (" + this.x + "," + this.y + ")");
  }

}

/*--------------------------------------------------------------------------
  EDGE
--------------------------------------------------------------------------*/
function Edge(v1, v2) {
  this.v1 = v1;
  this.v2 = v2;
  if(v2.x === v1.x) {
    this.m = 1000;
  } else {
    this.m = (v2.y - v1.y)/(v2.x - v1.x);
  }

  this.midpointX = (v1.x+v2.x)/2;
  this.midpointY = (v1.y+v2.y)/2;

  
  this.tag = main.createInput('1');
    var deltaX = -5*this.m/Math.sqrt(this.m*this.m+1);
    var deltaY = 5/Math.sqrt(this.m*this.m+1);
    this.tag.position(this.midpointX + deltaX, this.midpointY + deltaY);

    //Tag CSS style
    this.tag.style('width','20px');
    this.tag.style('background-color', 'transparent');
    this.tag.style('border', 'none');
    this.tag.style('font-size', '16px');
    this.tag.style('font-weight', 'bold');
    this.tag.style('text-align', 'center');
    this.tag.hover = false;
    this.tag.mouseOver(embiggenTag);
    this.tag.mouseOut(ensmallenTag);

    this.display = function() {

	if(WithinEps(this, 5) || this.tag.hover === true) {
	    main.strokeWeight(4*Math.log2(Math.abs(this.tag.value())+1));
	} else {
	    main.strokeWeight(2*Math.log2(Math.abs(this.tag.value())+1));
	}

	if(parseFloat(this.tag.value()) < 0) {
	    main.stroke(255,100,100);
	} else {
	    main.stroke(100,100,255);
	}

	//main.fill(this.col[0], this.col[1], this.col[2]);
	main.line(v1.x, v1.y, v2.x, v2.y);
    }

    this.log = function() {
	console.log("Edge from " + this.v1.index + " to " + this.v2.index);
    }

}

function embiggenTag() {
  this.hover = true;
  this.style('width', ((this.value().length + 1)*8) + 'px');
  this.style('font-size', '20px');
}

function ensmallenTag() {
  this.hover = false;
  this.style('font-size', '16px');
}

/*--------------------------------------------------------------------------
  RESULTS
--------------------------------------------------------------------------*/
function Results() {
  
  this.n = main.VertexList.length;
  this.energies = Array.apply(null, new Array(Math.pow(2,this.n))).map(Number.prototype.valueOf,0);
  this.configs = zeros([Math.pow(2,this.n), this.n]);
  this.adjMat = zeros([this.n,this.n]);

  this.GraphToAdjMat = function() {

      for(var i = 0; i < main.VertexList.length; ++i) {
        this.adjMat[i][i] = parseFloat(main.VertexList[i].tag.value());
      }
      for(var i = 0; i < main.EdgeList.length; ++i) {
        this.adjMat[main.EdgeList[i].v1.index][main.EdgeList[i].v2.index] = parseFloat(main.EdgeList[i].tag.value());
        this.adjMat[main.EdgeList[i].v2.index][main.EdgeList[i].v1.index] = parseFloat(main.EdgeList[i].tag.value());
      }
  }

  this.Spectrum = function() {

      var count_bin = Array.apply(null, new Array(this.n)).map(Number.prototype.valueOf,1);

      for(var count = 0; count < Math.pow(2,this.n); ++count) {

          count_bin = increment(count_bin);
          this.configs[count] = count_bin.slice();
          
          for(var i = 0; i < this.n; ++i) {
              for(var j = i+1; j < this.n; ++j) {
                  this.energies[count] += - this.adjMat[i][j] * this.configs[count][i] * this.configs[count][j];
              }
          }

          for(var i = 0; i < this.n; ++i) {
            this.energies[count] += -this.adjMat[i][i] * this.configs[count][i];
          }
      }
       
      //Sort Energies and Configs based on Energies.
      var list = [];
      for (var j in this.energies) { 
        list.push([this.energies[j],this.configs[j]]);
      }
      list.sort(function(a, b) {
        return ((a[0] < b[0]) ? -1 : ((a[0] == b[0]) ? 0 : 1));
      });
      for (var k = 0; k < list.length; k++) {
        this.energies[k] = list[k][0];
        this.configs[k] = list[k][1];
      }
  }

}


function zeros(dimensions) {
  var array = [];
  for (var i = 0; i < dimensions[0]; ++i) {
      array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
  }
  return array;
}

function zeros(dimensions) {
  var array = [];
  for (var i = 0; i < dimensions[0]; ++i) {
      array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
  }
  return array;
}

function increment(bitset) {
  for(var i = bitset.length - 1; i >= 0; --i) {
    if(bitset[i] == -1) {
      bitset[i] = 1;
      break;
    }
    bitset[i] = -1;
  }
  return bitset;
}
