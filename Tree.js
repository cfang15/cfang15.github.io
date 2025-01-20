class Tree {
    constructor() {
        this.type = 'tree';
        this.position = [0.0, 0.0]; // Default center position
        this.colorTrunk = [0.5, 0.25, 0.0, 1.0]; // Brown trunk color
        this.colorCanopy = [0.0, 0.8, 0.0, 1.0]; // Green canopy color
        this.size = 20.0; // Base size of the tree
    }

    render() {
        const [x, y] = this.position;

        // Render the trunk (6 triangles for 3 stacked rectangles)
        this.drawTrunk(x, y);

        // Render the canopy (at least 14 triangles for foliage layers)
        this.drawCanopy(x, y + this.size * 0.5);
    }

    drawTrunk(x, y) {
        const trunkHeight = this.size * 0.5; // Total trunk height
        const trunkWidth = this.size * 0.1; // Trunk width
        const numTrunkLayers = 3; // Number of stacked rectangles (2 triangles each)

        const layerHeight = trunkHeight / numTrunkLayers;

        gl.uniform4f(u_FragColor, ...this.colorTrunk); // Set trunk color

        for (let i = 0; i < numTrunkLayers; i++) {
            const bottom = y + i * layerHeight;
            const top = bottom + layerHeight;

            // Each rectangle is made of 2 triangles
            drawTriangle([
                x - trunkWidth, bottom,   // Bottom left
                x + trunkWidth, bottom,   // Bottom right
                x - trunkWidth, top,      // Top left
            ]);
            drawTriangle([
                x + trunkWidth, bottom,   // Bottom right
                x - trunkWidth, top,      // Top left
                x + trunkWidth, top,      // Top right
            ]);
        }
    }

    drawCanopy(x, y) {
        const canopyRadius = this.size * 0.6; // Radius of the canopy
        const numLayers = 4; // Number of layers for the canopy
        const trianglesPerLayer = 5; // Number of triangles per layer
        const layerHeight = canopyRadius / numLayers;

        gl.uniform4f(u_FragColor, ...this.colorCanopy); // Set canopy color

        for (let layer = 0; layer < numLayers; layer++) {
            const layerY = y + layer * layerHeight * 0.8; // Vertical offset for each layer
            const layerWidth = canopyRadius * (1 - layer / numLayers); // Shrink width per layer

            for (let i = 0; i < trianglesPerLayer; i++) {
                const offsetX = (i - (trianglesPerLayer - 1) / 2) * (layerWidth / trianglesPerLayer);
                drawTriangle([
                    x + offsetX, layerY,                               // Top of the triangle
                    x + offsetX - layerWidth / trianglesPerLayer, layerY - layerHeight, // Bottom left
                    x + offsetX + layerWidth / trianglesPerLayer, layerY - layerHeight, // Bottom right
                ]);
            }
        }
    }
}

function drawTriangle(vertices) {
    const n = 3; // Number of vertices

    // Create a buffer object
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, n);
}
