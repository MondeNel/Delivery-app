import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

// Seed users in localStorage (run once)
function seedUsers() {
  const existing = localStorage.getItem('kq-users')
  if (!existing) {
    const users = [
      {
        id: 'admin-1',
        name: 'Admin',
        email: 'admin@kq.co.za',
        password: 'admin123',
        isAdmin: true,
      },
    ]
    localStorage.setItem('kq-users', JSON.stringify(users))
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('kq-current-user')
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    seedUsers()
  }, [])

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('kq-users') || '[]')
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) throw new Error('Invalid email or password')
    // Don't store password in current user
    const { password: _, ...safeUser } = found
    localStorage.setItem('kq-current-user', JSON.stringify(safeUser))
    setUser(safeUser)
    return safeUser
  }

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('kq-users') || '[]')
    if (users.find(u => u.email === email)) {
      throw new Error('An account with this email already exists')
    }
    const newUser = {
      id: 'user-' + Date.now(),
      name,
      email,
      password,
      isAdmin: false,
    }
    users.push(newUser)
    localStorage.setItem('kq-users', JSON.stringify(users))
    // Auto‑login after signup
    const { password: _, ...safeUser } = newUser
    localStorage.setItem('kq-current-user', JSON.stringify(safeUser))
    setUser(safeUser)
    return safeUser
  }

  const logout = () => {
    localStorage.removeItem('kq-current-user')
    setUser(null)
  }

  const isAdmin = user?.isAdmin ?? false

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}