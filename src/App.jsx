import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Auth from './pages/Auth'
import CreateProfile from './pages/CreateProfile'
import Discover from './pages/Discover'
import ProfileDetail from './pages/ProfileDetail'
import Profilim from './pages/Profilim'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="giris" element={<Auth />} />
          <Route path="profilim" element={<Profilim />} />
          <Route path="profil-olustur" element={<CreateProfile />} />
          <Route path="kesfet" element={<Discover />} />
          <Route path="influencer/:id" element={<ProfileDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
