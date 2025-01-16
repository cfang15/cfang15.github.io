//student name: Chris Fang
//student email: cfang15@ucsc.edu
//notes to grader: n/a

let drawingCanvas, drawingContext;

function initialize() {
  drawingCanvas = document.getElementById('example');
  if (!drawingCanvas) {
    console.log('Failed to retrieve the <canvas> element');
    return;
  }

  drawingContext = drawingCanvas.getContext('2d');
  if (!drawingContext) {
    console.log('Failed to retrieve rendering context for canvas');
    return;
  }
  
  // Fill the background
  drawingContext.fillStyle = 'black';
  drawingContext.fillRect(0, 0, 400, 400);

  // Set up event listeners
  const drawButton = document.getElementById('draw-button');
  drawButton.addEventListener('click', handleDraw);

  const operationButton = document.getElementById('operation-button');
  operationButton.addEventListener('click', handleVectorOperation);
}

function drawArrow(vector, color) {
  const centerX = 400 / 2;
  const centerY = 400 / 2;

  const scaledX = vector.elements[0] * 20;
  const scaledY = vector.elements[1] * 20;

  drawingContext.beginPath();
  drawingContext.moveTo(centerX, centerY);
  drawingContext.lineTo(centerX + scaledX, centerY - scaledY);
  drawingContext.strokeStyle = color;
  drawingContext.lineWidth = 2;
  drawingContext.stroke();
}

function handleDraw() {
  // Clear the canvas
  drawingContext.fillStyle = 'black';
  drawingContext.fillRect(0, 0, 400, 400);

  // Get user inputs
  const xCoord = parseFloat(document.getElementById('x-coordinate').value);
  const yCoord = parseFloat(document.getElementById('y-coordinate').value);

  const xCoord2 = parseFloat(document.getElementById('x-coordinate2').value);
  const yCoord2 = parseFloat(document.getElementById('y-coordinate2').value);

  // Create vector instances
  const vector1 = new Vector3([xCoord, yCoord, 0]);
  const vector2 = new Vector3([xCoord2, yCoord2, 0]);

  // Draw vectors
  drawArrow(vector1, 'red');
  drawArrow(vector2, 'blue');
}

function handleVectorOperation() {
  // Clear the canvas
  drawingContext.fillStyle = 'black';
  drawingContext.fillRect(0, 0, 400, 400);

  // Get user inputs
  const xCoord = parseFloat(document.getElementById('x-coordinate').value);
  const yCoord = parseFloat(document.getElementById('y-coordinate').value);

  const xCoord2 = parseFloat(document.getElementById('x-coordinate2').value);
  const yCoord2 = parseFloat(document.getElementById('y-coordinate2').value);

  // Create vector instances
  const vector1 = new Vector3([xCoord, yCoord, 0]);
  const vector2 = new Vector3([xCoord2, yCoord2, 0]);

  // Draw initial vectors
  drawArrow(vector1, 'red');
  drawArrow(vector2, 'blue');

  // Get the operation and scalar input
  const operation = document.getElementById('operation').value;
  const scalar = parseFloat(document.getElementById('scalar').value);

  // Perform the chosen operation
  let vector3, vector4;
  if (operation === 'add') {
    vector3 = vector1.add(vector2);
    drawArrow(vector3, 'green');
  } else if (operation === 'sub') {
    vector3 = vector1.sub(vector2);
    drawArrow(vector3, 'green');
  } else if (operation === 'mul') {
    vector3 = vector1.mul(scalar);
    vector4 = vector2.mul(scalar);
    drawArrow(vector3, 'green');
    drawArrow(vector4, 'green');
  } else if (operation === 'div') {
    vector3 = vector1.div(scalar);
    vector4 = vector2.div(scalar);
    drawArrow(vector3, 'green');
    drawArrow(vector4, 'green');
  } else if (operation === 'mag') {
    const mag1 = vector1.magnitude();
    const mag2 = vector2.magnitude();
    console.log(`Magnitude v1: ${mag1}`);
    console.log(`Magnitude v2: ${mag2}`);
  } else if (operation === 'norm') {
    const norm1 = vector1.normalize();
    const norm2 = vector2.normalize();
    drawArrow(norm1, 'green');
    drawArrow(norm2, 'green');
  } else if (operation === 'angleBetween') {
    const angle = getAngleBetween(vector1, vector2);
    // angle is logged inside the function
  } else if (operation === 'area') {
    const area = getTriangleArea(vector1, vector2);
    // area is logged inside the function
  }
}

function getAngleBetween(vector1, vector2) {
  const dotProduct = Vector3.dot(vector1, vector2);
  const mag1 = vector1.magnitude();
  const mag2 = vector2.magnitude();

  // Clamp the cosTheta between -1 and 1 before calling Math.acos
  const cosTheta = dotProduct / (mag1 * mag2);
  const angleRad = Math.acos(Math.max(-1, Math.min(1, cosTheta)));
  const angleDeg = angleRad * (180 / Math.PI);

  console.log(`Angle: ${angleDeg}`);
  return angleDeg;
}

function getTriangleArea(vector1, vector2) {
  const crossProd = Vector3.cross(vector1, vector2);
  const magnitudeCross = crossProd.magnitude();
  const areaOfTriangle = magnitudeCross / 2;

  console.log(`Area: ${areaOfTriangle}`);
  return areaOfTriangle;
}
