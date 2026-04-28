import { useState } from 'react'
import { useProfile } from '../context/ProfileContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { profile, updateProfile, clearProfile } = useProfile()
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(profile.name || user?.name || '')
  const [phone, setPhone] = useState(profile.phone || '')
  const [address, setAddress] = useState(profile.address || '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateProfile({ name, phone, address })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="p-4 pb-20">
      <h2 className="font-serif text-xl text-ink mb-4">My Profile</h2>

      <div className="bg-white border border-cream-200 rounded-2xl p-4 space-y-4 mb-4">
        <div>
          <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Sipho Mokoena"
            className="w-full bg-cream-100 border border-cream-300 rounded-md p-2.5 text-sm mt-1 outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full bg-cream-100 border border-cream-300 rounded-md p-2.5 text-sm mt-1 outline-none text-ink-muted"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+27 068 099 5953"
            className="w-full bg-cream-100 border border-cream-300 rounded-md p-2.5 text-sm mt-1 outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">Street Address</label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="12 Market Street, Prieska"
            className="w-full bg-cream-100 border border-cream-300 rounded-md p-2.5 text-sm mt-1 outline-none focus:border-gold"
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-gold text-white py-3 rounded-lg font-medium"
        >
          {saved ? 'Saved!' : 'Save Details'}
        </button>
      </div>

      {isAdmin && (
        <button
          onClick={() => navigate('/admin')}
          className="w-full bg-ink text-white py-3 rounded-lg font-medium mb-3"
        >
          Admin Dashboard
        </button>
      )}

      <button
        onClick={handleLogout}
        className="w-full border border-cream-300 text-ink-muted py-2 rounded-lg text-sm"
      >
        Log Out
      </button>
    </div>
  )
}