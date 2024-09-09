const canvas = document.getElementById("shaderCanvas");
const gl = canvas.getContext("webgl");

// Vertex shader (simple pass-through)
const vertexShaderSource = `
    attribute vec4 a_position;
    void main() {
        gl_Position = a_position;
    }
`;

// Fragment shader (VHS effect with fisheye distortion and horizontal noise)
const fragmentShaderSource = `
    precision mediump float;
    uniform float u_time;
    uniform vec2 u_resolution;

    // Function to apply fisheye distortion
    vec2 fisheye(vec2 uv) {
        vec2 centered = uv - 0.5;
        float dist = length(centered) * 2.0;
        float theta = atan(centered.y, centered.x);
        dist = dist * dist * 0.5; // Distort based on distance (fisheye effect)
        centered = dist * vec2(cos(theta), sin(theta));
        return centered + 0.5;
    }

    // Simple noise function
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    // VHS noise
    vec3 vhs_noise(vec2 uv) {
        float noiseIntensity = random(vec2(uv.y, u_time)) * 0.2; // Horizontal noise
        return vec3(noiseIntensity, noiseIntensity, noiseIntensity);
    }

    void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;

        // Apply fisheye distortion
        uv = fisheye(uv);

        // Simulate VHS-like horizontal noise
        vec3 color = vec3(0.0);
        color += vhs_noise(uv);

        // Base colors with VHS distortion
        color += vec3(uv.x, uv.y * 0.5, 1.0 - uv.x) * 0.6;

        // Add glitchy scanline effect
        float scanline = sin(uv.y * u_resolution.y * 0.3 + u_time * 10.0) * 0.05;
        color += vec3(scanline);

        gl_FragColor = vec4(color, 1.0);
    }
`;

// Compile and link the shaders
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

// Provide geometry for rendering (two triangles covering the entire screen)
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = [
    -1, -1,
    1, -1,
    -1, 1,
    1, -1,
    1, 1,
    -1, 1
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

const positionLocation = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// Set the uniform locations
const timeLocation = gl.getUniformLocation(program, "u_time");
const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

// Animation loop
function render(time) {
    time *= 0.001; // Convert to seconds

    // Set the resolution uniform
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    
    // Set the time uniform
    gl.uniform1f(timeLocation, time);

    // Clear the canvas and draw the scene
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(render);
}

// Start the animation loop
requestAnimationFrame(render);
