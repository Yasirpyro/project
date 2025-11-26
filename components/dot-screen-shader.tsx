'use client'

import { useMemo, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { shaderMaterial, useTrailTexture } from '@react-three/drei'
import { useTheme } from 'next-themes'
import * as THREE from 'three'

type DotThemeColors = {
  dotColor: string
  bgColor: string
  dotOpacity: number
}

const getThemeColors = (themeKey?: string | null): DotThemeColors => {
  switch (themeKey) {
    case 'light':
      return {
        dotColor: '#2563eb',
        bgColor: '#F4F6FB',
        dotOpacity: 0.16
      }
    case 'dark':
    default:
      return {
        dotColor: '#f5f5f5',
        bgColor: '#05070b',
        dotOpacity: 0.06
      }
  }
}

const hexToRgba = (hex: string, alpha: number) => {
  const value = hex.replace('#', '')
  const normalized = value.length === 3 ? value.split('').map((char) => char + char).join('') : value
  const int = parseInt(normalized, 16)
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Guard Canvas creation inside sandboxed previews where WebGL is disabled.
const checkWebGLSupport = () => {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')

    const supported = Boolean(gl)
    if (gl && 'getExtension' in gl) {
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
    return supported
  } catch (error) {
    return false
  }
}

const useWebGLSupport = () => {
  const [supported, setSupported] = useState<boolean | null>(null)

  useEffect(() => {
    setSupported(checkWebGLSupport())
  }, [])

  return supported
}

const DotMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(),
    dotColor: new THREE.Color('#FFFFFF'),
    bgColor: new THREE.Color('#121212'),
    mouseTrail: null,
    render: 0,
    rotation: 0,
    gridSize: 50,
    dotOpacity: 0.05
  },
  /* glsl */ `
    void main() {
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  /* glsl */ `
    uniform float time;
    uniform int render;
    uniform vec2 resolution;
    uniform vec3 dotColor;
    uniform vec3 bgColor;
    uniform sampler2D mouseTrail;
    uniform float rotation;
    uniform float gridSize;
    uniform float dotOpacity;

    vec2 rotate(vec2 uv, float angle) {
        float s = sin(angle);
        float c = cos(angle);
        mat2 rotationMatrix = mat2(c, -s, s, c);
        return rotationMatrix * (uv - 0.5) + 0.5;
    }

    vec2 coverUv(vec2 uv) {
      vec2 s = resolution.xy / max(resolution.x, resolution.y);
      vec2 newUv = (uv - 0.5) * s + 0.5;
      return clamp(newUv, 0.0, 1.0);
    }

    float sdfCircle(vec2 p, float r) {
        return length(p - 0.5) - r;
    }

    void main() {
      vec2 screenUv = gl_FragCoord.xy / resolution;
      vec2 uv = coverUv(screenUv);

      vec2 rotatedUv = rotate(uv, rotation);

      // Create a grid
      vec2 gridUv = fract(rotatedUv * gridSize);
      vec2 gridUvCenterInScreenCoords = rotate((floor(rotatedUv * gridSize) + 0.5) / gridSize, -rotation);

      // Calculate distance from the center of each cell
      float baseDot = sdfCircle(gridUv, 0.25);

      // Screen mask
      float screenMask = smoothstep(0.0, 1.0, 1.0 - uv.y); // 0 at the top, 1 at the bottom
      vec2 centerDisplace = vec2(0.7, 1.1);
      float circleMaskCenter = length(uv - centerDisplace);
      float circleMaskFromCenter = smoothstep(0.5, 1.0, circleMaskCenter);
      
      float combinedMask = screenMask * circleMaskFromCenter;
      float circleAnimatedMask = sin(time * 2.0 + circleMaskCenter * 10.0);

      // Mouse trail effect
      float mouseInfluence = texture2D(mouseTrail, gridUvCenterInScreenCoords).r;
      
      float scaleInfluence = max(mouseInfluence * 0.6, circleAnimatedMask * 0.25);

      // Create dots with animated scale, influenced by mouse
      float dotSize = min(pow(circleMaskCenter, 2.0) * 0.3, 0.3);

      float sdfDot = sdfCircle(gridUv, dotSize * (1.0 + scaleInfluence * 0.6));

      float smoothDot = smoothstep(0.05, 0.0, sdfDot);

      float opacityInfluence = max(mouseInfluence * 35.0, circleAnimatedMask * 0.4);

      // Mix background color with dot color, using animated opacity to increase visibility
      vec3 composition = mix(bgColor, dotColor, smoothDot * combinedMask * dotOpacity * (1.0 + opacityInfluence));

      gl_FragColor = vec4(composition, 1.0);

      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `
)

type SceneProps = {
  themeColors: DotThemeColors
}

function Scene({ themeColors }: SceneProps) {
  const size = useThree((s) => s.size)
  const viewport = useThree((s) => s.viewport)
  
  const rotation = 0
  const gridSize = 100

  const [trail, onMove] = useTrailTexture({
    size: 512,
    radius: 0.12,
    maxAge: 450,
    interpolate: 1.2,
    smoothing: 0.75,
    intensity: 0.35,
    ease: function easeInOutCirc(x) {
      return x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2
    }
  })

  const pointerTarget = useRef(new THREE.Vector2(0.5, 0.5))
  const pointerCurrent = useRef(new THREE.Vector2(0.5, 0.5))
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const smoothStep = () => {
      pointerCurrent.current.lerp(pointerTarget.current, 0.12)
      onMove({ uv: pointerCurrent.current.clone() } as any)
      if (pointerCurrent.current.distanceTo(pointerTarget.current) > 0.001) {
        rafRef.current = requestAnimationFrame(smoothStep)
      } else {
        rafRef.current = null
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointerTarget.current.set(
        event.clientX / window.innerWidth,
        event.clientY / window.innerHeight
      )
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(smoothStep)
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [onMove])

  const dotMaterial = useMemo(() => {
    return new DotMaterial()
  }, [])

  useEffect(() => {
    dotMaterial.uniforms.dotColor.value.setHex(themeColors.dotColor.replace('#', '0x'))
    dotMaterial.uniforms.bgColor.value.setHex(themeColors.bgColor.replace('#', '0x'))
    dotMaterial.uniforms.dotOpacity.value = themeColors.dotOpacity
  }, [dotMaterial, themeColors])

  useFrame((state) => {
    dotMaterial.uniforms.time.value = state.clock.elapsedTime
  })

  const scale = Math.max(viewport.width, viewport.height) / 2

  return (
    <mesh scale={[scale, scale, 1]}>
      <planeGeometry args={[2, 2]} />
      <primitive
        object={dotMaterial}
        resolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
        rotation={rotation}
        gridSize={gridSize}
        mouseTrail={trail}
        render={0}
      />
    </mesh>
  )
}

export const DotScreenShader = () => {
  const webglSupported = useWebGLSupport()
  const { theme, resolvedTheme } = useTheme()
  const themeKey = resolvedTheme || theme
  const themeColors = useMemo(() => getThemeColors(themeKey), [themeKey])

  const fallbackStyle = useMemo<CSSProperties>(() => ({
    width: '100%',
    height: '100%',
    borderRadius: 'inherit',
    backgroundColor: themeColors.bgColor,
    backgroundImage: `radial-gradient(circle at 25% 20%, ${hexToRgba(themeColors.dotColor, 0.18)}, transparent 45%), radial-gradient(circle at 75% 15%, ${hexToRgba(themeColors.dotColor, 0.1)}, transparent 55%), linear-gradient(135deg, ${themeColors.bgColor}, ${themeColors.bgColor})`
  }), [themeColors])

  if (webglSupported !== true) {
    return <div style={fallbackStyle} aria-hidden role="presentation" />
  }

  return (
    <Canvas
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        outputColorSpace: THREE.SRGBColorSpace,
        toneMapping: THREE.NoToneMapping
      }}>
      <Scene themeColors={themeColors} />
    </Canvas>
  )
}
