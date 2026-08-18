import { useCallback, useRef } from 'react'
import './BorderGlow.css'

const parseHsl = (value) => value.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/)?.slice(1).map(Number) ?? [270, 80, 78]

export default function BorderGlow({ children, className = '', edgeSensitivity = 28, glowColor = '270 88 76', backgroundColor = '#0d0820', borderRadius = 28, glowRadius = 32, glowIntensity = 1, colors = ['#b86cff', '#ee7ae0', '#60b7ff'] }) {
  const ref = useRef(null)
  const handlePointerMove = useCallback((event) => {
    const card = ref.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const dx = x - cx
    const dy = y - cy
    const kx = dx === 0 ? Infinity : cx / Math.abs(dx)
    const ky = dy === 0 ? Infinity : cy / Math.abs(dy)
    const proximity = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1)
    let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90
    if (angle < 0) angle += 360
    card.style.setProperty('--edge-proximity', `${(proximity * 100).toFixed(2)}`)
    card.style.setProperty('--cursor-angle', `${angle.toFixed(2)}deg`)
  }, [])
  const [h, s, l] = parseHsl(glowColor)
  return <div ref={ref} onPointerMove={handlePointerMove} className={`border-glow-card ${className}`.trim()} style={{
    '--card-bg': backgroundColor, '--border-radius': `${borderRadius}px`, '--glow-padding': `${glowRadius}px`, '--edge-sensitivity': edgeSensitivity,
    '--glow-color': `hsl(${h}deg ${s}% ${l}% / ${Math.min(glowIntensity, 1)})`, '--gradient-one': colors[0], '--gradient-two': colors[1], '--gradient-three': colors[2]
  }}><span className="edge-light" /><div className="border-glow-inner">{children}</div></div>
}
