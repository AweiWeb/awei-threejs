import { Effect, BlendFunction } from 'postprocessing';
import { Uniform, WebGLRenderer, WebGLRenderTarget } from 'three';
const fragmentShader = /* glsl */ `
uniform float frequery;
uniform float amplitude;
uniform float time;
  void mainUv(inout vec2 uv)
  {
      uv.y += sin(uv.x * frequery + time) * amplitude;
  }
  
 void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
    {
        outputColor = vec4(0.8, 1.0, 0.5, inputColor.a);
    }
`;

class DruckEffect extends Effect {
  constructor({
    frequery,
    amplitude,
    blendFunction = BlendFunction.DARKEN,
  }: any) {
    super('DruckEffect', fragmentShader, {
      uniforms: new Map([
        ['frequery', new Uniform(frequery)],
        ['amplitude', new Uniform(amplitude)],
        ['time', new Uniform(0)],
      ]),
      blendFunction,
    });
  }
  update(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget,
    deltaTime?: number
  ): void {
      this.uniforms.get('time').value += deltaTime
  }
}

export default DruckEffect;
