import { useMemo, useState } from 'react'
import { Search, RefreshCw, Plus, Wallet, CalendarDays, CircleCheck, CircleAlert, CircleSlash } from 'lucide-react'
import { inputClass, Badge, StatCard } from './ui.jsx'
import {
  formatarMoeda,
  formatarVencimento,
  TEXTO_STATUS,
  TOM_STATUS,
} from '../lib/format.js'
import { listarContratos } from '../services/contratos.js'
import { listarPagamentosRegistrados } from '../services/pagamentosRegistrados.js'
import { supabase } from '../lib/supabaseClient.js'
import ContratoModal from './ContratoModal.jsx'
import ContratoDetalheModal from './ContratoDetalheModal.jsx'

const FILTROS = [
  { id: 'todos', label: 'Todos' },
  { id: 'em_dia', label: 'Em dia' },
  { id: 'atrasado', label: 'Atrasados' },
  { id: 'cancelado', label: 'Cancelados' },
]

export default function Financeiro({
  alunos,
  contratosIniciais = [],
  carregando,
  erro,
  onAtualizar,
}) {
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [contratos, setContratos] = useState(contratosIniciais)
  const [modalContrato, setModalContrato] = useState(false)
  const [contratoSelecionado, setContratoSelecionado] = useState(null)
  const [pagamentosDoSelecionado, setPagamentosDoSelecionado] = useState([])

  const nomeAluno = (id) => alunos.find((a) => a.id === id)?.nome ?? '—'

  const resumo = useMemo(() => {
    let emDia = 0
    let atrasados = 0
    let cancelados = 0
    for (const c of contratos) {
      if (c.status === 'em_dia') emDia++
      else if (c.status === 'atrasado') atrasados++
      else if (c.status === 'cancelado') cancelados++
    }
    return { emDia, atrasados, cancelados }
  }, [contratos])

  const contratosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return contratos.filter((c) => {
      const correspondeBusca =
        !termo ||
        (alunos.find((a) => a.id === c.aluno_id)?.nome ?? '')
          .toLowerCase()
          .includes(termo)
      const correspondeFiltro = filtro === 'todos' || c.status === filtro
      return correspondeBusca && correspondeFiltro
    })
  }, [contratos, busca, filtro, alunos])

  async function carregarContratos() {
    const dados = await listarContratos(supabase)
    setContratos(Array.isArray(dados) ? dados : [])
  }

  async function abrirContrato(contrato) {
    try {
      const pg = await listarPagamentosRegistrados(contrato.id, supabase)
      setPagamentosDoSelecionado(Array.isArray(pg) ? pg : [])
    } catch (e) {
      console.error(e)
      setPagamentosDoSelecionado([])
    }
    setContratoSelecionado(contrato)
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-purple-900">Financeiro</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onAtualizar}
            disabled={carregando}
            className="inline-flex items-center gap-2 text-sm text-purple-600 transition hover:text-purple-800 disabled:opacity-50"
          >
            <RefreshCw size={16} className={carregando ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setModalContrato(true)}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium transition"
          >
            <Plus size={18} /> Registrar contrato
          </button>
        </div>
      </div>
      <p className="mb-6 text-gray-500">
        Contratos de mensalidade e pagamentos registrados dos alunos.
      </p>

      {erro && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total de contratos" valor={contratos.length} tone="purple" icone={Wallet} />
        <StatCard label="Em dia" valor={resumo.emDia} tone="green" icone={CircleCheck} />
        <StatCard label="Atrasados" valor={resumo.atrasados} tone="red" icone={CircleAlert} />
        <StatCard label="Cancelados" valor={resumo.cancelados} tone="amber" icone={CircleSlash} />
      </div>

      <div className="flex flex-col gap-3 mb-6 md:flex-row md:items-center">
        <div className="relative max-w-sm w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por aluno..."
            className={inputClass + ' pl-9'}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTROS.map((opcao) => (
            <button
              key={opcao.id}
              onClick={() => setFiltro(opcao.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filtro === opcao.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-purple-100 text-gray-500 hover:bg-purple-50'
              }`}
            >
              {opcao.label}
            </button>
          ))}
        </div>
      </div>

      {carregando ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-2xl border border-purple-100 bg-white"
            />
          ))}
        </div>
      ) : contratosFiltrados.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-purple-200 bg-white p-10 text-center">
          <p className="text-gray-400">Nenhum contrato encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contratosFiltrados.map((contrato) => (
            <button
              key={contrato.id}
              type="button"
              onClick={() => abrirContrato(contrato)}
              className="text-left w-full bg-white rounded-2xl border border-purple-100 p-5 shadow-sm hover:shadow-md hover:border-purple-200 transition"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-gray-800 truncate">{nomeAluno(contrato.aluno_id)}</p>
                <Badge tone={TOM_STATUS[contrato.status]}>
                  {TEXTO_STATUS[contrato.status]}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Wallet size={16} className="text-purple-400 shrink-0" />
                  <span className="truncate">{formatarMoeda(contrato.valor)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <CalendarDays size={16} className="text-purple-400 shrink-0" />
                  <span className="truncate">{formatarVencimento(contrato.vencimento_dia)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {modalContrato && (
        <ContratoModal
          alunos={alunos}
          onClose={() => setModalContrato(false)}
          onCriado={() => {
            setModalContrato(false)
            carregarContratos()
            onAtualizar?.()
          }}
        />
      )}

      {contratoSelecionado && (
        <ContratoDetalheModal
          contrato={contratoSelecionado}
          alunos={alunos}
          pagamentosIniciais={pagamentosDoSelecionado}
          onClose={() => {
            setContratoSelecionado(null)
            setPagamentosDoSelecionado([])
          }}
          onAtualizar={() => {
            carregarContratos()
            onAtualizar?.()
          }}
        />
      )}
    </div>
  )
}
