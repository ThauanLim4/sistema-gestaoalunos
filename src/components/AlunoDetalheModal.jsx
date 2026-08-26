import { useState } from 'react'
import {
  X,
  CalendarX,
  Plus,
  Mail,
  Phone,
  MapPin,
  Cake,
  CalendarDays,
  Hash,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Badge } from './ui.jsx'
import { listarFaltas } from '../services/faltas.js'
import { excluirAluno } from '../services/alunos.js'
import { supabase } from '../lib/supabaseClient.js'
import {
  iniciais,
  formatarData,
  situacaoAluno,
  TEXTO_SITUACAO_ALUNO,
  TOM_SITUACAO_ALUNO,
} from '../lib/format.js'
import FaltaModal from './FaltaModal.jsx'
import NovoAlunoModal from './NovoAlunoModal.jsx'

function Campo({ icone: Icon, label, valor }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon size={16} className="text-purple-400 shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-gray-700 truncate">{valor || '—'}</p>
      </div>
    </div>
  )
}

export default function AlunoDetalheModal({ aluno, faltasIniciais = [], onClose, onAtualizar }) {
  const [alunoAtual, setAlunoAtual] = useState(aluno)
  const [faltas, setFaltas] = useState(faltasIniciais)
  const [modalFalta, setModalFalta] = useState(false)
  const [faltaEditando, setFaltaEditando] = useState(null)
  const [modalEditar, setModalEditar] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  async function recarregarFaltas() {
    const dados = await listarFaltas(alunoAtual.id, supabase)
    setFaltas(Array.isArray(dados) ? dados : [])
  }

  async function handleExcluir() {
    if (!confirm(`Excluir o aluno "${alunoAtual.nome}"? Esta ação também remove as faltas vinculadas.`))
      return
    setExcluindo(true)
    try {
      await excluirAluno(alunoAtual.id, supabase)
      onAtualizar?.()
      onClose()
    } catch (err) {
      console.error(err)
      alert('Não foi possível excluir o aluno. Verifique as permissões no banco.')
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
          <h3 className="text-lg font-semibold text-purple-900">Detalhes do aluno</h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setModalEditar(true)}
              title="Editar aluno"
              className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={handleExcluir}
              disabled={excluindo}
              title="Excluir aluno"
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
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold text-base shrink-0">
              {iniciais(alunoAtual.nome)}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-semibold text-gray-800 truncate">{alunoAtual.nome}</p>
              <div className="mt-1">
                <Badge tone={TOM_SITUACAO_ALUNO[situacaoAluno(alunoAtual)]}>
                  {TEXTO_SITUACAO_ALUNO[situacaoAluno(alunoAtual)]}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Campo icone={Mail} label="E-mail" valor={alunoAtual.email} />
            <Campo icone={Phone} label="Telefone" valor={alunoAtual.telefone} />
            <Campo icone={Hash} label="CPF" valor={alunoAtual.cpf} />
            <Campo icone={Cake} label="Data de nascimento" valor={formatarData(alunoAtual.data_nascimento)} />
            <Campo icone={CalendarDays} label="Data de matrícula" valor={formatarData(alunoAtual.data_matricula)} />
            <Campo icone={MapPin} label="Endereço" valor={alunoAtual.endereco} />
          </div>

          <div className="border-t border-purple-100 pt-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-purple-900">
                <CalendarX size={18} />
                <h4 className="font-semibold">Faltas</h4>
                <span className="text-xs text-gray-400">({faltas.length})</span>
              </div>
              <button
                onClick={() => setModalFalta(true)}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-xl text-sm font-medium transition"
              >
                <Plus size={16} /> Registrar falta
              </button>
            </div>

            {faltas.length === 0 ? (
              <p className="text-sm text-gray-400">Nenhuma falta registrada.</p>
            ) : (
              <div className="space-y-2">
                {faltas.map((falta) => (
                  <div key={falta.id} className="rounded-xl border border-purple-100 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-700">Aula nº {falta.numero_aula}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-400">{formatarData(falta.data)}</p>
                        <button
                          onClick={() => setFaltaEditando(falta)}
                          title="Editar falta"
                          className="p-1 rounded-md text-purple-600 hover:bg-purple-50 transition"
                        >
                          <Pencil size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {falta.justificado ? `Justificativa: ${falta.justificado}` : 'Sem justificativa'}
                    </p>
                    <p className="text-[11px] text-gray-300 mt-1">
                      Registrado em {formatarData(falta.criado_em)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {modalFalta && (
        <FaltaModal
          alunoId={alunoAtual.id}
          onClose={() => setModalFalta(false)}
          onCriado={() => {
            setModalFalta(false)
            recarregarFaltas()
            onAtualizar?.()
          }}
        />
      )}

      {faltaEditando && (
        <FaltaModal
          alunoId={alunoAtual.id}
          falta={faltaEditando}
          onClose={() => setFaltaEditando(null)}
          onCriado={() => {
            setFaltaEditando(null)
            recarregarFaltas()
            onAtualizar?.()
          }}
        />
      )}

      {modalEditar && (
        <NovoAlunoModal
          aluno={alunoAtual}
          onClose={() => setModalEditar(false)}
          onCriado={(salvo) => {
            setModalEditar(false)
            if (salvo) setAlunoAtual(salvo)
            onAtualizar?.()
          }}
        />
      )}
    </div>
  )
}
