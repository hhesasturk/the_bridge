import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser, setCurrentUser, removeUser } from '../utils/authStorage'
import { getInfluencerByUserId, deleteInfluencerByUserId } from '../utils/influencerDb'
import { supabase, hasSupabase } from '../lib/supabase'
import styles from '../styles/Profilim.module.css'

export default function Profilim() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [myInfluencer, setMyInfluencer] = useState(null)
  const [checkingProfile, setCheckingProfile] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    const u = getCurrentUser()
    if (!u) {
      navigate('/giris')
      return
    }
    setUser(u)
    getInfluencerByUserId(u.id).then((inf) => {
      if (!inf) {
        navigate('/profil-olustur', { replace: true })
        return
      }
      setMyInfluencer(inf)
      setCheckingProfile(false)
    })
  }, [navigate])

  const handleLogout = async () => {
    if (hasSupabase && supabase) await supabase.auth.signOut()
    setCurrentUser(null)
    navigate('/')
  }

  const handleDeleteAccount = async () => {
    if (!user || !confirmDelete) return
    await deleteInfluencerByUserId(user.id)
    if (hasSupabase && supabase) await supabase.auth.signOut()
    removeUser(user.id)
    setCurrentUser(null)
    setConfirmDelete(false)
    navigate('/')
  }

  if (!user) return null

  if (checkingProfile) {
    return (
      <div className={styles.page}>
        <div className="container">
          <p className={styles.checking}>Profil kontrol ediliyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.card}>
          <h1 className={styles.title}>Profilim</h1>
          <div className={styles.info}>
            <p><strong>Kullanici adi:</strong> {user.username || '-'}</p>
            <p><strong>E-posta:</strong> {user.email}</p>
            {user.socialHandles && Object.keys(user.socialHandles).some((k) => user.socialHandles[k]) && (
              <p className={styles.socialList}>
                <strong>Sosyal medya:</strong>{' '}
                {Object.entries(user.socialHandles)
                  .filter(([, v]) => v)
                  .map(([id, val]) => `${id}: ${val}`)
                  .join(' · ')}
              </p>
            )}
            {myInfluencer && (
              <p className={styles.profileLink}>
                <Link to={`/influencer/${myInfluencer.id}`}>Profilimi goruntule (Kesfet)</Link>
              </p>
            )}
          </div>

          <div className={styles.actions}>
            <Link to="/profilim/duzenle" className={styles.primaryBtn}>Profilimi duzenle</Link>
            <Link to="/kesfet" className={styles.secondaryBtn}>Kesfet sayfasina git</Link>
            {myInfluencer && (
              <Link to={`/influencer/${myInfluencer.id}`} className={styles.secondaryBtn}>Influencer kartimi goruntule</Link>
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
