import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CITY_FILTER_ALL } from '../config/constants'
import styles from '../styles/InfluencerCard.module.css'

function formatFollowers(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}

function getCityDisplay(influencer) {
  if (influencer.cities && influencer.cities.length) {
    if (influencer.cities.includes(CITY_FILTER_ALL) && influencer.cities.length === 1) return CITY_FILTER_ALL
    return influencer.cities.join(', ')
  }
  return influencer.city || 'Belirtilmedi'
}

function initialLetter(username) {
  const s = (username || '?').trim()
  return s.charAt(0).toUpperCase() || '?'
}

export default function InfluencerCard({ influencer }) {
  const { id, username, avatar, followers, categories = [] } = influencer
  const cityDisplay = getCityDisplay(influencer)
  const hasPhoto = avatar && String(avatar).trim().length > 0
  const [imgBroken, setImgBroken] = useState(false)
  const showImage = hasPhoto && !imgBroken

  return (
    <article className={styles.card}>
      <div className={styles.avatarWrap}>
        {showImage ? (
          <img
            src={avatar}
            alt={username}
            className={styles.avatar}
            onError={() => setImgBroken(true)}
          />
        ) : null}
        {!showImage ? (
          <div className={styles.avatarPlaceholder} aria-hidden>
            {initialLetter(username)}
          </div>
        ) : null}
      </div>
      <h3 className={styles.username}>{username}</h3>
      <p className={styles.followers}>{formatFollowers(followers)} takipci</p>
      <p className={styles.city}>{cityDisplay}</p>
      <div className={styles.tags}>
        {categories.slice(0, 3).map((cat) => (
          <span key={cat} className={styles.tag}>
            {cat}
          </span>
        ))}
      </div>
      <Link to={`/influencer/${id}`} className={styles.button}>
        Profil goruntule
      </Link>
    </article>
  )
}
