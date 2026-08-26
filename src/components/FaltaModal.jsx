import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { inputClass } from './ui.jsx'
import { criarFalta, atualizarFalta } from '../services/faltas.js'
import { supabase } from '../lib/supabaseClient.js'

export default function FaltaModal({ alunoId, falta, onClose, onCriado }) {
  const [numeroAula, setNumeroAula] = useState(falta?.numero_aula ?? '')
  const [data, setData] = useState(falta?.data ?? '')
  const [justificado, setJustificado] = useState(falta?.justificado ?? '')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!numeroAula || !data) return
    setSalvando(true)
    setErro(null)
    try {
      const payload = {
        numero_aula: Number(numeroAula),
        data,
        justificado: justificado.trim(),
      }
      if (falta) {
        await atualizarFalta(falta.id, payload, supabase)
      } else {
        await criarFalta({ aluno_id: alunoId, ...payload }, supabase)
      }
      onCriado?.()
    } catch (err) {
      console.error(err)
      setErro(
        'Não foi possível registrar a falta. Verifique as permissões e se a tabela faltas existe.'
      )
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
            {falta ? 'Editar falta' : 'Registrar falta'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-purple-600 transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-600 mb-1">Número da aula</span>
            <input
              type="number"
              min="1"
              required
              value={numeroAula}
              onChange={(e) => setNumeroAula(e.target.value)}
              placeholder="Ex: 4"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-600 mb-1">Data</span>
            <input
              type="date"
              required
              value={data}
              onChange={(e) => setData(e.target.value)}
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-600 mb-1">
              Justificativa
            </span>
            <textarea
              rows={3}
              value={justificado}
              onChange={(e) => setJustificado(e.target.value)}
              placeholder="Descreva se a falta foi justificada ou não..."
              className={inputClass}
            />
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
