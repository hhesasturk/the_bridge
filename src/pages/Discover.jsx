import { useMemo, useState } from 'react'
import { CONTENT_CATEGORIES, CITIES, CITY_FILTER_ALL, FOLLOWER_RANGES, CONTENT_TYPE_FILTER_OPTIONS } from '../config/constants'
import { mockInfluencers } from '../data/mockInfluencers'
import { getStoredInfluencers } from '../utils/influencerStorage'
import InfluencerCard from '../components/InfluencerCard'
import styles from '../styles/Discover.module.css'

export default function Discover() {
  const [category, setCategory] = useState('')
  const [city, setCity] = useState('')
  const [followerRange, setFollowerRange] = useState('')
  const [contentType, setContentType] = useState('')

  const allInfluencers = useMemo(() => {
    const stored = getStoredInfluencers()
    return [...stored, ...mockInfluencers]
  }, [])

  const filtered = useMemo(() => {
    let list = [...allInfluencers]

    const cat = category.trim()
    if (cat) {
      list = list.filter((i) =>
        (i.categories || []).some((c) => c.toLowerCase().includes(cat.toLowerCase()))
      )
    }

    const cityVal = city.trim()
    if (cityVal && cityVal !== CITY_FILTER_ALL) {
      list = list.filter((i) => {
        if (i.cities && i.cities.length) {
          return i.cities.some((c) => c === cityVal)
        }
        return i.city === cityVal
      })
    }

    const rangeVal = followerRange.trim()
    if (rangeVal) {
      const range = FOLLOWER_RANGES.find((r) => r.label === rangeVal)
      if (range) {
        list = list.filter(
          (i) => i.followers >= range.min && i.followers <= range.max
        )
      }
    }

    const typeVal = contentType.trim()
    if (typeVal) {
      list = list.filter((i) =>
        (i.collaborationTypes || []).some((t) =>
          t.toLowerCase().includes(typeVal.toLowerCase())
        )
      )
    }

    return list
  }, [allInfluencers, category, city, followerRange, contentType])

  const clearFilters = () => {
    setCategory('')
    setCity('')
    setFollowerRange('')
    setContentType('')
  }

  const hasFilters = category.trim() || city.trim() || followerRange.trim() || contentType.trim()

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1>Influencer Kesfet</h1>
          <p>Kategori, takipci araligi, sehir ve icerik turune gore arayin. Isterseniz listelerden secin, isterseniz elle yazin.</p>
        </div>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Kategori</label>
              <input
                type="text"
                className={styles.filterInput}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                list="filter-category"
                placeholder="Secin veya yazin"
                autoComplete="off"
              />
              <datalist id="filter-category">
                {CONTENT_CATEGORIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Takipci araligi</label>
              <input
                type="text"
                className={styles.filterInput}
                value={followerRange}
                onChange={(e) => setFollowerRange(e.target.value)}
                list="filter-followers"
                placeholder="Secin veya yazin"
                autoComplete="off"
              />
              <datalist id="filter-followers">
                {FOLLOWER_RANGES.map((r) => (
                  <option key={r.label} value={r.label} />
                ))}
              </datalist>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Sehir</label>
              <input
                type="text"
                className={styles.filterInput}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                list="filter-city"
                placeholder="Secin veya yazin"
                autoComplete="off"
              />
              <datalist id="filter-city">
                <option value={CITY_FILTER_ALL} />
                {CITIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Icerik turu</label>
              <input
                type="text"
                className={styles.filterInput}
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                list="filter-contenttype"
                placeholder="Secin veya yazin"
                autoComplete="off"
              />
              <datalist id="filter-contenttype">
                {CONTENT_TYPE_FILTER_OPTIONS.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </div>
            {hasFilters && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={clearFilters}
              >
                Filtreleri temizle
              </button>
            )}
          </aside>

          <div className={styles.main}>
            <p className={styles.resultCount}>
              {filtered.length} influencer listeleniyor
            </p>
            <div className={styles.grid}>
              {filtered.map((influencer) => (
                <InfluencerCard key={influencer.id} influencer={influencer} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className={styles.empty}>
                <p>Filtrelere uygun influencer bulunamadi.</p>
                <button
                  type="button"
                  className={styles.clearButton}
                  onClick={clearFilters}
                >
                  Filtreleri temizle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
