import { Link } from 'react-router-dom'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Markalar ve Influencerlar icin Is Birligi Platformu
            </h1>
            <p className={styles.heroSubtitle}>
              Mikro influencerlar ve markalar burada kolayca bulusur.
            </p>
            <div className={styles.heroButtons}>
              <Link to="/giris" className={styles.buttonPrimary}>
                Influencer olarak katil
              </Link>
              <Link to="/kesfet" className={styles.buttonSecondary}>
                Influencer kesfet
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className="container">
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Kolay Profil Olustur</h3>
              <p className={styles.featureText}>
                Influencerlar birkac adimda profillerini olusturabilir.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Markalar Icin Kesfet</h3>
              <p className={styles.featureText}>
                Markalar kategori ve icerik turune gore influencer bulabilir.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Hizli Is Birligi</h3>
              <p className={styles.featureText}>
                Dogrudan iletisim kurarak is birligi baslatilabilir.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
