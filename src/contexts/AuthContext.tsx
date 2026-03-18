import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/integrations/supabase/client'
import type { User } from '@supabase/supabase-js'

type UserRole = 'client' | 'admin'

type AuthContextType = {
  user: User | null
  profile: { full_name: string | null; email: string | null; avatar_url: string | null } | null
  loading: boolean
  role: UserRole
  isAdmin: boolean
  signIn: (email: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  role: 'client',
  isAdmin: false,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<AuthContextType['profile']>(null)
  const [role, setRole] = useState<UserRole>('client')
  const [loading, setLoading] = useState(true)

  const fetchProfileAndRole = async (userId: string) => {
    const [profileRes, roleRes] = await Promise.all([
      supabase.from('profiles').select('full_name, email, avatar_url').eq('user_id', userId).single(),
      supabase.from('user_roles').select('role').eq('user_id', userId),
    ])
    if (profileRes.data) setProfile(profileRes.data)
    if (roleRes.data) {
      const isAdmin = roleRes.data.some((r: { role: string }) => r.role === 'admin')
      setRole(isAdmin ? 'admin' : 'client')
    }
  }

  useEffect(() => {
    // 1. Restore session from storage first
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        fetchProfileAndRole(currentUser.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    // 2. Listen for subsequent changes (sign in/out) — do NOT await inside callback
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        if (currentUser) {
          // Fire and forget — no await to avoid deadlock
          fetchProfileAndRole(currentUser.id)
        } else {
          setProfile(null)
          setRole('client')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + '/dashboard' },
    })
    return { error: error ? new Error(error.message) : null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setRole('client')
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      role,
      isAdmin: role === 'admin',
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
