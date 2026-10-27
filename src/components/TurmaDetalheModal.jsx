import { useMemo, useState } from 'react'
import Image from 'next/image'
import { X, Pencil, Trash2, MapPin, CalendarDays, Users, Plus, Filter, Loader2, BarChart3 } from 'lucide-react'
import { Badge } from './ui.jsx'
import {
  formatarData,
  situacaoAluno,
  TEXTO_SITUACAO_ALUNO,
  TOM_SITUACAO_ALUNO,
  TEXTO_STATUS_TURMA,
  TOM_STATUS_TURMA,
} from '../lib/format.js'
import { excluirTurma } from '../services/turmas.js'
import { listarFaltas } from '../services/faltas.js'
import { supabase } from '../lib/supabaseClient.js'
import TurmaModal from './TurmaModal.jsx'
import IncluirAlunoTurmaModal from './IncluirAlunoTurmaModal.jsx'
import DesempenhoModal from './DesempenhoModal.jsx'
import AlunoDetalheModal from './AlunoDetalheModal.jsx'

const FILTROS_FALTAS = [
  { id: 'todas', label: 'Todos os alunos' },
  { id: 'nome', label: 'Ordem alfabética' },
  { id: 'mais', label: 'Mais faltas' },
  { id: 'menos', label: 'Menos faltas' },
]

