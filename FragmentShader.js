// The GL fragment shader has its own module for clarity.

const fragmentShader = `
uniform highp vec4 colour;

void main(void) {
  float g = 0.4545455;
  vec4 gamma = vec4(g, g, g, 1);
  gl_FragColor = pow(colour, gamma);
}
`

export default fragmentShader;
