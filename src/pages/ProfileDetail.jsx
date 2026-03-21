import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { mockInfluencers } from '../data/mockInfluencers'
import { getAllInfluencers } from '../utils/influencerDb'
import { CITY_FILTER_ALL } from '../config/constants'
import styles from '../styles/ProfileDetail.module.css'

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

export default function ProfileDetail() {
  const { id } = useParams()
  const [influencer, setInfluencer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgBroken, setImgBroken] = useState(false)

  useEffect(() => {
    setImgBroken(false)
  }, [id])

  useEffect(() => {
    let cancelled = false
    getAllInfluencers()
      .then((stored) => [...stored, ...mockInfluencers])
      .then((all) => all.find((i) => i.id === id))
      .then((found) => { if (!cancelled) setInfluencer(found ?? null) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container">
          <p className={styles.loading}>Yukleniyor...</p>
        </div>
      </div>
    )
  }

  if (!influencer) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.notFound}>
            <h2>Profil bulunamadi</h2>
            <Link to="/kesfet">Influencer kesfet sayfasina don</Link>
          </div>
        </div>
      </div>
    )
  }

  const { username, fullName, avatar, instagramHandle, followers, categories = [], collaborationTypes = [], bio } = influencer
  const cityDisplay = getCityDisplay(influencer)
  const hasPhoto = avatar && String(avatar).trim().length > 0
  const showImage = hasPhoto && !imgBroken

  return (
    <div className={styles.page}>
      <div className="container">
        <Link to="/kesfet" className={styles.backLink}>
          Kesfet sayfasina don
        </Link>

        <div className={styles.profile}>
          <div className={styles.header}>
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
            <div className={styles.headerInfo}>
              <h1 className={styles.fullName}>{fullName}</h1>
              <p className={styles.username}>{instagramHandle}</p>
              <p className={styles.followers}>{formatFollowers(followers)} takipci</p>
              <p className={styles.city}>{cityDisplay}</p>
            </div>
          </div>

          {bio && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Hakkimda</h2>
              <p className={styles.bio}>{bio}</p>
            </section>
          )}

          {categories.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Icerik Kategorileri</h2>
              <div className={styles.tags}>
                {categories.map((cat) => (
                  <span key={cat} className={styles.tag}>
                    {cat}
                  </span>
                ))}
              </div>
            </section>
          )}

          {collaborationTypes.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Kabul Ettigi Is Birligi Turleri</h2>
              <ul className={styles.list}>
                {collaborationTypes.map((type) => (
                  <li key={type}>{type}</li>
                ))}
              </ul>
            </section>
          )}

          <div className={styles.actions}>
            <a
              href={`https://instagram.com/${username.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryButton}
            >
              Instagram profili
            </a>
            <button type="button" className={styles.secondaryButton}>
              Iletisime gec
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
