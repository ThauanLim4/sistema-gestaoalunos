import { useCallback, useEffect, useMemo, useState } from 'react'
import { Search, Plus, RefreshCw, ListChecks } from 'lucide-react'
import { inputClass, Badge } from './ui.jsx'
import { supabase } from '../lib/supabaseClient.js'
import { listarProvas } from '../services/provas.js'
import ProvaModal from './ProvaModal.jsx'
import ProvaDetalheModal from './ProvaDetalheModal.jsx'

export default function Provas({ alunos = [], turmas = [] }) {
  const [provas, setProvas] = useState([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [modalCriar, setModalCriar] = useState(false)
  const [provaSelecionada, setProvaSelecionada] = useState(null)

  const carregar = useCallback(async () => {
    setErro(null)
    try {
      const lista = await listarProvas(supabase)
      setProvas(lista)
      return lista
    } catch (e) {
      console.error(e)
      setErro('Não foi possível carregar as provas. Verifique as permissões no banco.')
      return []
    }
  }, [])

  useEffect(() => {
    let ativo = true
    ;(async () => {
      setCarregando(true)
      await carregar()
      if (ativo) setCarregando(false)
    })()
    return () => {
      ativo = false
    }
  }, [carregar])

  const provasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return provas
    return provas.filter(
      (p) =>
        p.nome_prova?.toLowerCase().includes(termo) ||
        String(p.numero_prova ?? '').includes(termo)
    )
  }, [provas, busca])

  async function handleRecarregar() {
    const lista = await carregar()
    setProvaSelecionada((atual) => {
      if (!atual) return atual
      return lista.find((p) => p.id === atual.id) ?? atual
    })
  }

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-purple-900">Provas</h1>
          <p className="text-gray-500">Gerenciar provas e lançar notas dos alunos.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRecarregar}
            disabled={carregando}
            className="inline-flex items-center gap-2 text-sm text-purple-600 px-3 py-2.5 rounded-xl border border-purple-100 transition hover:bg-purple-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={carregando ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setModalCriar(true)}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium transition self-start"
          >
            <Plus size={18} /> Nova prova
          </button>
        </div>
      </div>

      {erro && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      <div className="relative max-w-sm w-full mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou número..."
          className={inputClass + ' pl-9'}
        />
      </div>

      {carregando ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-2xl border border-purple-100 bg-white" />
          ))}
        </div>
      ) : provasFiltradas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-purple-200 bg-white p-10 text-center">
          <p className="text-gray-400">Nenhuma prova encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {provasFiltradas.map((prova) => (
            <button
              key={prova.id}
              type="button"
              onClick={() => setProvaSelecionada(prova)}
              className="group text-left w-full bg-white rounded-2xl border border-purple-100 p-5 shadow-sm hover:shadow-md hover:border-purple-200 transition"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xl font-bold text-purple-900 truncate">
                  {prova.nome_prova || 'Sem nome'}
                </p>
                {prova.numero_prova !== null && prova.numero_prova !== undefined && (
                  <Badge tone="purple">Nº {prova.numero_prova}</Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ListChecks size={16} className="text-purple-400 shrink-0" />
                <span>
                  {prova.total_questoes !== null && prova.total_questoes !== undefined
                    ? `${prova.total_questoes} questões`
                    : 'Questões não definidas'}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {modalCriar && (
        <ProvaModal
          onClose={() => setModalCriar(false)}
          onSalvo={() => {
            setModalCriar(false)
            carregar()
          }}
        />
      )}

      {provaSelecionada && (
        <ProvaDetalheModal
          prova={provaSelecionada}
          alunos={alunos}
          turmas={turmas}
          onClose={() => setProvaSelecionada(null)}
          onRecarregar={handleRecarregar}
        />
      )}
    </div>
  )
}
