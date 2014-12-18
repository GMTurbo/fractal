var System = function(options) {

  options = _.defaults(options, {
    width: 100,
    height: 100,
    isMobile: false
  });

  if (!options.canvas) {
    console.error("canvas element required for cops and robbas :/");
    return;
  }

  if (!options.reqAnimationFrame) {
    console.error("window.requestAnimationFrame required :/");
    return;
  }

  var canvas = options.canvas,
    width = options.width,
    height = options.height,
    density = options.density,
    reqFrame = options.reqAnimationFrame,
    context = canvas.getContext('2d'),
    initialSetup = true,
    isMobile = options.isMobile;

  var target = {x:width/2, y:height/2, r: 10};

  var setup = function() {
    updateSystem();
  };

  function drawSystem(context) {
    //draw the system here
    //context.clearRect(0, 0, width, height);

    //drawFractal(context);
    drawPoints(context);
  }

  function updateSystem() {
    //update the system here
    updateFractal();
    drawSystem(context);
    reqFrame(updateSystem);
  }

  var points = [
    {x:width/2,y:0},
    {x:width,y:0}
  ];

  function updateFractal(){
    //points should double each iteration [ ]->[  ]
    points = points.concat(fractal());
  }

  var theta = 80;
  var offsetx = width/2, offsety = height;

  function fractal(){
    //save index
     var lastTwo = [points[points.length-2] - offsetx, points[points.length-1] - offsety];
    // var mag = helper.mag(lastTwo[0], lastTwo[1]);
    var ret = [];
    var vec = {
      x: lastTwo[1].x - lastTwo[0].x,
      y: lastTwo[1].y - lastTwo[0].y
    };

     var mag = helper.mag(lastTwo[0], lastTwo[1]);
    //  * 0.39;
    vec.x/=mag;
    vec.y/=mag;
    var p1 = {
      x:lastTwo[0].x + 0.1 * mag * vec.x,
      y:lastTwo[0].y + 0.1 * mag * vec.y,
    };

    //rotate
    var angle = Math.atan2(lastTwo[0].y, lastTwo[0].x);
    angle += theta * Math.PI/180;

    //move along rotated vector
    var p2 = {
      x: p1.x - mag * 0.39 * Math.cos(angle),
      y: p1.y - mag * 0.39 * Math.sin(angle)
    };

    ret.push({x:offsetx + p1.x, y:offsety + p1.y});
    ret.push({x:offsetx + p2.x, y:offsety + p2.y});
    return ret;
  }

  var helper = (function(){
    var mag = function(pnt1, pnt2){
      return Math.sqrt(Math.pow(pnt1.x - pnt2.x, 2) + Math.pow(pnt1.y - pnt2.y, 2) );
    };
    return {mag : mag};
  })();

  function drawFractal(con){
    con.beginPath();

    con.lineWidth = 1;
    con.strokeStyle = 'rgba(255,255,255,' + 255 + ')';
    //con.shadowColor   = 'rgba(226,225,142,1)';
    // con.globalAlpha=opacity; // Half opacity

    con.moveTo(points[points.length-2].x, offsety + points[points.length-2].y);
    con.lineTo(offsetx + points[points.length-1].x, offsety + points[points.length-1].y);

    con.stroke();
    con.closePath();
  }

  function drawPoints(con){
    con.beginPath();
    con.arc(target.x +points[points.length-2].x,target.y + points[points.length-2].y, 1, 0, 2 * Math.PI, false);

    //con.arc(width/2 +points[points.length-1].x,height/2 + points[points.length-1].y, 6, 0, 2 * Math.PI, false);
    con.fillStyle = '#FFFF00';
    con.fill();
    con.closePath();
  }

  function onMouseMove(mouse) {
      target.x = mouse.x;
      target.y = mouse.y;
  }

  function onKeyPress(e) {

  }

  function resize(size) {
    width = size.width;
    height = size.height;
    setup();
  }

  return {
    begin: setup,
    resize: resize,
    onMouseMove: onMouseMove,
    onKeyPress: onKeyPress
  };
};