export default function TurmaDetalheModal({
  turma,
  alunosNaTurma = [],
  alunos = [],
  turmas = [],
  faltasPorAluno,
  carregandoContagem = false,
  onClose,
  onAtualizar,
}) {
  const [modalEditar, setModalEditar] = useState(false)
  const [modalIncluir, setModalIncluir] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [alunoSelecionado, setAlunoSelecionado] = useState(null)
  const [faltasDoSelecionado, setFaltasDoSelecionado] = useState([])
  const [filtroFaltas, setFiltroFaltas] = useState('todas')
  const [menuFiltroAberto, setMenuFiltroAberto] = useState(false)
  const [modalDesempenho, setModalDesempenho] = useState(false)

  const idsNaTurma = new Set(alunosNaTurma.map((a) => a.id))
  const alunosDisponiveis = alunos.filter((a) => !idsNaTurma.has(a.id))

  const alunosExibidos = useMemo(() => {
    if (filtroFaltas === 'todas' || !faltasPorAluno) return alunosNaTurma
    const base = [...alunosNaTurma]
    if (filtroFaltas === 'nome') {
      base.sort((a, b) => (a.nome ?? '').localeCompare(b.nome ?? '', 'pt-BR'))
      return base
    }
    base.sort((a, b) => {
      const ca = faltasPorAluno[a.id] ?? 0
      const cb = faltasPorAluno[b.id] ?? 0
      return filtroFaltas === 'mais' ? cb - ca : ca - cb
    })
    return base
  }, [alunosNaTurma, filtroFaltas, faltasPorAluno])

  function selecionarFiltro(valor) {
    setMenuFiltroAberto(false)
    setFiltroFaltas(valor)
  }

  async function abrirAluno(aluno) {
    try {
      const f = await listarFaltas(aluno.id, supabase)
      setFaltasDoSelecionado(Array.isArray(f) ? f : [])
    } catch (e) {
      console.error(e)
      setFaltasDoSelecionado([])
    }
    setAlunoSelecionado(aluno)
  }

  async function handleExcluir() {
    if (!confirm(`Excluir a turma ${turma.numero_turma}? Os alunos serão desvinculados.`)) return
    setExcluindo(true)
    try {
      await excluirTurma(turma.id, supabase)
      onAtualizar?.()
      onClose()
    } catch (err) {
      console.error(err)
      alert('Erro ao excluir a turma: ' + (err?.message || 'Verifique as permissões no banco.'))
      setExcluindo(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-purple-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 bg-white border-b border-purple-100 rounded-t-2xl">
          <h3 className="text-lg font-semibold text-purple-900">
            Turma {turma.numero_turma}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setModalEditar(true)}
              title="Editar turma"
              className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={handleExcluir}
              disabled={excluindo}
              title="Excluir turma"
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition disabled:opacity-50"
            >
              <Trash2 size={18} />
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-purple-600 transition p-2">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="relative h-40 w-full sm:h-48 mt-[64px]">
          <Image
            src="/computador_vintage_plano_de_fundo_do_modal_turmas_fundo_roxo.png"
            alt="Fundo decorativo da turma"
            fill
            priority
            sizes="(max-width: 672px) 100vw, 672px"
            className="object-cover"
          />
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Badge tone={TOM_STATUS_TURMA[turma.status] ?? 'gray'}>
              {TEXTO_STATUS_TURMA[turma.status] ?? turma.status ?? '—'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400">Cidade</p>
                <p className="text-gray-700">{turma.turma_cidade || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CalendarDays size={16} className="text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400">Dia(s)</p>
                <p className="text-gray-700">{turma.dia_turma || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Users size={16} className="text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400">Criada em</p>
                <p className="text-gray-700">{formatarData(turma.criada_em)}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-purple-100 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-purple-900">
                <Users size={18} />
                <h4 className="font-semibold">Alunos na turma</h4>
                <span className="text-xs text-gray-400">({alunosNaTurma.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  {carregandoContagem ? (
                      <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border border-purple-100 text-purple-400">
                        <Loader2 size={16} className="animate-spin" /> Contando...
                      </span>
                    ) : (
                      <button
                        onClick={() => setMenuFiltroAberto((v) => !v)}
                        title="Filtrar por faltas"
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition ${
                          filtroFaltas === 'todas'
                            ? 'border-purple-100 text-purple-600 hover:bg-purple-50'
                            : 'border-purple-300 bg-purple-50 text-purple-700'
                        }`}
                      >
                        <Filter size={16} />
                        {FILTROS_FALTAS.find((f) => f.id === filtroFaltas)?.label}
                      </button>
                    )}
                  {menuFiltroAberto && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setMenuFiltroAberto(false)} />
                      <div className="absolute right-0 mt-1 z-20 w-48 rounded-xl border border-purple-100 bg-white shadow-lg p-1">
                        {FILTROS_FALTAS.map((opcao) => (
                          <button
                            key={opcao.id}
                            onClick={() => selecionarFiltro(opcao.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                              filtroFaltas === opcao.id
                                ? 'bg-purple-50 text-purple-700 font-medium'
                                : 'text-gray-600 hover:bg-purple-50'
                            }`}
                          >
                            {opcao.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setModalDesempenho(true)}
                  title="Ver desempenho"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border border-purple-100 text-purple-600 hover:bg-purple-50 transition"
                >
                  <BarChart3 size={16} />
                </button>
                <button
                  onClick={() => setModalIncluir(true)}
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-xl text-sm font-medium transition"
                >
                  <Plus size={16} /> Incluir aluno
                </button>
              </div>
            </div>

            {alunosNaTurma.length === 0 ? (
              <p className="text-sm text-gray-400">Nenhum aluno nesta turma.</p>
            ) : (
              <div className="space-y-2">
                {alunosExibidos.map((aluno) => {
                  const total = faltasPorAluno ? (faltasPorAluno[aluno.id] ?? 0) : null
                  const situacao = situacaoAluno(aluno)
                  const ehDesistente = situacao === 'desistente'
                  return (
                    <button
                      key={aluno.id}
                      type="button"
                      onClick={() => abrirAluno(aluno)}
                      className="group w-full text-left rounded-xl border border-purple-100 p-3 flex items-center gap-3 hover:border-purple-300 hover:bg-purple-50/50 transition"
                    >
                      <div
                        className={`w-9 h-9 rounded-full text-white flex items-center justify-center font-semibold text-xs shrink-0 ${
                          ehDesistente ? 'bg-red-600 border-2 border-red-400' : 'bg-purple-600'
                        }`}
                      >
                        {aluno.nome?.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('')}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-700 truncate min-w-0 group-hover:text-purple-700">
                            {aluno.nome}
                          </p>
                          {ehDesistente && (
                            <span className="shrink-0">
                              <Badge tone={TOM_SITUACAO_ALUNO[situacao]}>
                                {TEXTO_SITUACAO_ALUNO[situacao]}
                              </Badge>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 truncate">{aluno.email || 'Sem e-mail'}</p>
                      </div>
                      {total != null && (
                        <span className="ml-auto shrink-0 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                          {total} falta{total === 1 ? '' : 's'}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {modalEditar && (
        <TurmaModal
          turma={turma}
          onClose={() => setModalEditar(false)}
          onCriado={() => {
            setModalEditar(false)
            onAtualizar?.()
          }}
        />
      )}

      {modalIncluir && (
        <IncluirAlunoTurmaModal
          turma={turma}
          alunosDisponiveis={alunosDisponiveis}
          onClose={() => setModalIncluir(false)}
          onCriado={() => {
            setModalIncluir(false)
            onAtualizar?.()
          }}
        />
      )}

      {modalDesempenho && (
        <DesempenhoModal
          turma={turma}
          alunosNaTurma={alunosNaTurma}
          faltasPorAluno={faltasPorAluno}
          carregandoContagem={carregandoContagem}
          totalAulas={24}
          onClose={() => setModalDesempenho(false)}
        />
      )}

      {alunoSelecionado && (
        <AlunoDetalheModal
          aluno={alunoSelecionado}
          faltasIniciais={faltasDoSelecionado}
          turmas={turmas}
          onClose={() => {
            setAlunoSelecionado(null)
            setFaltasDoSelecionado([])
          }}
          onAtualizar={onAtualizar}
        />
      )}
    </div>
  )
}
