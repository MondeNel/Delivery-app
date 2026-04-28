import { createContext, useContext, useState, useEffect } from 'react'

const ProfileContext = createContext()

const defaultProfile = {
  name: '',
  phone: '',
  address: '',
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('kq-profile')
    return saved ? JSON.parse(saved) : defaultProfile
  })

  useEffect(() => {
    localStorage.setItem('kq-profile', JSON.stringify(profile))
  }, [profile])

  const updateProfile = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }))
  }

  const clearProfile = () => {
    setProfile(defaultProfile)
    localStorage.removeItem('kq-profile')
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  return useContext(ProfileContext)
}