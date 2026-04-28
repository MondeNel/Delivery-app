import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      signup(name, email, password)
      navigate('/')
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
        <p className="text-sm text-ink-muted text-center mb-6">Create your account</p>

        {error && (
          <div className="bg-ember-light border border-ember-border text-ember text-xs p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Sipho Mokoena"
              required
              className="w-full bg-cream-100 border border-cream-300 rounded-md p-2.5 text-sm mt-1 outline-none focus:border-gold"
            />
          </div>
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
              placeholder="Min. 6 characters"
              required
              minLength={6}
              className="w-full bg-cream-100 border border-cream-300 rounded-md p-2.5 text-sm mt-1 outline-none focus:border-gold"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-white py-3 rounded-lg font-semibold text-sm disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        <p className="text-xs text-ink-muted text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-gold font-medium">Log in</Link>
        </p>
      </div>
    </div>
  )
}