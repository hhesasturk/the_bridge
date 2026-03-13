import { useParams, Link } from 'react-router-dom'
import { mockInfluencers } from '../data/mockInfluencers'
import { getStoredInfluencers } from '../utils/influencerStorage'
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

function getAllInfluencers() {
  return [...getStoredInfluencers(), ...mockInfluencers]
}

export default function ProfileDetail() {
  const { id } = useParams()
  const influencer = getAllInfluencers().find((i) => i.id === id)

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

  return (
    <div className={styles.page}>
      <div className="container">
        <Link to="/kesfet" className={styles.backLink}>
          Kesfet sayfasina don
        </Link>

        <div className={styles.profile}>
          <div className={styles.header}>
            <div className={styles.avatarWrap}>
              <img
                src={avatar}
                alt={username}
                className={styles.avatar}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'
                }}
              />
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
