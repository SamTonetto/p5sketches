//Tests to see if cursor is within 'eps'-width of an Edge 'edge'.
function WithinEps(edge, eps) {

    var returnBool = false;
    
    //If practically infinite gradient
    if(this.m === 1000) {
      if(main.mouseY < max(edge.v1.y, edge.v2.y) && main.mouseY > max(edge.v1.y, edge.v2.y) 
        && main.mouseX < edge.v1.x + eps && main.mouseX < edge.v2.x)
      {
        returnBool = true;
      }
    }

    //Else...
    deltaX = - edge.m * eps/Math.sqrt(edge.m*edge.m + 1);
    deltaY = eps/Math.sqrt(edge.m*edge.m + 1);

    if(main.mouseY < edge.m * (main.mouseX - edge.v1.x - deltaX) + edge.v1.y + deltaY
        && main.mouseY > edge.m * (main.mouseX - edge.v1.x + deltaX) + edge.v1.y - deltaY)
    {
        //If v2 is in 1st of 2nd qudrants w.r.t v1:
        if(edge.v2.y >= edge.v1.y) {
          if(main.mouseY > -1/edge.m * (main.mouseX - edge.v1.x) + edge.v1.y
              && main.mouseY < -1/edge.m * (main.mouseX - edge.v2.x) + edge.v2.y)
          {
            returnBool = true;
          }
        } 

        //Else if v2 is in 3rd or 4th quadrants w.r.t v1:
        else {
          if(main.mouseY > -1/edge.m * (main.mouseX - edge.v2.x) + edge.v2.y
              && main.mouseY < -1/edge.m * (main.mouseX - edge.v1.x) + edge.v1.y)
          {
            returnBool = true;
          }
        }
    }

    return returnBool;
}