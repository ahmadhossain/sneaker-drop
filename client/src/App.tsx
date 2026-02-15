import { useEffect, useState } from 'react'
import type { User } from './types'
import { getUser } from './services/api'
import { SocketProvider } from './context/SocketContext'
import { ToastProvider } from './context/ToastContext'
import Dashboard from './components/Dashboard'
import Header from './components/Header'
import Toast from './components/Toast'

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const userId = params.get('userId')

    if (!userId) {
      setError('Please provide a valid userId in the URL')
      setLoading(false)
      return
    }

    getUser(userId)
      .then(setUser)
      .catch(() => {
        setError('Please provide a valid userId in the URL')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="border shadow-xl rounded-2xl p-8 max-w-md text-center">
          <h1 className="text-red-500 text-xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-400">
            {error || 'Please provide a valid userId in the URL'}
          </p>
          <p className="text-gray-600 text-sm mt-4">
            Example: ?userId=your-user-id
          </p>
        </div>
      </div>
    )
  }

  return (
    <SocketProvider userId={user.id}>
      <ToastProvider>
        <div className="min-h-screen bg-gray-100">
          <Header user={user} />
          <Dashboard userId={user.id} />
          <Toast />
        </div>
      </ToastProvider>
    </SocketProvider>
  )
}
