import { useState } from 'react'
import { X, Plus, CalendarDays, Wallet, Pencil, CreditCard, Coins } from 'lucide-react'
import { Badge } from './ui.jsx'
import { listarPagamentosRegistrados } from '../services/pagamentosRegistrados.js'
import { supabase } from '../lib/supabaseClient.js'
import {
  formatarMoeda,
  formatarData,
  formatarVencimento,
  TEXTO_STATUS,
  TOM_STATUS,
} from '../lib/format.js'
import PagamentoModal from './PagamentoModal.jsx'
import ContratoModal from './ContratoModal.jsx'

export default function ContratoDetalheModal({
  contrato,
  alunos = [],
  pagamentosIniciais = [],
  onClose,
  onAtualizar,
}) {
  const [contratoAtual, setContratoAtual] = useState(contrato)
  const [pagamentos, setPagamentos] = useState(pagamentosIniciais)
  const [modalPagamento, setModalPagamento] = useState(false)
  const [pagamentoEditando, setPagamentoEditando] = useState(null)
  const [modalEditarContrato, setModalEditarContrato] = useState(false)

  const nomeAluno = alunos.find((a) => a.id === contratoAtual.aluno_id)?.nome ?? 'Aluno'

  async function recarregarPagamentos() {
    const dados = await listarPagamentosRegistrados(contratoAtual.id, supabase)
    setPagamentos(Array.isArray(dados) ? dados : [])
  }

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
          <h3 className="text-lg font-semibold text-purple-900">Detalhes do contrato</h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setModalEditarContrato(true)}
              title="Editar contrato"
              className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition"
            >
              <Pencil size={18} />
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-purple-600 transition p-2">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="rounded-2xl border border-purple-100 p-5 bg-purple-50/40">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-400">Aluno</p>
              <Badge tone={TOM_STATUS[contratoAtual.status]}>
                {TEXTO_STATUS[contratoAtual.status]}
              </Badge>
            </div>
            <p className="text-lg font-semibold text-gray-800">{nomeAluno}</p>
            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <Wallet size={16} className="text-purple-400 shrink-0" />
                <span className="truncate">{formatarMoeda(contratoAtual.valor)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <CalendarDays size={16} className="text-purple-400 shrink-0" />
                <span className="truncate">
                  {formatarVencimento(contratoAtual.vencimento_dia)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-purple-100 pt-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-purple-900">
                <CreditCard size={18} />
                <h4 className="font-semibold">Pagamentos registrados</h4>
                <span className="text-xs text-gray-400">({pagamentos.length})</span>
              </div>
              <button
                onClick={() => setModalPagamento(true)}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-xl text-sm font-medium transition"
              >
                <Plus size={16} /> Registrar pagamento
              </button>
            </div>

            {pagamentos.length === 0 ? (
              <p className="text-sm text-gray-400">Nenhum pagamento registrado.</p>
            ) : (
              <div className="space-y-2">
                {pagamentos.map((pg) => (
                  <div key={pg.id} className="rounded-xl border border-purple-100 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-700">
                        {formatarMoeda(pg.valor)}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-400">{formatarData(pg.data)}</p>
                        <button
                          onClick={() => setPagamentoEditando(pg)}
                          title="Editar pagamento"
                          className="p-1 rounded-md text-purple-600 hover:bg-purple-50 transition"
                        >
                          <Pencil size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <Coins size={13} className="text-purple-400" />
                      {pg.metodo_pagamento || 'Sem método'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {modalPagamento && (
        <PagamentoModal
          contratoId={contratoAtual.id}
          onClose={() => setModalPagamento(false)}
          onCriado={() => {
            setModalPagamento(false)
            recarregarPagamentos()
            onAtualizar?.()
          }}
        />
      )}

      {pagamentoEditando && (
        <PagamentoModal
          contratoId={contratoAtual.id}
          pagamento={pagamentoEditando}
          onClose={() => setPagamentoEditando(null)}
          onCriado={() => {
            setPagamentoEditando(null)
            recarregarPagamentos()
            onAtualizar?.()
          }}
        />
      )}

      {modalEditarContrato && (
        <ContratoModal
          contrato={contratoAtual}
          alunos={alunos}
          onClose={() => setModalEditarContrato(false)}
          onCriado={(salvo) => {
            setModalEditarContrato(false)
            if (salvo) setContratoAtual(salvo)
            onAtualizar?.()
          }}
        />
      )}
    </div>
  )
}
