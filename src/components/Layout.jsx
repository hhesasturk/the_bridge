import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import styles from '../styles/Layout.module.css'

export default function Layout() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <Link to="/" className={styles.logo}>
              The Bridge
            </Link>
            <nav className={styles.nav}>
              <Link to="/kesfet" className={styles.navLink}>
                Influencer Kesfet
              </Link>
              <Link to="/giris" className={styles.navLink}>
                Giris Yap
              </Link>
              <Link to="/giris" className={styles.ctaButton}>
                Influencer Olarak Katil
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerInner}>
            <span className={styles.footerLogo}>The Bridge</span>
            <p className={styles.footerText}>
              Markalar ve mikro influencerlar icin is birligi platformu. Platform su an ucretsizdir.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
