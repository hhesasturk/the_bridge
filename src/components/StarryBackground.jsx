import { useMemo } from 'react'
import styles from '../styles/StarryBackground.module.css'

export default function StarryBackground() {
  const stars = useMemo(() => {
    const list = []
    for (let i = 0; i < 80; i++) {
      list.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 2,
      })
    }
    return list
  }, [])

  return (
    <div className={styles.wrapper} aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className={styles.star}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDuration: `${s.duration}s`,
            animationDelay: `-${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
