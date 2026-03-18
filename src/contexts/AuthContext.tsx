import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type UserRole = 'client' | 'admin'

type AuthUser = {
  id: string
  email: string
  role: UserRole
}

type AuthContextType = {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string) => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  isAdmin: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with Supabase Auth onAuthStateChange
    setLoading(false)
  }, [])

  const signIn = async (_email: string) => {
    // TODO: Implement with Supabase Auth magic link
    console.log('Sign in will be implemented with Lovable Cloud')
  }

  const signOut = async () => {
    // TODO: Implement with Supabase Auth
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signOut,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
