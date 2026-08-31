import { redirect } from 'next/navigation'
import { createClient } from '../lib/supabase/server.js'
import { listarAlunos } from '../services/alunos.js'
import { listarContratos } from '../services/contratos.js'
import { listarTurmas } from '../services/turmas.js'
import App from '../components/App.jsx'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  const user = data.user

  console.log(data.user)
  console.log(error)

  if (!user) redirect('/login')

  let alunos = []
  let contratos = []
  let turmas = []
  let erro = null

  try {
    const [dadosAlunos, dadosContratos, dadosTurmas] = await Promise.all([
      listarAlunos(supabase),
      listarContratos(supabase),
      listarTurmas(supabase),
    ])
    alunos = Array.isArray(dadosAlunos) ? dadosAlunos : []
    contratos = Array.isArray(dadosContratos) ? dadosContratos : []
    turmas = Array.isArray(dadosTurmas) ? dadosTurmas : []
  } catch (e) {
    console.error(e)
    erro =
      'Não foi possível carregar os dados do Supabase. Verifique a conexão e as variáveis de ambiente.'
  }

  return (
    <App
      alunosIniciais={alunos}
      turmasIniciais={turmas}
      erroInicial={erro}
      usuarioInicial={{
        email: user.email,
        nome: user.user_metadata?.nome ?? null,
      }}
      contratoIniciais={contratos}
    />
  )
}
