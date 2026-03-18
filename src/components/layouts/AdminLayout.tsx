import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, Calendar, Settings, LogOut,
  Tag, MessageCircle, UserSearch, Mail
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Processos', href: '/admin/processos', icon: Users },
  { label: 'Datas', href: '/admin/datas', icon: Calendar },
  { label: 'Cupons', href: '/admin/cupons', icon: Tag },
  { label: 'WhatsApp', href: '/admin/whatsapp', icon: MessageCircle },
  { label: 'Leads & CRM', href: '/admin/leads', icon: UserSearch },
  { label: 'Email', href: '/admin/email', icon: Mail },
  { label: 'Configurações', href: '/admin/configuracoes', icon: Settings },
]

const AdminLayout = () => {
  const location = useLocation()
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border">
        <div className="p-6">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">C</span>
            </div>
            <div>
              <span className="font-display font-bold text-foreground block leading-tight">
                Cia do Visto
              </span>
              <span className="text-xs text-muted-foreground">Admin</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href ||
              (item.href !== '/admin' && location.pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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

        <div className="p-4 border-t border-border">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <Link to="/admin" className="font-display font-bold text-foreground">
            Admin
          </Link>
          <button
            onClick={() => signOut()}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-x-auto border-t border-border">
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
                      : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 lg:overflow-y-auto">
        <div className="p-6 lg:p-8 mt-[104px] lg:mt-0">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
