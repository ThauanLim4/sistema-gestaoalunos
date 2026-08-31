import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { inputClass } from './ui.jsx'
import { atualizarAluno } from '../services/alunos.js'
import { supabase } from '../lib/supabaseClient.js'

export default function IncluirAlunoTurmaModal({ turma, alunosDisponiveis = [], onClose, onCriado }) {
  const [alunoId, setAlunoId] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!alunoId) return
    setSalvando(true)
    setErro(null)
    try {
      await atualizarAluno(alunoId, { turma_id: turma.id }, supabase)
      onCriado?.()
    } catch (err) {
      console.error(err)
      setErro('Não foi possível incluir o aluno na turma. Verifique as permissões no banco.')
      setSalvando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-purple-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-lg font-semibold text-purple-900">
            Incluir aluno na Turma {turma.numero_turma}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-purple-600 transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-600 mb-1">Aluno</span>
            <select
              required
              value={alunoId}
              onChange={(e) => setAlunoId(e.target.value)}
              className={inputClass}
            >
              <option value="">Selecione um aluno...</option>
              {alunosDisponiveis.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome} {a.email ? `(${a.email})` : ''}
                </option>
              ))}
            </select>
          </label>

          {alunosDisponiveis.length === 0 && (
            <p className="text-sm text-gray-400">
              Todos os alunos já estão vinculados a alguma turma.
            </p>
          )}

          {erro && <p className="text-sm text-red-600">{erro}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando || alunosDisponiveis.length === 0}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition font-medium disabled:opacity-60"
            >
              {salvando && <Loader2 size={16} className="animate-spin" />}
              Incluir
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
