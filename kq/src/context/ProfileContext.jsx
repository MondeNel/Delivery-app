import { createContext, useContext, useState, useEffect } from 'react'

const ProfileContext = createContext()

const DEFAULT = { name: '', phone: '', address: '' }

const getInitial = () => {
  try { return JSON.parse(localStorage.getItem('kq-profile')) || DEFAULT }
  catch { return DEFAULT }
}

export function ProfileProvider({ children }) {
  // Lazy initialization for performance
  const [profile, setProfile] = useState(getInitial)

  useEffect(() => {
    localStorage.setItem('kq-profile', JSON.stringify(profile))
  }, [profile])

  const updateProfile = (updates) => setProfile(prev => ({ ...prev, ...updates }))

  const clearProfile = () => {
    setProfile(DEFAULT)
    localStorage.removeItem('kq-profile')
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider')
  return ctx
}