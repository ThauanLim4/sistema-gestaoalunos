import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { X, Pencil, Trash2, Loader2, ClipboardList } from 'lucide-react'
import { inputClass, Badge } from './ui.jsx'
import { supabase } from '../lib/supabaseClient.js'
import { listarNotasPorProva, excluirProva } from '../services/provas.js'
import ProvaModal from './ProvaModal.jsx'

function statusDesempenho(nota) {
  if (nota === null) return { texto: 'Sem nota', tone: 'gray' }
  if (nota < 5) return { texto: 'Ruim', tone: 'red' }
  if (nota < 6.9) return { texto: 'Regular', tone: 'amber' }
  if (nota < 8.9) return { texto: 'Bom', tone: 'purple' }
  return { texto: 'Ótimo', tone: 'green' }
}

export default function ProvaDetalheModal({
  prova,
  alunos = [],
  turmas = [],
  onClose,
  onRecarregar,
}) {
  const [provaAtual, setProvaAtual] = useState(prova)
  const [notas, setNotas] = useState({})
  const [carregandoNotas, setCarregandoNotas] = useState(true)
  const [excluindo, setExcluindo] = useState(false)
  const [filtroTurma, setFiltroTurma] = useState('todas')
  const [modalEditar, setModalEditar] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    let ativo = true
    ;(async () => {
      setCarregandoNotas(true)
      setMsg(null)
      try {
        const lista = await listarNotasPorProva(prova.id, supabase)
        if (!ativo) return
        const mapa = {}
        for (const n of lista) {
          mapa[n.aluno_id] =
            n.nota === null || n.nota === undefined ? null : Number(n.nota)
        }
        setNotas(mapa)
      } catch (e) {
        console.error(e)
        if (ativo) setMsg({ tipo: 'erro', texto: 'Não foi possível carregar as notas.' })
      } finally {
        if (ativo) setCarregandoNotas(false)
      }
    })()
    return () => {
      ativo = false
    }
  }, [prova.id])

  const turmaPorId = useMemo(() => new Map(turmas.map((t) => [t.id, t])), [turmas])

  const alunosOrdenados = useMemo(() => {
    return [...alunos].sort((a, b) => (a.nome ?? '').localeCompare(b.nome ?? '', 'pt-BR'))
  }, [alunos])

  const visiveis = useMemo(() => {
    if (filtroTurma === 'todas') return alunosOrdenados
    return alunosOrdenados.filter((a) => a.turma_id === filtroTurma)
  }, [alunosOrdenados, filtroTurma])

  const maxQuestoes = provaAtual?.total_questoes ? Number(provaAtual.total_questoes) : null

  const media = useMemo(() => {
    const comNota = visiveis
      .map((a) => notas[a.id])
      .filter((v) => typeof v === 'number' && !Number.isNaN(v))
    if (comNota.length === 0) return null
    return comNota.reduce((soma, v) => soma + v, 0) / comNota.length
  }, [visiveis, notas])

  async function handleExcluir() {
    if (!confirm(`Excluir a prova "${provaAtual.nome_prova}"? As notas vinculadas também serão removidas.`))
      return
    setExcluindo(true)
    try {
      await excluirProva(provaAtual.id, supabase)
      onRecarregar?.()
      onClose?.()
    } catch (e) {
      console.error(e)
      alert('Erro ao excluir a prova: ' + (e?.message || 'Verifique as permissões no banco.'))
      setExcluindo(false)
    }
  }

  function handleProvaSalva(salva) {
    setProvaAtual(salva)
    setModalEditar(false)
    onRecarregar?.()
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
          <h3 className="text-lg font-semibold text-purple-900 truncate">
            {provaAtual.nome_prova || 'Prova'}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setModalEditar(true)}
              title="Editar prova"
              className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={handleExcluir}
              disabled={excluindo}
              title="Excluir prova"
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition disabled:opacity-50"
            >
              <Trash2 size={18} />
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-purple-600 transition p-2">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="relative h-40 w-full sm:h-48">
          <Image
            src="/caderno_e_lapis_em_gravura_classica.png"
            alt="Fundo decorativo da prova"
            fill
            priority
            sizes="(max-width: 672px) 100vw, 672px"
            className="object-cover"
          />
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            {provaAtual.numero_prova !== null && provaAtual.numero_prova !== undefined && (
              <Badge tone="purple">Prova {provaAtual.numero_prova}</Badge>
            )}
            {maxQuestoes !== null && <Badge tone="gray">Total: {maxQuestoes} questões</Badge>}
            {media !== null && (
              <Badge tone="green">Média: {media.toFixed(1)}</Badge>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <span className="block text-sm font-medium text-gray-600 mb-1">Filtrar por turma</span>
              <select
                value={filtroTurma}
                onChange={(e) => setFiltroTurma(e.target.value)}
                className={inputClass}
              >
                <option value="todas">Todas as turmas</option>
                {turmas.map((t) => (
                  <option key={t.id} value={t.id}>
                    Turma {t.numero_turma}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-white">
            <div className="flex items-center gap-2 px-4 py-3 text-purple-900 border-b border-purple-100">
              <ClipboardList size={18} />
              <h4 className="font-semibold">Resultados</h4>
              <span className="text-xs text-gray-400">({visiveis.length})</span>
            </div>

            {carregandoNotas ? (
              <div className="flex items-center gap-2 px-4 py-6 text-sm text-purple-500">
                <Loader2 size={16} className="animate-spin" /> Carregando resultados...
              </div>
            ) : visiveis.length === 0 ? (
              <p className="px-4 py-6 text-sm text-gray-400">Nenhum aluno nesta seleção.</p>
            ) : (
              <>
                <div className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide border-b border-purple-50">
                  <div className="flex-1">Aluno</div>
                  <div className="w-16 text-right">Nota</div>
                  <div className="w-24 text-right">Desempenho</div>
                </div>

                <div className="px-4">
                  {visiveis.map((a) => {
                    const nota = notas[a.id]
                    const temNota = typeof nota === 'number' && !Number.isNaN(nota)
                    const status = statusDesempenho(temNota ? nota : null)
                    return (
                      <div
                        key={a.id}
                        className="flex items-center gap-3 py-2.5 border-b border-purple-50 last:border-0"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate" title={a.nome}>
                            {a.nome}
                          </p>
                          {a.turma_id && (
                            <p className="text-xs text-gray-400">
                              Turma {turmaPorId.get(a.turma_id)?.numero_turma ?? '—'}
                            </p>
                          )}
                        </div>

                        <div className="w-16 text-right">
                          {temNota ? (
                            <span className="text-sm font-semibold text-gray-800">{nota}</span>
                          ) : (
                            <span className="text-sm text-gray-300">—</span>
                          )}
                        </div>

                        <div className="w-24 flex justify-end">
                          <Badge tone={status.tone}>{status.texto}</Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {msg && (
            <p className={`text-sm ${msg.tipo === 'erro' ? 'text-red-600' : 'text-green-600'}`}>
              {msg.texto}
            </p>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
          >
            Fechar
          </button>
        </div>
      </div>

      {modalEditar && (
        <ProvaModal
          prova={provaAtual}
          onClose={() => setModalEditar(false)}
          onSalvo={handleProvaSalva}
        />
      )}
    </div>
  )
}
