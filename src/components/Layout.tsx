import { NavLink, Outlet } from 'react-router-dom'
import { MessageCircle, LayoutDashboard, History, ClipboardList } from 'lucide-react'

const navItems = [
  { to: '/', icon: MessageCircle, label: 'Chat' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/plans', icon: ClipboardList, label: 'Action Plans' },
]

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <img src="/logo.png" alt="Vault" className="h-8 w-8" />
        <h1 className="text-xl font-semibold text-indigo-600">Vault</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <nav className="w-16 md:w-56 bg-white border-r border-slate-200 flex flex-col py-4">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <Icon size={20} />
              <span className="hidden md:inline">{label}</span>
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 overflow-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
