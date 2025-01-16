let canvasElement, drawingContext;
function main(){
    canvasElement = document.getElementById('example');
    if(!canvasElement){
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    drawingContext = canvasElement.getContext('2d');
    if(!drawingContext){
        console.log('Failed to retrieve rendering context for canvas');
        return;
    }

    drawingContext.fillStyle = 'black';
    drawingContext.fillRect(0,0,400,400);

    const drawBtn = document.getElementById('draw-button');
    drawBtn.addEventListener('click', handleDrawEvent);

    const operationBtn = document.getElementById('operation-button');
    operationBtn.addEventListener('click', handleDrawOperationEvent);
}

function drawVector(vector, color){
    var centerX = 400/2;
    var centerY = 400/2;

    var scaledX = vector.elements[0] * 20;
    var scaledY = vector.elements[1] * 20;

    drawingContext.beginPath();
    drawingContext.moveTo(centerX, centerY);
    drawingContext.lineTo(centerX + scaledX, centerY - scaledY);
    drawingContext.strokeStyle = color;
    drawingContext.lineWidth = 2;
    drawingContext.stroke();
}

function handleDrawEvent(){
    drawingContext.fillStyle = 'black';
    drawingContext.fillRect(0,0,400,400);

    const coordX = parseFloat(document.getElementById('x-coordinate').value);
    const coordY = parseFloat(document.getElementById('y-coordinate').value);

    const coordX2 = parseFloat(document.getElementById('x-coordinate2').value);
    const coordY2 = parseFloat(document.getElementById('y-coordinate2').value);

    const vector1 = new Vector3([coordX, coordY, 0]);
    const vector2 = new Vector3([coordX2, coordY2, 0]);

    drawVector(vector1, 'red');
    drawVector(vector2, 'blue');
}

function handleDrawOperationEvent(){
    drawingContext.fillStyle = 'black';
    drawingContext.fillRect(0,0,400,400);

    const coordX = parseFloat(document.getElementById('x-coordinate').value);
    const coordY = parseFloat(document.getElementById('y-coordinate').value);

    const coordX2 = parseFloat(document.getElementById('x-coordinate2').value);
    const coordY2 = parseFloat(document.getElementById('y-coordinate2').value);

    const vector1 = new Vector3([coordX, coordY, 0]);
    const vector2 = new Vector3([coordX2, coordY2, 0]);

    drawVector(vector1, 'red');
    drawVector(vector2, 'blue');

    const selectedOperation = document.getElementById('operation').value;
    const scalarValue = parseFloat(document.getElementById('scalar').value);

    let vectorResult1, vectorResult2;

    if (selectedOperation === 'add') {
        vectorResult1 = vector1.add(vector2);
        drawVector(vectorResult1, 'green');
    } else if (selectedOperation === 'sub') {
        vectorResult1 = vector1.sub(vector2);
        drawVector(vectorResult1, 'green');
    } else if (selectedOperation === 'mul') {
        vectorResult1 = vector1.mul(scalarValue);
        vectorResult2 = vector2.mul(scalarValue);
        drawVector(vectorResult1, 'green');
        drawVector(vectorResult2, 'green');
    } else if (selectedOperation === 'div') {
        vectorResult1 = vector1.div(scalarValue);
        vectorResult2 = vector2.div(scalarValue);
        drawVector(vectorResult1, 'green');
        drawVector(vectorResult2, 'green');
    } else if (selectedOperation === 'mag') {
        const magnitude1 = vector1.magnitude();
        const magnitude2 = vector2.magnitude();
        console.log(`Magnitude vector1: ${magnitude1}`);
        console.log(`Magnitude vector2: ${magnitude2}`);
    } else if (selectedOperation === 'norm') {
        const normalized1 = vector1.normalize();
        const normalized2 = vector2.normalize();
        drawVector(normalized1, 'green');
        drawVector(normalized2, 'green');
    } else if (selectedOperation === 'angleBetween') {
        const angle = angleBetween(vector1, vector2);
    } else if (selectedOperation === 'area') {
        const area = areaTriangle(vector1, vector2);
    }
}

function angleBetween(vector1, vector2) {
    const dotProduct = Vector3.dot(vector1, vector2);
    const magnitude1 = vector1.magnitude();
    const magnitude2 = vector2.magnitude();
    const cosTheta = dotProduct / (magnitude1 * magnitude2);
    const angleRad = Math.acos(Math.max(-1, Math.min(1, cosTheta)));
    const angleDeg = angleRad * (180 / Math.PI);
    console.log(`Angle: ${angleDeg}`);
    return angleDeg;
}

function areaTriangle(vector1, vector2) {
    const crossProduct = Vector3.cross(vector1, vector2);
    const magnitudeCross = crossProduct.magnitude();
    const triangleArea = magnitudeCross / 2;
    console.log(`Area: ${triangleArea}`);
    return triangleArea;
}
