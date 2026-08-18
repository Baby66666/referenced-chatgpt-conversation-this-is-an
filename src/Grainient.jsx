import { useEffect, useRef } from 'react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'

const hexToRgb = (hex) => {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return match ? [parseInt(match[1], 16) / 255, parseInt(match[2], 16) / 255, parseInt(match[3], 16) / 255] : [1, 1, 1]
}

const vertex = `#version 300 es
in vec2 position;
void main(){gl_Position=vec4(position,0.0,1.0);}`

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;uniform float iTime,uTimeSpeed,uColorBalance,uWarpStrength,uWarpFrequency,uWarpSpeed,uWarpAmplitude,uBlendAngle,uBlendSoftness,uRotationAmount,uNoiseScale,uGrainAmount,uGrainScale,uGrainAnimated,uContrast,uGamma,uSaturation,uZoom;uniform vec2 uCenterOffset;uniform vec3 uColor1,uColor2,uColor3;out vec4 fragColor;
mat2 rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}vec2 hash(vec2 p){return fract(sin(vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37))))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return .5+.5*mix(mix(dot(-1.+2.*hash(i),f),dot(-1.+2.*hash(i+vec2(1.,0.)),f-vec2(1.,0.)),u.x),mix(dot(-1.+2.*hash(i+vec2(0.,1.)),f-vec2(0.,1.)),dot(-1.+2.*hash(i+vec2(1.,1.)),f-vec2(1.,1.)),u.x),u.y);}void main(){float t=iTime*uTimeSpeed;vec2 uv=gl_FragCoord.xy/iResolution.xy,tuv=uv-.5+uCenterOffset;tuv/=max(uZoom,.001);float ratio=iResolution.x/iResolution.y,degree=noise(vec2(t*.1,tuv.x*tuv.y)*uNoiseScale);tuv.y/=ratio;tuv*=rot(radians((degree-.5)*uRotationAmount+180.));tuv.y*=ratio;float freq=uWarpFrequency,amp=uWarpAmplitude/max(uWarpStrength,.001),wt=t*uWarpSpeed;tuv.x+=sin(tuv.y*freq+wt)/amp;tuv.y+=sin(tuv.x*(freq*1.5)+wt)/(amp*.5);float b=uColorBalance,s=max(uBlendSoftness,0.);float blendX=(tuv*rot(radians(uBlendAngle))).x;float edge0=-.3-b-s,edge1=.2-b+s;vec3 layer1=mix(uColor3,uColor2,smoothstep(edge0,edge1,blendX));vec3 layer2=mix(uColor2,uColor1,smoothstep(edge0,edge1,blendX));vec3 col=mix(layer1,layer2,smoothstep(.5-b+s,-.3-b-s,tuv.y));vec2 grainUv=uv*max(uGrainScale,.001);if(uGrainAnimated>.5)grainUv+=vec2(iTime*.05);float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);col+=(grain-.5)*uGrainAmount;col=(col-.5)*uContrast+.5;float luma=dot(col,vec3(.2126,.7152,.0722));col=mix(vec3(luma),col,uSaturation);col=pow(max(col,0.),vec3(1./max(uGamma,.001)));fragColor=vec4(clamp(col,0.,1.),1.);}`

export default function Grainient({
  color1 = '#121807', color2 = '#527300', color3 = '#030304', timeSpeed = .16,
  colorBalance = .32, warpStrength = 1, warpFrequency = 4, warpSpeed = .55,
  warpAmplitude = 50, blendAngle = 16, blendSoftness = .06, rotationAmount = 230,
  noiseScale = 1.5, grainAmount = .075, grainScale = 2, grainAnimated = true,
  contrast = 1.3, gamma = 1, saturation = .8, centerX = 0, centerY = 0, zoom = .9,
  maxDpr = 1.25, fps = 30, className = ''
}) {
  const ref = useRef(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return undefined
    const renderer = new Renderer({ webgl: 2, alpha: true, antialias: false, dpr: Math.min(devicePixelRatio || 1, maxDpr) })
    const { gl } = renderer
    const canvas = gl.canvas
    Object.assign(canvas.style, { width: '100%', height: '100%', display: 'block' })
    container.appendChild(canvas)
    const program = new Program(gl, { vertex, fragment, uniforms: {
      iTime: { value: 0 }, iResolution: { value: new Float32Array([1, 1]) }, uTimeSpeed: { value: timeSpeed }, uColorBalance: { value: colorBalance }, uWarpStrength: { value: warpStrength }, uWarpFrequency: { value: warpFrequency }, uWarpSpeed: { value: warpSpeed }, uWarpAmplitude: { value: warpAmplitude }, uBlendAngle: { value: blendAngle }, uBlendSoftness: { value: blendSoftness }, uRotationAmount: { value: rotationAmount }, uNoiseScale: { value: noiseScale }, uGrainAmount: { value: grainAmount }, uGrainScale: { value: grainScale }, uGrainAnimated: { value: grainAnimated ? 1 : 0 }, uContrast: { value: contrast }, uGamma: { value: gamma }, uSaturation: { value: saturation }, uCenterOffset: { value: new Float32Array([centerX, centerY]) }, uZoom: { value: zoom }, uColor1: { value: new Float32Array(hexToRgb(color1)) }, uColor2: { value: new Float32Array(hexToRgb(color2)) }, uColor3: { value: new Float32Array(hexToRgb(color3)) }
    } })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })
    const resize = () => { const box = container.getBoundingClientRect(); renderer.setSize(Math.max(1, box.width), Math.max(1, box.height)); program.uniforms.iResolution.value.set([gl.drawingBufferWidth, gl.drawingBufferHeight]) }
    const observer = new ResizeObserver(resize)
    observer.observe(container); resize()
    let frame = 0; let visible = false; let lastDraw = 0; const start = performance.now(); const frameInterval = 1000 / fps
    const startLoop = () => { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw) }
    const draw = (time) => { if (!visible || document.hidden) { frame = 0; return } if (time - lastDraw >= frameInterval) { lastDraw = time; program.uniforms.iTime.value = (time - start) * .001; renderer.render({ scene: mesh }) } frame = requestAnimationFrame(draw) }
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) startLoop() })
    intersection.observe(container)
    const onVisibilityChange = () => startLoop()
    document.addEventListener('visibilitychange', onVisibilityChange)
    startLoop()
    return () => { cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect(); document.removeEventListener('visibilitychange', onVisibilityChange); canvas.remove() }
  }, [blendAngle, blendSoftness, centerX, centerY, color1, color2, color3, colorBalance, contrast, fps, gamma, grainAmount, grainAnimated, grainScale, maxDpr, noiseScale, rotationAmount, saturation, timeSpeed, warpAmplitude, warpFrequency, warpSpeed, warpStrength, zoom])

  return <div ref={ref} className={`grainient-container ${className}`.trim()} />
}
