import { useRef, useLayoutEffect, useState } from 'react'

function FitText({ text, maxSize = 220, minSize = 32, className }) {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const [fontSize, setFontSize] = useState(minSize)

  useLayoutEffect(() => {
    function fit() {
      const container = containerRef.current
      const el = textRef.current
      if (!container || !el) return

      // Binary search for the largest size that fits both dimensions,
      // rather than starting at maxSize and only ever shrinking down
      let lo = minSize
      let hi = maxSize
      let best = minSize

      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2)
        el.style.fontSize = `${mid}px`
        const fits = el.scrollWidth <= container.clientWidth && el.scrollHeight <= container.clientHeight
        if (fits) {
          best = mid
          lo = mid + 1
        } else {
          hi = mid - 1
        }
      }

      el.style.fontSize = `${best}px`
      setFontSize(best)
    }

    fit()
    const ro = new ResizeObserver(fit)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [text, maxSize, minSize])

  return (
    <div ref={containerRef} className={className}>
      <span ref={textRef} style={{ fontSize }}>{text}</span>
    </div>
  )
}

export default FitText