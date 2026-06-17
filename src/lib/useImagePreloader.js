import { useState, useEffect } from 'react'

export function useImagePreloader(urls) {
  const [loaded, setLoaded] = useState(0)
  const [done, setDone] = useState(false)
  const key = urls.join('|')

  useEffect(() => {
    setLoaded(0)
    setDone(false)

    if (!urls.length) {
      setDone(true)
      return
    }

    let count = 0
    let cancelled = false

    urls.forEach(url => {
      const img = new Image()
      const onFinish = () => {
        if (cancelled) return
        count++
        setLoaded(count)
        if (count >= urls.length) setDone(true)
      }
      img.onload = onFinish
      img.onerror = onFinish
      img.src = url
    })

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return { loaded, total: urls.length, done }
}