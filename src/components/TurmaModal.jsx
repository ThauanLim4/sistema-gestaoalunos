import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { inputClass } from './ui.jsx'
import { criarTurma, atualizarTurma } from '../services/turmas.js'

export default function TurmaModal({ turma, onClose, onCriado }) {
  const [numeroTurma, setNumeroTurma] = useState(turma?.numero_turma ?? '')
  const [turmaCidade, setTurmaCidade] = useState(turma?.turma_cidade ?? '')
  const [diaTurma, setDiaTurma] = useState(turma?.dia_turma ?? '')
  const [status, setStatus] = useState(turma?.status ?? 'ativa')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!numeroTurma) return
    setSalvando(true)
    setErro(null)
    try {
      const payload = {
        numero_turma: Number(numeroTurma),
        turma_cidade: turmaCidade.trim(),
        dia_turma: diaTurma.trim(),
        status,
      }
      if (turma) {
        await atualizarTurma(turma.id, payload)
      } else {
        await criarTurma(payload)
      }
      onCriado?.()
    } catch (err) {
      console.error(err)
      setErro('Não foi possível salvar a turma. Verifique as permissões no banco.')
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
            {turma ? 'Editar turma' : 'Nova turma'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-purple-600 transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-600 mb-1">Número da turma</span>
            <input
              type="number"
              required
              min="1"
              autoFocus
              value={numeroTurma}
              onChange={(e) => setNumeroTurma(e.target.value)}
              placeholder="Ex: 1"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-600 mb-1">Cidade</span>
            <input
              value={turmaCidade}
              onChange={(e) => setTurmaCidade(e.target.value)}
              placeholder="Ex: São Paulo"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-600 mb-1">Dia(s) da semana</span>
            <input
              value={diaTurma}
              onChange={(e) => setDiaTurma(e.target.value)}
              placeholder="Ex: Segunda, Quarta, Sexta"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-600 mb-1">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
            >
              <option value="ativa">Ativa</option>
              <option value="inativa">Inativa</option>
            </select>
          </label>

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
              disabled={salvando}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition font-medium disabled:opacity-60"
            >
              {salvando && <Loader2 size={16} className="animate-spin" />}
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
