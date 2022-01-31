// The GL fragment shader has its own module for clarity.

const fragmentShader : String = `
uniform highp vec4 colour;

void main(void) {
  gl_FragColor = colour;
}
`

export default fragmentShader;
