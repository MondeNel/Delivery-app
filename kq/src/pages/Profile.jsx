import { useState } from 'react'
import { useProfile } from '../context/ProfileContext'
import { FiUser, FiPhone, FiMapPin, FiCheck, FiTrash2 } from 'react-icons/fi'

function ProfileField({ label, icon: Icon, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-ink-mid uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost">
          <Icon size={14} />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-cream-100 border border-cream-300 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-ink placeholder-ink-ghost outline-none transition-all focus:border-gold-border focus:bg-white"
        />
      </div>
    </div>
  )
}

export default function Profile() {
  const { profile, updateProfile, clearProfile } = useProfile()
  const [name, setName] = useState(profile.name)
  const [phone, setPhone] = useState(profile.phone)
  const [address, setAddress] = useState(profile.address)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateProfile({ name, phone, address })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'

  return (
    <div className="p-4 pb-24 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gold-light border border-gold-border flex items-center justify-center">
          <span className="font-serif text-lg font-bold text-gold">{initials}</span>
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-ink">{name || 'My Profile'}</h2>
          <p className="text-xs text-ink-ghost mt-0.5">Delivery details saved here</p>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white border border-cream-300 rounded-2xl p-4 space-y-4" style={{ boxShadow: '0 1px 4px rgba(26,22,18,0.06)' }}>
        <ProfileField
          label="Full Name"
          icon={FiUser}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Sipho Mokoena"
        />
        <ProfileField
          label="Phone Number"
          icon={FiPhone}
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="+27 068 099 5953"
          type="tel"
        />
        <ProfileField
          label="Street Address"
          icon={FiMapPin}
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="e.g. 12 Market Street, Prieska"
        />

        <div className="divider" />

        <button
          onClick={handleSave}
          className="btn-press w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
          style={saved
            ? { background: '#4A7C59', color: 'white' }
            : { background: '#B8860B', color: 'white', boxShadow: '0 4px 16px rgba(184,134,11,0.3)' }
          }
        >
          {saved ? (
            <><FiCheck size={15} /> Saved!</>
          ) : (
            'Save Details'
          )}
        </button>

        <button
          onClick={clearProfile}
          className="btn-press w-full border border-cream-300 text-ink-ghost py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:border-ember-border hover:text-ember transition-colors"
        >
          <FiTrash2 size={13} />
          Clear Saved Info
        </button>
      </div>

      {/* Info box */}
      <div className="mt-4 bg-gold-light border border-gold-border rounded-xl p-3.5">
        <p className="text-xs text-gold-dark font-medium">
          Your details are saved locally on this device and auto-filled at checkout.
        </p>
      </div>
    </div>
  )
}