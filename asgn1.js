// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_size;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_size;

function setupWebGL() {
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_size
  u_size = gl.getUniformLocation(gl.program, 'u_size');
  if (!u_size) {
    console.log('Failed to get the size');
    return;
  }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const TREE = 3;

// Global variables for UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectSize = 5;
let g_selectedType = POINT;
let g_selectedSegments = 10;
let bgColor = [0.0, 0.0, 0.0];  // Default black background color

function addActionsForHtmlUI() {
  // Set up color button actions
  document.getElementById('green').onclick = function() {
    g_selectedColor = [0.0, 1.0, 0.0, 1.0];
  };
  document.getElementById('red').onclick = function() {
    g_selectedColor = [1.0, 0.0, 0.0, 1.0];
  };
  document.getElementById('clearButton').onclick = function() {
    g_shapesList = [];
    renderAllShapes();
  };

  // Set up shape selection buttons
  document.getElementById('pointButton').onclick = function() {
    g_selectedType = POINT;
  };
  document.getElementById('triButton').onclick = function() {
    g_selectedType = TRIANGLE;
  };
  document.getElementById('circleButton').onclick = function() {
    g_selectedType = CIRCLE;
  };
  document.getElementById('treeButton').onclick = function() {
    drawTree();
  };

  // Set up sliders for shape color
  document.getElementById('redSlide').addEventListener('mouseup', function() {
    g_selectedColor[0] = this.value / 100;
  });
  document.getElementById('greenSlide').addEventListener('mouseup', function() {
    g_selectedColor[1] = this.value / 100;
  });
  document.getElementById('blueSlide').addEventListener('mouseup', function() {
    g_selectedColor[2] = this.value / 100;
  });

  // Set up slider for size
  document.getElementById('sizeSlide').addEventListener('mouseup', function() {
    g_selectSize = this.value;
  });

  // Set up slider for segments
  document.getElementById('segmentsSlide').addEventListener('mouseup', function() {
    g_selectedSegments = this.value;
  });

  // New: Set up sliders for background color
  document.getElementById('bgRed').addEventListener('input', function() {
    bgColor[0] = this.value / 255; // Scale slider value to range [0, 1]
    updateBackgroundColor();
  });
  document.getElementById('bgGreen').addEventListener('input', function() {
    bgColor[1] = this.value / 255; // Scale slider value to range [0, 1]
    updateBackgroundColor();
  });
  document.getElementById('bgBlue').addEventListener('input', function() {
    bgColor[2] = this.value / 255; // Scale slider value to range [0, 1]
    updateBackgroundColor();
  });
}

// Function to update the WebGL canvas background color
function updateBackgroundColor() {
  gl.clearColor(bgColor[0], bgColor[1], bgColor[2], 1.0); // Update canvas clear color
  renderAllShapes(); // Redraw all shapes with the updated background
}


function main() {
  setupWebGL();
  connectVariablesToGLSL();

  addActionsForHtmlUI();
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;

  canvas.onmousemove = function(ev) {
    if (ev.buttons == 1) {
      click(ev);
    }
  };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  //mouse cursor change
  canvas.classList.add("brush-cursor");
}

var g_shapesList = [];

function click(ev) {
  let [x, y] = convertCoordinatesEventsToGL(ev);

  let shape;
  if (g_selectedType === POINT) {
    shape = new Point();
  } else if (g_selectedType === TRIANGLE) {
    shape = new Triangle();
  } else if (g_selectedType === CIRCLE) {
    shape = new Circle();
    shape.segments = g_selectedSegments;
  }
  shape.position = [x, y];
  shape.color = g_selectedColor.slice();
  shape.size = g_selectSize;
  g_shapesList.push(shape);

  renderAllShapes();
}

function drawTree() {
  let tree = new Tree();
  tree.position = [0.0, -0.9]; // Center of canvas
  tree.size = 2.0; // Smaller size for the tree
  tree.color = g_selectedColor.slice();
  g_shapesList.push(tree);
  renderAllShapes();
}

function convertCoordinatesEventsToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  return [x, y];
}

function renderAllShapes() {
  var startTime = performance.now();
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for (var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
  var duration = performance.now() - startTime;
  sendTextToHTML(
    "numdot: " + len + "ms: " + Math.floor(duration) + "fps: " + Math.floor(10000 / duration) / 10,
    "numdot"
  );
}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}
