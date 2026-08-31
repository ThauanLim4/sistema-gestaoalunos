import { useMemo, useState } from 'react'
import { Search, Plus, RefreshCw, MapPin, CalendarDays, Users } from 'lucide-react'
import { inputClass, Badge } from './ui.jsx'
import { formatarData } from '../lib/format.js'
import TurmaModal from './TurmaModal.jsx'
import TurmaDetalheModal from './TurmaDetalheModal.jsx'

const FILTROS = [
  { id: 'todas', label: 'Todas' },
  { id: 'ativa', label: 'Ativa' },
  { id: 'inativa', label: 'Inativa' },
]

const TOM_STATUS_TURMA = { ativa: 'green', inativa: 'red' }
const TEXTO_STATUS_TURMA = { ativa: 'Ativa', inativa: 'Inativa' }

export default function Turmas({ turmas, alunos, carregando, erro, onAtualizar }) {
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState('todas')
  const [modalCriar, setModalCriar] = useState(false)
  const [turmaSelecionada, setTurmaSelecionada] = useState(null)

  const alunosPorTurma = useMemo(() => {
    const mapa = new Map()
    for (const aluno of alunos) {
      if (aluno.turma_id) {
        const lista = mapa.get(aluno.turma_id) ?? []
        lista.push(aluno)
        mapa.set(aluno.turma_id, lista)
      }
    }
    return mapa
  }, [alunos])

  const turmasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return turmas.filter((t) => {
      const correspondeBusca =
        !termo ||
        String(t.numero_turma).includes(termo) ||
        t.turma_cidade?.toLowerCase().includes(termo) ||
        t.dia_turma?.toLowerCase().includes(termo)
      const correspondeFiltro = filtro === 'todas' || t.status === filtro
      return correspondeBusca && correspondeFiltro
    })
  }, [turmas, busca, filtro])

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-purple-900">Turmas</h1>
          <p className="text-gray-500">Gerenciar turmas e vincular alunos.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onAtualizar}
            disabled={carregando}
            className="inline-flex items-center gap-2 text-sm text-purple-600 px-3 py-2.5 rounded-xl border border-purple-100 transition hover:bg-purple-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={carregando ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setModalCriar(true)}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium transition self-start"
          >
            <Plus size={18} /> Nova turma
          </button>
        </div>
      </div>

      {erro && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      <div className="flex flex-col gap-3 mb-6 md:flex-row md:items-center">
        <div className="relative max-w-sm w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por número, cidade ou dia..."
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
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-40 animate-pulse rounded-2xl border border-purple-100 bg-white" />
          ))}
        </div>
      ) : turmasFiltradas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-purple-200 bg-white p-10 text-center">
          <p className="text-gray-400">Nenhuma turma encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {turmasFiltradas.map((turma) => (
            <button
              key={turma.id}
              type="button"
              onClick={() => setTurmaSelecionada(turma)}
              className="group text-left w-full bg-white rounded-2xl border border-purple-100 p-5 shadow-sm hover:shadow-md hover:border-purple-200 transition"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xl font-bold text-purple-900">
                  Turma {turma.numero_turma}
                </p>
                <Badge tone={TOM_STATUS_TURMA[turma.status] ?? 'gray'}>
                  {TEXTO_STATUS_TURMA[turma.status] ?? turma.status ?? '—'}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin size={16} className="text-purple-400 shrink-0" />
                  <span className="truncate">{turma.turma_cidade || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <CalendarDays size={16} className="text-purple-400 shrink-0" />
                  <span className="truncate">{turma.dia_turma || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Users size={16} className="text-purple-400 shrink-0" />
                  <span>{(alunosPorTurma.get(turma.id) ?? []).length} aluno(s)</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {modalCriar && (
        <TurmaModal
          onClose={() => setModalCriar(false)}
          onCriado={() => {
            setModalCriar(false)
            onAtualizar()
          }}
        />
      )}

      {turmaSelecionada && (
        <TurmaDetalheModal
          turma={turmaSelecionada}
          alunosNaTurma={alunosPorTurma.get(turmaSelecionada.id) ?? []}
          alunos={alunos}
          onClose={() => setTurmaSelecionada(null)}
          onAtualizar={onAtualizar}
        />
      )}
    </div>
  )
}
