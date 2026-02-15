import type { User } from '../types'

interface UserInfoProps {
  user: User
}
export default function Header({ user }: UserInfoProps) {
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Sneaker Drop
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-300 text-sm font-medium">
            Username: {user.username}
          </span>
        </div>
      </div>
    </header>
  )
}
