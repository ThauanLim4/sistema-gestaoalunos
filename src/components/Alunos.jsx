import { useMemo, useState } from 'react'
import { Search, Plus, RefreshCw } from 'lucide-react'
import { inputClass } from './ui.jsx'
import StudentCard from './StudentCard.jsx'
import NovoAlunoModal from './NovoAlunoModal.jsx'
import AlunoDetalheModal from './AlunoDetalheModal.jsx'
import { situacaoAluno } from '../lib/format.js'
import { listarFaltas } from '../services/faltas.js'

const FILTROS = [
  { id: 'todos', label: 'Todos' },
  { id: 'cursando', label: 'Cursando' },
  { id: 'desistente', label: 'Desistente' },
]

export default function Alunos({ alunos, carregando, erro, onAtualizar }) {
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [modalAberto, setModalAberto] = useState(false)
  const [alunoSelecionado, setAlunoSelecionado] = useState(null)
  const [faltasDoSelecionado, setFaltasDoSelecionado] = useState([])

  async function abrirAluno(aluno) {
    try {
      const f = await listarFaltas(aluno.id)
      setFaltasDoSelecionado(Array.isArray(f) ? f : [])
    } catch (e) {
      console.error(e)
      setFaltasDoSelecionado([])
    }
    setAlunoSelecionado(aluno)
  }

  const alunosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return alunos.filter((aluno) => {
      const correspondeBusca =
        !termo || aluno.nome?.toLowerCase().includes(termo)
      const correspondeFiltro =
        filtro === 'todos' || situacaoAluno(aluno) === filtro
      return correspondeBusca && correspondeFiltro
    })
  }, [alunos, busca, filtro])

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-purple-900">Alunos</h1>
          <p className="text-gray-500">Cadastro e informações dos alunos.</p>
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
            onClick={() => setModalAberto(true)}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium transition self-start"
          >
            <Plus size={18} /> Novo aluno
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
            placeholder="Buscar por nome..."
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
      ) : alunosFiltrados.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-purple-200 bg-white p-10 text-center">
          <p className="text-gray-400">Nenhum aluno encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {alunosFiltrados.map((aluno) => (
            <StudentCard key={aluno.id} aluno={aluno} onSelecionar={abrirAluno} />
          ))}
        </div>
      )}

      {modalAberto && (
        <NovoAlunoModal
          onClose={() => setModalAberto(false)}
          onCriado={() => {
            setModalAberto(false)
            onAtualizar()
          }}
        />
      )}

      {alunoSelecionado && (
        <AlunoDetalheModal
          aluno={alunoSelecionado}
          faltasIniciais={faltasDoSelecionado}
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
