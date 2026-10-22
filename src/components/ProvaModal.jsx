import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { inputClass } from './ui.jsx'
import { criarProva, atualizarProva } from '../services/provas.js'

export default function ProvaModal({ prova, onClose, onSalvo }) {
  const [nomeProva, setNomeProva] = useState(prova?.nome_prova ?? '')
  const [numeroProva, setNumeroProva] = useState(prova?.numero_prova ?? '')
  const [totalQuestoes, setTotalQuestoes] = useState(prova?.total_questoes ?? '')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nomeProva.trim()) return
    setSalvando(true)
    setErro(null)
    try {
      const payload = {
        nome_prova: nomeProva.trim(),
        numero_prova: numeroProva === '' ? null : Number(numeroProva),
        total_questoes: totalQuestoes === '' ? null : Number(totalQuestoes),
      }
      const salva = prova ? await atualizarProva(prova.id, payload) : await criarProva(payload)
      onSalvo?.(salva)
    } catch (err) {
      console.error(err)
      setErro('Não foi possível salvar a prova. Verifique as permissões no banco.')
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
            {prova ? 'Editar prova' : 'Nova prova'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-purple-600 transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-600 mb-1">Nome da prova</span>
            <input
              required
              autoFocus
              value={nomeProva}
              onChange={(e) => setNomeProva(e.target.value)}
              placeholder="Ex: Prova de Raciocínio Lógico"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-600 mb-1">Número da prova</span>
            <input
              type="number"
              min="1"
              value={numeroProva}
              onChange={(e) => setNumeroProva(e.target.value)}
              placeholder="Ex: 1"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-600 mb-1">Total de questões</span>
            <input
              type="number"
              min="1"
              value={totalQuestoes}
              onChange={(e) => setTotalQuestoes(e.target.value)}
              placeholder="Ex: 10"
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
