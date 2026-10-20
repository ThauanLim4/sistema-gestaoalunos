import { X, Loader2 } from 'lucide-react'
import DesempenhoFaltas from './DesempenhoFaltas.jsx'

export default function DesempenhoModal({
  turma,
  alunosNaTurma = [],
  faltasPorAluno,
  carregandoContagem = false,
  totalAulas = 24,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 bg-purple-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-lg font-semibold text-purple-900">
            Desempenho{turma ? ` — Turma ${turma.numero_turma}` : ''}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-purple-600 transition p-2"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {carregandoContagem ? (
            <div className="flex items-center gap-2 py-8 text-sm text-purple-500">
              <Loader2 size={16} className="animate-spin" /> Carregando faltas...
            </div>
          ) : (
            <DesempenhoFaltas
              alunos={alunosNaTurma}
              faltasPorAluno={faltasPorAluno}
              totalAulas={totalAulas}
            />
          )}
        </div>
      </div>
    </div>
  )
}
