'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Menu } from 'lucide-react'
import { supabase } from '../lib/supabaseClient.js'
import { listarAlunos } from '../services/alunos.js'
import { listarTurmas } from '../services/turmas.js'
import Sidebar from './Sidebar.jsx'
import Dashboard from './Dashboard.jsx'
import Alunos from './Alunos.jsx'
import Turmas from './Turmas.jsx'
import Financeiro from './Financeiro.jsx'

export default function App({
  alunosIniciais = [],
  turmasIniciais = [],
  erroInicial = null,
  usuarioInicial = null,
  contratoIniciais = [],
}) {
  const router = useRouter()
  const [tela, setTela] = useState('dashboard')
  const [alunos, setAlunos] = useState(alunosIniciais)
  const [turmas, setTurmas] = useState(turmasIniciais)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(erroInicial)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const carregar = useCallback(async () => {
    setCarregando(true)
    try {
      const [dadosAlunos, dadosTurmas] = await Promise.all([
        listarAlunos(),
        listarTurmas(),
      ])
      setAlunos(Array.isArray(dadosAlunos) ? dadosAlunos : [])
      setTurmas(Array.isArray(dadosTurmas) ? dadosTurmas : [])
      setErro(null)
    } catch (e) {
      console.error(e)
      setErro(
        'Não foi possível carregar os dados do Supabase. Verifique a conexão e as variáveis de ambiente.'
      )
    } finally {
      setCarregando(false)
    }
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#f7f6fb] text-gray-800 flex">
      <Sidebar
        active={tela}
        onNavigate={(proximaTela) => {
          setTela(proximaTela)
          setSidebarOpen(false)
        }}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        totalAlunos={alunos.length}
        usuario={usuarioInicial}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-purple-100 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="text-purple-600">
            <Menu size={22} />
          </button>
          <p className="font-semibold text-purple-700">Gestão de Alunos</p>
        </header>

        <main className="flex-1 p-4 md:p-8 w-full">
          <div className="max-w-6xl mx-auto">
            {tela === 'dashboard' ? (
              <Dashboard
                alunos={alunos}
                carregando={carregando}
                erro={erro}
                onAtualizar={carregar}
              />
            ) : tela === 'turmas' ? (
              <Turmas
                turmas={turmas}
                alunos={alunos}
                carregando={carregando}
                erro={erro}
                onAtualizar={carregar}
              />
            ) : tela === 'alunos' ? (
              <Alunos
                alunos={alunos}
                turmas={turmas}
                carregando={carregando}
                erro={erro}
                onAtualizar={carregar}
              />
            ) : (
              <Financeiro
                alunos={alunos}
                contratosIniciais={contratoIniciais}
                carregando={carregando}
                erro={erro}
                onAtualizar={carregar}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
