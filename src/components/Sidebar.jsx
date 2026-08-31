import { LayoutDashboard, Users, GraduationCap, Wallet, School } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
  { id: 'alunos', label: 'Alunos', icon: Users },
  { id: 'turmas', label: 'Turmas', icon: School },
  { id: 'financeiro', label: 'Financeiro', icon: Wallet },
]

export default function Sidebar({ active, onNavigate, open, onClose, totalAlunos, usuario, onLogout }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-white border-r border-purple-100 flex flex-col transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="px-6 py-5 border-b border-purple-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center">
            <GraduationCap size={20} />
          </div>
          <div>
            <p className="text-base font-bold text-purple-700 leading-tight">Gestão de Alunos</p>
            <p className="text-xs text-gray-400">Curso particular</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = active === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto border-t border-purple-100">
          {usuario?.email && (
            <div className="px-6 py-3 border-b border-purple-100">
              <p className="text-[11px] uppercase tracking-wide text-gray-400">Logado como</p>
              <p className="text-sm text-gray-600 truncate" title={usuario.email}>
                {usuario.email}
              </p>
            </div>
          )}
          <div className="px-6 py-4 flex items-center justify-between gap-2">
            <span className="text-xs text-gray-400">
              {totalAlunos} aluno{totalAlunos !== 1 ? 's' : ''}
            </span>
            <button
              onClick={onLogout}
              className="text-xs font-medium text-purple-600 hover:text-purple-800 transition"
            >
              Sair
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
