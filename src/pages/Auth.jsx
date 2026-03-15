import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SOCIAL_PLATFORMS } from '../config/constants'
import { getUsers, addUser, validateLogin, setCurrentUser, generateUserId } from '../utils/authStorage'
import { hasSupabase, supabase } from '../lib/supabase'
import styles from '../styles/Auth.module.css'

const PENDING_KEY = 'thebridge_pending_user'

const EMAIL_WARNING = 'Dogru e-posta girdiginizden emin olun; daha sonra dogrulama yapmaniz gerekebilir.'

export default function Auth() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState({})
  const [socialUsernames, setSocialUsernames] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleAuth = async () => {
    if (!hasSupabase || !supabase) {
      setError('Google ile giris icin Supabase yapilandirilmasi gerekir.')
      return
    }
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    setLoading(false)
    if (err) {
      const msg = err.message || 'Google ile giris yapilirken hata olustu.'
      const hint = err.message?.includes('500') || err.message?.includes('unexpected')
        ? ' Supabase Dashboard: Authentication > URL Configuration icinde Redirect URLs\'e sitenizin adresini (ornegin https://maniwebst.com) ekleyin. Google Console\'da da Redirect URI\'nin Supabase callback adresi oldugundan emin olun.'
        : ''
      setError(msg + hint)
    }
  }

  const togglePlatform = (id) => {
    setSelectedPlatforms((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      if (!next[id]) {
        setSocialUsernames((u) => {
          const u2 = { ...u }
          delete u2[id]
          return u2
        })
      }
      return next
    })
  }

  const setSocialUsername = (platformId, value) => {
    setSocialUsernames((prev) => ({ ...prev, [platformId]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const emailTrim = email.trim().toLowerCase()
    const passwordVal = password

    if (hasSupabase && supabase) {
      setLoading(true)
      try {
        if (isLogin) {
          const { data, error: err } = await supabase.auth.signInWithPassword({ email: emailTrim, password: passwordVal })
          setLoading(false)
          if (err) {
            setError(err.message === 'Invalid login credentials' ? 'Bu e-posta ile kayitli hesap bulunamadi veya sifre hatali.' : err.message)
            return
          }
          if (data?.user) setCurrentUser({ id: data.user.id, email: data.user.email, username: data.user.user_metadata?.user_name || data.user.email?.split('@')[0] })
          navigate('/profilim')
          return
        }
        const derivedUsername = (socialUsernames?.instagram || socialUsernames?.tiktok || socialUsernames?.youtube || socialUsernames?.x || socialUsernames?.facebook || '').trim().replace(/^@/, '') || emailTrim.split('@')[0] || 'kullanici'
        const { data, error: err } = await supabase.auth.signUp({
          email: emailTrim,
          password: passwordVal,
          options: { data: { user_name: derivedUsername } },
        })
        setLoading(false)
        if (err) {
          setError(err.message || 'Kayit yapilamadi.')
          return
        }
        if (data?.user) {
          const socialHandles = Object.keys(selectedPlatforms)
            .filter((id) => selectedPlatforms[id] && socialUsernames[id]?.trim())
            .reduce((acc, id) => {
              acc[id] = socialUsernames[id]?.trim() || ''
              return acc
            }, {})
          try {
            localStorage.setItem(PENDING_KEY, JSON.stringify({ userId: data.user.id, email: emailTrim, username: derivedUsername, socialHandles }))
          } catch (_) {}
          setCurrentUser({ id: data.user.id, email: data.user.email, username: derivedUsername })
          navigate('/profil-olustur')
        }
      } catch (_) {
        setLoading(false)
        setError('Bir hata olustu.')
      }
      return
    }

    if (isLogin) {
      const user = validateLogin(emailTrim, passwordVal)
      if (!user) {
        setError('Bu e-posta ile kayitli hesap bulunamadi veya sifre hatali. Lutfen uye olun veya bilgilerinizi kontrol edin.')
        return
      }
      setCurrentUser(user)
      navigate('/profilim')
      return
    }

    const derivedUsername = (socialUsernames?.instagram || socialUsernames?.tiktok || socialUsernames?.youtube || socialUsernames?.x || socialUsernames?.facebook || '').trim().replace(/^@/, '') || emailTrim.split('@')[0] || 'kullanici'
    const users = getUsers()
    if (users.some((u) => u.email === emailTrim)) {
      setError('Bu e-posta adresi zaten kayitli.')
      return
    }
    const userId = generateUserId()
    const added = addUser({ id: userId, email: emailTrim, username: derivedUsername, password: passwordVal })
    if (!added) {
      setError('Kayit yapilamadi. E-posta zaten kullaniliyor olabilir.')
      return
    }
    const socialHandles = Object.keys(selectedPlatforms)
      .filter((id) => selectedPlatforms[id] && socialUsernames[id]?.trim())
      .reduce((acc, id) => {
        acc[id] = socialUsernames[id]?.trim() || ''
        return acc
      }, {})
    try {
      localStorage.setItem(PENDING_KEY, JSON.stringify({ userId, email: emailTrim, username: derivedUsername, socialHandles }))
    } catch (_) {}
    setCurrentUser(added)
    navigate('/profil-olustur')
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.card}>
          <h1 className={styles.title}>{isLogin ? 'Giris Yap' : 'Uye Ol'}</h1>
          <p className={styles.subtitle}>
            {isLogin
              ? 'Hesabina giris yap. Sadece kayitli e-posta ve sifre ile giris yapilir.'
              : 'E-posta ve sifre ile uye olun; sosyal medya hesaplarinizi asagida ekleyin.'}
          </p>

          {error && <p className={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>E-posta</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              required
            />
            {!isLogin && (
              <p className={styles.emailWarning}>{EMAIL_WARNING}</p>
            )}

            <label className={styles.label}>Sifre</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />

            {!isLogin && (
              <div className={styles.socialSection}>
                <h3 className={styles.socialTitle}>Sosyal medya hesaplari</h3>
                <p className={styles.socialHint}>Istediklerinizi secin, kullanici adini yazin.</p>
                {SOCIAL_PLATFORMS.map(({ id, label }) => (
                  <div key={id} className={styles.socialRow}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={!!selectedPlatforms[id]}
                        onChange={() => togglePlatform(id)}
                      />
                      <span>{label}</span>
                    </label>
                    {selectedPlatforms[id] && (
                      <input
                        type="text"
                        className={styles.socialInput}
                        value={socialUsernames[id] || ''}
                        onChange={(e) => setSocialUsername(id, e.target.value)}
                        placeholder={id === 'instagram' ? '@kullanici_adi' : 'Kullanici adi'}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? '...' : isLogin ? 'Giris Yap' : 'Uye Ol'}
            </button>

            <>
                <p className={styles.orDivider}>veya</p>
                <button type="button" className={styles.googleButton} onClick={handleGoogleAuth} disabled={loading}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  {isLogin ? 'Google ile Giris Yap' : 'Google ile Uye Ol'}
                </button>
              </>
          </form>

          <p className={styles.toggle}>
            {isLogin ? 'Hesabin yok mu?' : 'Zaten uye misin?'}{' '}
            <button type="button" className={styles.toggleButton} onClick={() => { setIsLogin(!isLogin); setError('') }}>
              {isLogin ? 'Uye ol' : 'Giris yap'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
