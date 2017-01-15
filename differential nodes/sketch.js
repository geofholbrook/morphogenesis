var centerX, centerY; 
var nodes = [];
var divisions=10;
var r=200;//100
var scalar = 0.5;
var rForce = -0.71;
var rThresh=200;
var dThresh = 53;//53
var aForce = 0.102;
var aThresh=50;//50

function keyPressed() {
  if (key == ' ') {
    noLoop();
  } 
}

function setup(){
 createCanvas(windowWidth, windowHeight);
 centerX=width/2; 
 centerY=height/2;
 angleMode(DEGREES); 
 frameRate(10);
 //make a pretty ring around point (0, 0)
 for(var i=0;i<divisions;i++){
  var vec = createVector(r, 0);
  var angle = 360/divisions*i+random(-10, 10);
  vec.rotate(angle);
  var node = new Node(vec);
  nodes.push(node);
  }
}

var Node = function(vector) {
  this.pos = vector;
this.display = function(){
  //draw a circle at the node's position with diameter of 10
  ellipse(this.pos.x, this.pos.y, 10, 10);
 };
};

function draw() {
  background(255, 2);
 translate(centerX, centerY);
 scale(scalar);
 fill(0);
 for(var i=0;i<nodes.length;i++){
   nodes[i].display();
 }    
 //noFill();
 fill(0, 0, 100, 4);
 strokeWeight(10);
 stroke(200, 200, 20);
 beginShape();
  for(var i = 0; i<nodes.length;i++){
   vertex(nodes[i].pos.x, nodes[i].pos.y);
   }
  endShape(CLOSE);
  fill(0);
  noStroke();
 for(var i=0;i<nodes.length;i++){
   nodes[i].display();
 }    
  rejectAll();
  edgeSplit();
  attractNeighbors();
}

function rejectAll(){
   for (var i = 0; i < nodes.length; i++) {
      for (var j = 0; j < nodes.length; j++) {
        if (i !== j) {
        if(nodes[j].pos.dist(nodes[i].pos)<rThresh){
           var newPos = p5.Vector.lerp(nodes[i].pos, nodes[j].pos, rForce/nodes.length);
           nodes[i].pos = newPos;
        }
      }
    }
  }
}

function growMidpoint(vec1, vec2){
   var d = p5.Vector.lerp(vec1, vec2, 0.5);
   var bulb = new Node(d);
   return bulb;
}

function edgeSplit(){
  for(var i = 0; i<nodes.length; i++){
    var neighbor = i+1;
    if (neighbor>nodes.length-1){neighbor=0};
    if(nodes[i].pos.dist(nodes[neighbor].pos)>dThresh){
      var bulb = growMidpoint(nodes[i].pos, nodes[neighbor].pos);
      nodes.splice(neighbor, 0, bulb);
    }
  }
}

function attractNeighbors(){
 for(var i = 0; i<nodes.length; i++){
   var right = i+1;
   var left = i-1;
   if (right>nodes.length-1){right=0};
   if (left < 0){left = nodes.length-1};
   if(nodes[i].pos.dist(nodes[right].pos)>aThresh){
     var d = p5.Vector.lerp(nodes[i].pos, nodes[right].pos, aForce);
     nodes[i].pos = d;
   } 
   if (nodes[i].pos.dist(nodes[left].pos)>aThresh){
     var d = p5.Vector.lerp(nodes[i].pos, nodes[left].pos, aForce);
     nodes[i].pos = d;
   }
 }
}
