import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { inputClass } from './ui.jsx'
import { criarContrato, atualizarContrato } from '../services/contratos.js'

export default function ContratoModal({ contrato, alunos = [], onClose, onCriado }) {
  const [alunoId, setAlunoId] = useState(contrato?.aluno_id ?? '')
  const [valor, setValor] = useState(contrato?.valor ?? '')
  const [vencimentoDia, setVencimentoDia] = useState(contrato?.vencimento_dia ?? '')
  const [status, setStatus] = useState(contrato?.status ?? 'em_dia')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!alunoId || !valor || !vencimentoDia) return
    setSalvando(true)
    setErro(null)
    try {
      const payload = {
        aluno_id: alunoId,
        valor: Number(valor),
        vencimento_dia: Number(vencimentoDia),
        status,
      }
      const salvo = contrato
        ? await atualizarContrato(contrato.id, payload)
        : await criarContrato(payload)
      onCriado?.(salvo)
    } catch (err) {
      console.error(err)
      setErro(
        contrato
          ? 'Não foi possível atualizar o contrato. Verifique as permissões no banco.'
          : 'Não foi possível registrar o contrato. Verifique as permissões no banco.'
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
            {contrato ? 'Editar contrato' : 'Registrar contrato'}
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
              {alunos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-sm font-medium text-gray-600 mb-1">
                Valor (R$)
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-600 mb-1">
                Dia de vencimento
              </span>
              <input
                type="number"
                min="1"
                max="31"
                required
                value={vencimentoDia}
                onChange={(e) => setVencimentoDia(e.target.value)}
                placeholder="Ex: 5"
                className={inputClass}
              />
            </label>
          </div>

          <label className="block">
            <span className="block text-sm font-medium text-gray-600 mb-1">Situação</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
            >
              <option value="em_dia">Em dia</option>
              <option value="atrasado">Atrasado</option>
              <option value="cancelado">Cancelado</option>
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
