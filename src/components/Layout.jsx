import { useState, useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { getCurrentUser, setCurrentUser } from '../utils/authStorage'
import styles from '../styles/Layout.module.css'

export default function Layout() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
  }, [])

  useEffect(() => {
    const onAuthChange = () => setUser(getCurrentUser())
    window.addEventListener('auth-change', onAuthChange)
    return () => window.removeEventListener('auth-change', onAuthChange)
  }, [])

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
              {user ? (
                <>
                  <Link to="/profilim" className={styles.navLink}>
                    Profilim
                  </Link>
                  <Link to="/kesfet" className={styles.ctaButton}>
                    Kesfet
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/giris" className={styles.navLink}>
                    Giris Yap
                  </Link>
                  <Link to="/giris" className={styles.ctaButton}>
                    Influencer Olarak Katil
                  </Link>
                </>
              )}
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
            <p className={styles.footerContact}>
              Iletisim: <a href="mailto:maniwebst@gmail.com">maniwebst@gmail.com</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
