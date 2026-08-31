import { useState } from 'react'
import { X, Pencil, Trash2, MapPin, CalendarDays, Users, Plus } from 'lucide-react'
import { Badge } from './ui.jsx'
import { formatarData } from '../lib/format.js'
import { excluirTurma } from '../services/turmas.js'
import { listarFaltas } from '../services/faltas.js'
import { supabase } from '../lib/supabaseClient.js'
import TurmaModal from './TurmaModal.jsx'
import IncluirAlunoTurmaModal from './IncluirAlunoTurmaModal.jsx'
import AlunoDetalheModal from './AlunoDetalheModal.jsx'

const TOM_STATUS_TURMA = { ativa: 'green', inativa: 'red' }
const TEXTO_STATUS_TURMA = { ativa: 'Ativa', inativa: 'Inativa' }

export default function TurmaDetalheModal({ turma, alunosNaTurma = [], alunos = [], turmas = [], onClose, onAtualizar }) {
  const [modalEditar, setModalEditar] = useState(false)
  const [modalIncluir, setModalIncluir] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [alunoSelecionado, setAlunoSelecionado] = useState(null)
  const [faltasDoSelecionado, setFaltasDoSelecionado] = useState([])

  const idsNaTurma = new Set(alunosNaTurma.map((a) => a.id))
  const alunosDisponiveis = alunos.filter((a) => !idsNaTurma.has(a.id))

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
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100 sticky top-0 bg-white rounded-t-2xl">
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
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-purple-900">
                <Users size={18} />
                <h4 className="font-semibold">Alunos na turma</h4>
                <span className="text-xs text-gray-400">({alunosNaTurma.length})</span>
              </div>
              <button
                onClick={() => setModalIncluir(true)}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-xl text-sm font-medium transition"
              >
                <Plus size={16} /> Incluir aluno
              </button>
            </div>

            {alunosNaTurma.length === 0 ? (
              <p className="text-sm text-gray-400">Nenhum aluno nesta turma.</p>
            ) : (
              <div className="space-y-2">
                {alunosNaTurma.map((aluno) => (
                  <button
                    key={aluno.id}
                    type="button"
                    onClick={() => abrirAluno(aluno)}
                    className="group w-full text-left rounded-xl border border-purple-100 p-3 flex items-center gap-3 hover:border-purple-300 hover:bg-purple-50/50 transition"
                  >
                    <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold text-xs shrink-0">
                      {aluno.nome?.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-700 truncate group-hover:text-purple-700">{aluno.nome}</p>
                      <p className="text-xs text-gray-400 truncate">{aluno.email || 'Sem e-mail'}</p>
                    </div>
                  </button>
                ))}
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
