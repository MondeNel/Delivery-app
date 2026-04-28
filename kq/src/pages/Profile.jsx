import { useState } from 'react'
import { useProfile } from '../context/ProfileContext'

export default function Profile() {
  const { profile, updateProfile, clearProfile } = useProfile()
  const [name, setName] = useState(profile.name)
  const [phone, setPhone] = useState(profile.phone)
  const [address, setAddress] = useState(profile.address)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateProfile({ name, phone, address })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-4 pb-20">
      <h2 className="font-serif text-xl text-white mb-4">My Profile</h2>

      <div className="bg-surface border border-subtle rounded-lg p-4 space-y-4">
        <div>
          <label className="text-xs font-medium text-text-tertiary uppercase tracking-wide">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Sipho Mokoena"
            className="w-full bg-gray-800 border border-subtle rounded-md p-2.5 text-sm mt-1 outline-none focus:border-accent text-white placeholder-text-tertiary"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-text-tertiary uppercase tracking-wide">
            Phone Number
          </label>
          <input
            type="text"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+27 068 099 5953"
            className="w-full bg-gray-800 border border-subtle rounded-md p-2.5 text-sm mt-1 outline-none focus:border-accent text-white placeholder-text-tertiary"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-text-tertiary uppercase tracking-wide">
            Street Address
          </label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="e.g. 12 Market Street, Prieska"
            className="w-full bg-gray-800 border border-subtle rounded-md p-2.5 text-sm mt-1 outline-none focus:border-accent text-white placeholder-text-tertiary"
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-accent text-white py-3 rounded-lg font-medium"
        >
          {saved ? 'Saved!' : 'Save Details'}
        </button>
        <button
          onClick={clearProfile}
          className="w-full border border-subtle text-text-secondary py-2 rounded-lg text-sm"
        >
          Clear Saved Info
        </button>
      </div>
    </div>
  )
}