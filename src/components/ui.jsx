export function Badge({ children, tone = 'purple' }) {
  const tones = {
    purple: 'bg-purple-100 text-purple-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    amber: 'bg-amber-100 text-amber-700',
    gray: 'bg-gray-100 text-gray-600',
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
        tones[tone] ?? tones.gray
      }`}
    >
      {children}
    </span>
  )
}

export function StatCard({ label, valor, tone = 'purple', icone: Icon }) {
  const bordas = {
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    amber: 'bg-amber-500',
    gray: 'bg-gray-400',
  }
  return (
    <div className="bg-white rounded-2xl border border-purple-100 p-5 relative overflow-hidden shadow-sm">
      <div className={`absolute top-0 left-0 w-1.5 h-full ${bordas[tone] ?? bordas.gray}`} />
      {Icon && (
        <div className="absolute right-4 top-4 text-purple-200">
          <Icon size={22} />
        </div>
      )}
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{valor}</p>
    </div>
  )
}

export const inputClass =
  'w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition text-sm'
