import { Link, Outlet, useLocation } from 'react-router-dom'
import { FileText, DollarSign, Calendar, FolderOpen, MessageSquare, LayoutDashboard, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Formulário', href: '/formulario', icon: FileText },
  { label: 'Taxa consular', href: '/taxa-consular', icon: DollarSign },
  { label: 'Agendamento', href: '/agendamento', icon: Calendar },
  { label: 'Documentos', href: '/documentos', icon: FolderOpen },
  { label: 'Mensagens', href: '/mensagens', icon: MessageSquare },
]

const ClientLayout = () => {
  const location = useLocation()
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-sm">C</span>
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              Cia do <span className="text-primary">Visto</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Sair</span>
          </button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden overflow-x-auto border-t border-border">
          <nav className="flex items-center gap-1 px-4 py-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default ClientLayout
