'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient.js'
import { GraduationCap, Loader2, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setCarregando(true)
    setErro(null)

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
    })

    if (error) {
      setErro('E-mail ou senha inválidos. Verifique os dados e tente novamente.')
      setCarregando(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#f7f6fb] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
          <div className="bg-purple-600 px-6 py-8 flex flex-col items-center text-white">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-3">
              <GraduationCap size={28} />
            </div>
            <h1 className="text-xl font-bold">Gestão de Alunos</h1>
            <p className="text-sm text-purple-100">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <label className="block mb-4">
              <span className="block text-sm font-medium text-gray-600 mb-1">E-mail</span>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@exemplo.com"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </label>

            <label className="block mb-5">
              <span className="block text-sm font-medium text-gray-600 mb-1">Senha</span>
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </label>

            {erro && <p className="mb-4 text-sm text-red-600">{erro}</p>}

            <button
              type="submit"
              disabled={carregando}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition font-medium disabled:opacity-60"
            >
              {carregando && <Loader2 size={16} className="animate-spin" />}
              <LogIn size={16} />
              Entrar
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">Curso particular · área restrita</p>
      </div>
    </div>
  )
}
