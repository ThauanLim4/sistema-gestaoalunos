import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { inputClass } from './ui.jsx'
import {
  criarPagamentoRegistrado,
  atualizarPagamentoRegistrado,
} from '../services/pagamentosRegistrados.js'
import { supabase } from '../lib/supabaseClient.js'

const METODOS = ['Dinheiro', 'PIX', 'Cartão de crédito', 'Cartão de débito', 'Boleto', 'Transferência']

export default function PagamentoModal({ contratoId, pagamento, onClose, onCriado }) {
  const [dataPagamento, setDataPagamento] = useState(pagamento?.data ?? '')
  const [metodo, setMetodo] = useState(pagamento?.metodo_pagamento ?? '')
  const [valor, setValor] = useState(pagamento?.valor ?? '')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!dataPagamento || !valor) return
    setSalvando(true)
    setErro(null)
    try {
      const payload = {
        data: dataPagamento,
        metodo_pagamento: metodo.trim(),
        valor: Number(valor),
      }
      if (pagamento) {
        await atualizarPagamentoRegistrado(pagamento.id, payload, supabase)
      } else {
        await criarPagamentoRegistrado({ pagamento_id: contratoId, ...payload }, supabase)
      }
      onCriado?.()
    } catch (err) {
      console.error(err)
      setErro('Não foi possível registrar o pagamento. Verifique as permissões no banco.')
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
            {pagamento ? 'Editar pagamento' : 'Registrar pagamento'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-purple-600 transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-600 mb-1">
              Data em que foi pago
            </span>
            <input
              type="date"
              required
              value={dataPagamento}
              onChange={(e) => setDataPagamento(e.target.value)}
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-600 mb-1">
              Método de pagamento
            </span>
            <select
              value={metodo}
              onChange={(e) => setMetodo(e.target.value)}
              className={inputClass}
            >
              <option value="">Selecione...</option>
              {METODOS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-600 mb-1">Valor (R$)</span>
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
