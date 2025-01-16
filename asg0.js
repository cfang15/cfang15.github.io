let myCanvas, myCtx;

function main() {
    myCanvas = document.getElementById('example');
    if (!myCanvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    myCtx = myCanvas.getContext('2d');
    if (!myCtx) {
        console.log('Failed to retrieve rendering context for canvas');
        return;
    }
    
    myCtx.fillStyle = 'black';
    myCtx.fillRect(0, 0, 400, 400);

    const myDrawButton = document.getElementById('draw-button');
    myDrawButton.addEventListener('click', onDrawEvent);

    const myOperationButton = document.getElementById('operation-button');
    myOperationButton.addEventListener('click', onDrawOperationEvent);
}

function drawVectorNew(vectorParam, colorParam) {
    const originXPosition = 400 / 2;
    const originYPosition = 400 / 2;
    const scaledXValue = vectorParam.elements[0] * 20;
    const scaledYValue = vectorParam.elements[1] * 20;

    myCtx.beginPath();
    myCtx.moveTo(originXPosition, originYPosition);
    myCtx.lineTo(originXPosition + scaledXValue, originYPosition - scaledYValue);
    myCtx.strokeStyle = colorParam;
    myCtx.lineWidth = 2;
    myCtx.stroke();
}

function onDrawEvent() {
    myCtx.fillStyle = 'black';
    myCtx.fillRect(0, 0, 400, 400);

    const inputX = parseFloat(document.getElementById('x-coordinate').value);
    const inputY = parseFloat(document.getElementById('y-coordinate').value);

    const inputX1 = parseFloat(document.getElementById('x-coordinate2').value);
    const inputY1 = parseFloat(document.getElementById('y-coordinate2').value);

    const vector1 = new Vector3([inputX, inputY, 0]);
    const vector2 = new Vector3([inputX1, inputY1, 0]);

    drawVectorNew(vector1, 'red');
    drawVectorNew(vector2, 'blue');
}

function onDrawOperationEvent() {
    myCtx.fillStyle = 'black';
    myCtx.fillRect(0, 0, 400, 400);

    const inputX = parseFloat(document.getElementById('x-coordinate').value);
    const inputY = parseFloat(document.getElementById('y-coordinate').value);

    const inputX1 = parseFloat(document.getElementById('x-coordinate2').value);
    const inputY1 = parseFloat(document.getElementById('y-coordinate2').value);

    const vector1 = new Vector3([inputX, inputY, 0]);
    const vector2 = new Vector3([inputX1, inputY1, 0]);

    drawVectorNew(vector1, 'red');
    drawVectorNew(vector2, 'blue');

    const selectedOperation = document.getElementById('operation').value;
    const scalarValue = parseFloat(document.getElementById('scalar').value);

    let vector3, vector4;
    if (selectedOperation === 'add') {
        vector3 = vector1.add(vector2);
        drawVectorNew(vector3, 'green');
    } else if (selectedOperation === 'sub') {
        vector3 = vector1.sub(vector2);
        drawVectorNew(vector3, 'green');
    } else if (selectedOperation === 'mul') {
        vector3 = vector1.mul(scalarValue);
        vector4 = vector2.mul(scalarValue);
        drawVectorNew(vector3, 'green');
        drawVectorNew(vector4, 'green');
    } else if (selectedOperation === 'div') {
        vector3 = vector1.div(scalarValue);
        vector4 = vector2.div(scalarValue);
        drawVectorNew(vector3, 'green');
        drawVectorNew(vector4, 'green');
    } else if (selectedOperation === 'mag') {
        const magValue1 = vector1.magnitude();
        const magValue2 = vector2.magnitude();
        console.log(`Magnitude v1: ${magValue1}`);
        console.log(`Magnitude v2: ${magValue2}`);
    } else if (selectedOperation === 'norm') {
        const normValue1 = vector1.normalize();
        const normValue2 = vector2.normalize();
        drawVectorNew(normValue1, 'green');
        drawVectorNew(normValue2, 'green');
    } else if (selectedOperation === 'angleBetween') {
        const angleValue = calculateAngleBetween(vector1, vector2);
    } else if (selectedOperation === 'area') {
        const areaValue = calculateTriangleArea(vector1, vector2);
    }
}

function calculateAngleBetween(vectorA, vectorB) {
    const dotProductValue = Vector3.dot(vectorA, vectorB);
    const magValue1 = vectorA.magnitude();
    const magValue2 = vectorB.magnitude();

    const cosThetaValue = dotProductValue / (magValue1 * magValue2);
    const angleInRadians = Math.acos(Math.max(-1, Math.min(1, cosThetaValue)));
    const angleInDegrees = angleInRadians * (180 / Math.PI);

    console.log(`Angle: ${angleInDegrees}`);
    return angleInDegrees;
}

function calculateTriangleArea(vectorA, vectorB) {
    const crossProductValue = Vector3.cross(vectorA, vectorB);
    const magnitudeValue = crossProductValue.magnitude();
    const triangleAreaValue = magnitudeValue / 2;

    console.log(`Area: ${triangleAreaValue}`);
    return triangleAreaValue;
}
