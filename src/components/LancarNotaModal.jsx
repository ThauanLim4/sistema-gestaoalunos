import { useState } from 'react'
import { X, Loader2, Plus, Minus } from 'lucide-react'
import { inputClass } from './ui.jsx'
import { adicionarNota } from '../services/provas.js'
import { supabase } from '../lib/supabaseClient.js'

function toLocalDatetimeValue() {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
}

export default function LancarNotaModal({ prova, alunosDisponiveis = [], onClose, onSalvo }) {
  const [alunoId, setAlunoId] = useState('')
  const [nota, setNota] = useState('')
  const [dataHora, setDataHora] = useState(toLocalDatetimeValue())
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)

  function ajustarNota(delta) {
    const atual = nota === '' ? 0 : Number(nota)
    if (Number.isNaN(atual)) return
    let novo = atual + delta
    if (novo < 0) novo = 0
    if (novo > 10) novo = 10
    novo = Math.round(novo * 10) / 10
    setNota(novo.toString())
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!alunoId || nota === '') return
    setSalvando(true)
    setErro(null)
    try {
      const feitaEm = dataHora ? new Date(dataHora).toISOString() : new Date().toISOString()
      await adicionarNota(
        {
          aluno_id: alunoId,
          prova_id: prova.id,
          nota: Number(nota),
          feita_em: feitaEm,
        },
        supabase
      )
      onSalvo?.()
    } catch (err) {
      console.error(err)
      setErro('Não foi possível lançar a nota. Verifique se o aluno já tem nota nesta prova.')
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
          <h3 className="text-lg font-semibold text-purple-900">Lançar nota</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-purple-600 transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-600 mb-1">Aluno</span>
            <select
              required
              autoFocus
              value={alunoId}
              onChange={(e) => setAlunoId(e.target.value)}
              className={inputClass}
            >
              <option value="">Selecione o aluno</option>
              {alunosDisponiveis.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-600 mb-1">Nota</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => ajustarNota(-0.5)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-purple-100 text-purple-600 hover:bg-purple-50 transition"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                step="0.5"
                min="0"
                max="10"
                required
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder="0,0"
                className={inputClass + ' text-center'}
              />
              <button
                type="button"
                onClick={() => ajustarNota(0.5)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-purple-100 text-purple-600 hover:bg-purple-50 transition"
              >
                <Plus size={16} />
              </button>
            </div>
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-600 mb-1">Data e hora</span>
            <input
              type="datetime-local"
              required
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
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
              disabled={salvando || alunosDisponiveis.length === 0}
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
