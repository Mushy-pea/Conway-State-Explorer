// The GL fragment shader has its own module for clarity.

const fragmentShader = `
uniform highp vec4 colour;

void main(void) {
  gl_FragColor = colour;
}
`

export default fragmentShader;
