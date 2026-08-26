import { useMemo } from 'react'
import { RefreshCw, Users, CircleCheck, CircleAlert, CircleSlash } from 'lucide-react'
import { StatCard, Badge } from './ui.jsx'
import AlunosAtrasados from './AlunosAtrasados.jsx'
import { statusPagamento, TOM_STATUS, TEXTO_STATUS } from '../lib/format.js'

export default function Dashboard({ alunos, carregando, erro, onAtualizar }) {
  const total = alunos.length
  const emDia = useMemo(
    () => alunos.filter((a) => statusPagamento(a) === 'em_dia').length,
    [alunos]
  )
  const atrasados = useMemo(
    () => alunos.filter((a) => statusPagamento(a) === 'atrasado'),
    [alunos]
  )
  const semPagamento = useMemo(
    () => alunos.filter((a) => statusPagamento(a) === 'sem_pagamento').length,
    [alunos]
  )

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-purple-900">Painel geral</h1>
        <button
          onClick={onAtualizar}
          disabled={carregando}
          className="inline-flex items-center gap-2 text-sm text-purple-600 transition hover:text-purple-800 disabled:opacity-50"
        >
          <RefreshCw size={16} className={carregando ? 'animate-spin' : ''} />
          Atualizar
        </button>
      </div>
      <p className="mb-6 text-gray-500">Visão geral do curso e dos alunos matriculados.</p>

      {erro && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total de alunos" valor={total} tone="purple" icone={Users} />
        <StatCard label="Pagamentos em dia" valor={emDia} tone="green" icone={CircleCheck} />
        <StatCard label="Pagamentos atrasados" valor={atrasados.length} tone="red" icone={CircleAlert} />
        <StatCard label="Sem pagamento" valor={semPagamento} tone="gray" icone={CircleSlash} />
      </div>

      <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-purple-900">Alunos com pagamento atrasado</h2>
        {carregando ? (
          <p className="text-sm text-gray-400">Carregando...</p>
        ) : (
          <AlunosAtrasados alunos={atrasados} />
        )}
      </div>
    </div>
  )
}
