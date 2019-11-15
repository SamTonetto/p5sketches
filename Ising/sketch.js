/*
var flaggedVertex = -1; //Records which vertex was clicked.
var overVertex = -1; //Records which vertex mouse is over.
var VertexList = [];
var EdgeList = [];
var index = 0;
*/

var sketch = function(p) {

  p.VertexList = [];
  p.EdgeList = [];
  p.index = 0;
  p.flaggedVertex = -1;
  p.overVertex = -1;
  
  var main_canvas;

  p.setup = function() {
    main_canvas = p.createCanvas(800,500);
    main_canvas.position();
  }

  p.draw = function() {

    //Border and background
    p.stroke(0);
    p.strokeWeight(5);
    p.fill(240);
    p.rect(0, 0, p.width, p.height);
    
    //Draw Edges
    for(var i = 0; i < p.EdgeList.length; ++i) {
      p.EdgeList[i].display();
    }

    if(p.flaggedVertex >= 0) {
      p.stroke(0);
      p.strokeWeight(1);
      p.line(p.VertexList[p.flaggedVertex].x, p.VertexList[p.flaggedVertex].y, p.mouseX, p.mouseY);
    }

    //Draw vertices
    for(var i = 0; i < p.VertexList.length; ++i) {
      p.VertexList[i].display();
    }

  }

  p.mousePressed = function() {

    if(p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) 
    {

    //Determine if user clicked on Vertex or Vertex Tag
    var onVertex = -1;
    for(var i = 0; i < p.VertexList.length; ++i) {
      if(p.dist(p.mouseX, p.mouseY, p.VertexList[i].x, p.VertexList[i].y) < p.VertexList[i].radius) {
        onVertex = i;
        break;
      }
    }
    //Determine if user clicked on Edge or Edge Tag
    var onEdge = -1;
    for(var i = 0; i < p.EdgeList.length; ++i) {
      if(WithinEps(p.EdgeList[i],5)) {
        onEdge = i;
        break;
      }
    }

    if(p.mouseButton == p.LEFT) {

      //Test Tag
      var tagHover = false;
      for(var i = 0; i < p.EdgeList.length; ++i) {
        if(p.EdgeList[i].tag.hover) {
          tagHover = true;
        }
      }
      for(var i = 0; i < p.VertexList.length; ++i) {
        if(p.VertexList[i].tag.hover) {
          tagHover = true;
        }
      }

      if(!tagHover) {

        //Left-clicked in empty space
        if(onVertex < 0) {

          if(p.flaggedVertex >= 0) {
            newVertex = new Vertex(p.index, main);
            p.VertexList.push(newVertex);
            p.index += 1;
            p.EdgeList.push(new Edge(p.VertexList[p.flaggedVertex], newVertex));
            p.VertexList[p.flaggedVertex].col = [0,0,0];
            p.flaggedVertex = -1;
          } else {
            p.VertexList.push(new Vertex(p.index, main));
            p.index += 1;
          }
        }

        //Left-clicked on Vertex
        if(onVertex >= 0) {
          if(p.flaggedVertex >= 0) {
            var edgeAlreadyExists = false;
            for(var i = 0; i < p.EdgeList.length; ++i) {
              if((p.EdgeList[i].v1.index === p.VertexList[p.flaggedVertex].index && p.EdgeList[i].v2.index === p.VertexList[onVertex].index)
                || (p.EdgeList[i].v2.index === p.VertexList[p.flaggedVertex].index && p.EdgeList[i].v1.index === p.VertexList[onVertex].index)) 
              {
              edgeAlreadyExists = true;
              break;
              }
            }
            if(!edgeAlreadyExists) {
              var newEdge = new Edge(p.VertexList[p.flaggedVertex], p.VertexList[onVertex]);
              p.EdgeList.push(newEdge);
            }
            p.VertexList[p.flaggedVertex].col = [0,0,0];
            p.flaggedVertex = -1;
          } else {
            p.flaggedVertex = onVertex;
            p.VertexList[p.flaggedVertex].col = [255,0,255];
          }
        }
      }
    }

    else if(p.mouseButton === p.RIGHT) {

      //Right-click on Vertex
      if(onVertex >= 0) {
        var edgesToRemove = [];
        for(var i = 0; i < p.EdgeList.length; ++i) {
          if(p.EdgeList[i].v1.index === p.VertexList[onVertex].index || p.EdgeList[i].v2.index === p.VertexList[onVertex].index) {
            edgesToRemove.push(i);
          }
        }

        for(var i = edgesToRemove.length - 1; i >= 0; i--) {
          p.EdgeList[edgesToRemove[i]].tag.remove();
          p.EdgeList.splice(edgesToRemove[i], 1);
        }
        p.VertexList[onVertex].tag.remove();
        p.VertexList.splice(onVertex, 1);
        p.flaggedVertex = -1;
      }

      //Right-click on Edge
      if(onEdge >= 0) {
        p.EdgeList[onEdge].tag.remove();
        p.EdgeList.splice(onEdge, 1);
      }

      if(p.flaggedVertex >= 0) {
        p.VertexList[p.flaggedVertex].col = [0, 0, 0];
        p.flaggedVertex = -1;
      }

    } //End mouseRight

  }

  } //End mousePressed()

} //End sketch

var main = new p5(sketch, 'canvasDiv'); 















/*
function setup() {
  var canvas = createCanvas(800,600);
  canvas.parent('canvasDiv');
}

function draw() {
  
  //Border and background
  stroke(0);
  strokeWeight(5);
  fill(255);
  rect(0,0, width, height);

  //Draw Vertices
  for(var i = 0; i < VertexList.length; ++i) {
    VertexList[i].display();
  }

  //Draw Edges
  for(var i = 0; i < EdgeList.length; ++i) {
    EdgeList[i].display();
  }

  //If vertex selected, draw edge following cursor
  if(flaggedVertex >= 0) {
    stroke(0);
    strokeWeight(1);
    line(VertexList[flaggedVertex].x, VertexList[flaggedVertex].y, mouseX, mouseY);
  }
}
*/


  

  
  
