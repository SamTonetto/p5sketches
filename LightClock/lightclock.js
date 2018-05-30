var slider;
var plate_hit;
var time = 0;


function Light(x, y, r, extent) {
    this.c = 3;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = this.c;
    this.extent = extent;
    this.ytop = y - extent;
    this.ybot = y + extent;
    this.r = r;
    this.rising = true;
    this.trail = [];
}

var mid_x = 200;
var mid_y = 200;
var lightS = new Light(mid_x, mid_y, 10, 100);

function setup() {
    createCanvas(600, 400);
    slider = createSlider(-999, 999, 0);
    slider.position(10,20);
}

function updateLightClock(light)
{
    light.vy = Math.sqrt(light.c * light.c - light.vx * light.vx);
    
    if(light.y < light.ytop + light.r/2) {
	light.rising = false;
	plate_hit = 1;
	time = time + 1;
    } else if (light.y > light.ybot - light.r/2) {
   	light.rising = true;
	plate_hit = -1;
	time = time + 1;
    } 
    
    if(light.rising == true) {
	light.y = light.y - light.vy
    } else {
	light.y = light.y + light.vy
    }
    
    if(light.x + light.vx > width) {
	light.x = light.x + light.vx - width;
    } else if(light.x + light.vx < 0) {
	light.x = light.x + light.vx + width;
    } else {
  	light.x = light.x + light.vx
    }
    
    stroke(0);
    fill(255, 255, 0, 127);
    ellipse(light.x, light.y, light.r, light.r);
    noStroke();
    
    // Do rectangles
    var rect_width = 40;
    var rect_height = 2;
    
    fill(0);
    
    // Handle wrapping
    if(light.x < width - rect_width/2) {
	
	if(plate_hit == 1) {
	    fill(255, 0, 0);
	    rect(light.x - 0.5 * rect_width, light.ytop - rect_height, rect_width, rect_height);
	} else {
	    fill(0);
	    rect(light.x - 0.5 * rect_width, light.ytop - rect_height, rect_width, rect_height);
	}

	if(plate_hit == -1) {
	    fill(255, 0, 0);
	    rect(light.x - 0.5 * rect_width, light.ybot, rect_width, rect_height);
	} else {
	    fill(0);
	    rect(light.x - 0.5 * rect_width, light.ybot, rect_width, rect_height);
	}
	
    } else if(light.x >= width - rect_width/2) {
	
	var overwrap = light.x + 0.5 * rect_width - width;

	if(plate_hit == 1) {
	    fill(255, 0, 0);
    	    rect(light.x - 0.5 * rect_width, light.ytop - rect_height, rect_width - overwrap, rect_height);
    	    rect(0, light.ytop - rect_height, overwrap, rect_height);
	} else {
    	    rect(light.x - 0.5 * rect_width, light.ytop - rect_height, rect_width - overwrap, rect_height);
    	    rect(0, light.ytop - rect_height, overwrap, rect_height);
	}

	if(plate_hit == -1) {
	    fill(255, 0, 0)
	    rect(light.x - 0.5 * rect_width, light.ybot, rect_width - overwrap, rect_height);
    	    rect(0, light.ybot, overwrap, rect_height);
	} else {
	    rect(light.x - 0.5 * rect_width, light.ybot, rect_width - overwrap, rect_height);
    	    rect(0, light.ybot, overwrap, rect_height);
	}
	
    }
    fill(0);
}

function draw() {
    background(240);

    lightS.vx = slider.value() / 1000 * lightS.c;
    updateLightClock(lightS);
    
    text("v = " + (lightS.vx/lightS.c).toFixed(3) + " c", slider.x * 2 + 1.3 * slider.width + 5, 25);
    textAlign(CENTER);
    text(time + " s", lightS.x, lightS.ytop - 30);
}
