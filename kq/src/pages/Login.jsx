import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isAdminLogin, setIsAdminLogin] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = login(email, password)
      if (isAdminLogin && !user.isAdmin) {
        setError('This account does not have admin privileges.')
        setLoading(false)
        return
      }
      // Redirect admin to dashboard, others to home
      navigate(user.isAdmin ? '/admin' : '/')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-card">
        <h1 className="font-serif text-2xl font-bold text-ink text-center mb-2">
          Kings & Queens
        </h1>

        {/* Customer / Admin toggle */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => setIsAdminLogin(false)}
            className={`text-xs font-bold uppercase tracking-widest pb-1 border-b-2 transition-all ${
              !isAdminLogin ? 'border-gold text-gold' : 'border-transparent text-ink-muted'
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => setIsAdminLogin(true)}
            className={`text-xs font-bold uppercase tracking-widest pb-1 border-b-2 transition-all ${
              isAdminLogin ? 'border-gold text-gold' : 'border-transparent text-ink-muted'
            }`}
          >
            Admin
          </button>
        </div>

        <p className="text-sm text-ink-muted text-center mb-6">
          {isAdminLogin ? 'Admin Login' : 'Log in to your account'}
        </p>

        {isAdminLogin && (
          <div className="bg-gold-light border border-gold-border text-gold-dark text-[11px] p-3 rounded-lg mb-4 text-center font-medium">
            Demo admin: admin@kq.co.za / admin123
          </div>
        )}

        {error && (
          <div className="bg-ember-light border border-ember-border text-ember text-xs p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-cream-100 border border-cream-300 rounded-md p-2.5 text-sm mt-1 outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-cream-100 border border-cream-300 rounded-md p-2.5 text-sm mt-1 outline-none focus:border-gold"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-sm disabled:opacity-50 transition-colors ${
              isAdminLogin ? 'bg-ink text-white' : 'bg-gold text-white'
            }`}
          >
            {loading ? 'Logging in…' : isAdminLogin ? 'Log In as Admin' : 'Log In'}
          </button>
        </form>

        {!isAdminLogin && (
          <p className="text-xs text-ink-muted text-center mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-gold font-medium">Sign up</Link>
          </p>
        )}
        {isAdminLogin && (
          <p className="text-xs text-ink-muted text-center mt-4">
            Not an admin?{' '}
            <button onClick={() => setIsAdminLogin(false)} className="text-gold font-medium">
              Switch to customer login
            </button>
          </p>
        )}
      </div>
    </div>
  )
}