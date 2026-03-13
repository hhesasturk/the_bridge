import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser, setCurrentUser, removeUser } from '../utils/authStorage'
import { getStoredInfluencers, deleteInfluencerByUserId } from '../utils/influencerStorage'
import styles from '../styles/Profilim.module.css'

export default function Profilim() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    if (!u) navigate('/giris')
  }, [navigate])

  const handleLogout = () => {
    setCurrentUser(null)
    navigate('/')
  }

  const handleDeleteAccount = () => {
    if (!user || !confirmDelete) return
    deleteInfluencerByUserId(user.id)
    removeUser(user.id)
    setCurrentUser(null)
    setConfirmDelete(false)
    navigate('/')
  }

  if (!user) return null

  const myInfluencer = getStoredInfluencers().find((i) => i.userId === user.id)

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.card}>
          <h1 className={styles.title}>Profilim</h1>
          <div className={styles.info}>
            <p><strong>Kullanici adi:</strong> {user.username || '-'}</p>
            <p><strong>E-posta:</strong> {user.email}</p>
            {myInfluencer && (
              <p className={styles.profileLink}>
                <Link to={`/influencer/${myInfluencer.id}`}>Profilimi goruntule (Kesfet)</Link>
              </p>
            )}
          </div>

          <div className={styles.actions}>
            <Link to="/kesfet" className={styles.primaryBtn}>Kesfet sayfasina git</Link>
            {myInfluencer && (
              <Link to={`/influencer/${myInfluencer.id}`} className={styles.secondaryBtn}>Kartimi duzenle (yakinda)</Link>
            )}
            <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
              Cikis yap
            </button>
          </div>

          <hr className={styles.divider} />

          <div className={styles.dangerZone}>
            <h2 className={styles.dangerTitle}>Hesabi sil</h2>
            <p className={styles.dangerText}>
              Hesabiniz ve varsa influencer profiliniz kalici olarak silinir. Bu islem geri alinamaz.
            </p>
            {!confirmDelete ? (
              <button type="button" className={styles.deleteBtn} onClick={() => setConfirmDelete(true)}>
                Hesabimi sil
              </button>
            ) : (
              <div className={styles.confirmRow}>
                <button type="button" className={styles.confirmYes} onClick={handleDeleteAccount}>
                  Evet, hesabimi sil
                </button>
                <button type="button" className={styles.confirmNo} onClick={() => setConfirmDelete(false)}>
                  Iptal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
