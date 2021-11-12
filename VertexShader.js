// The GL vertex shader has its own module for clarity.

const vertexShader = `
attribute vec4 modPosition;
uniform mat4 modToClip;

void main(void) {
  gl_Position = modToClip * modPosition;
}
`

export default vertexShader;
