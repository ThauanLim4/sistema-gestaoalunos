import { supabase as supabaseBrowser } from '../lib/supabaseClient.js'

export async function listarFaltas(alunoId, supabase = supabaseBrowser) {
  const { data, error } = await supabase
    .from('faltas')
    .select('id, aluno_id, numero_aula, data, justificado, criado_em')
    .eq('aluno_id', alunoId)
    .order('data', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function criarFalta(dados, supabase = supabaseBrowser) {
  const { data, error } = await supabase
    .from('faltas')
    .insert({
      aluno_id: dados.aluno_id,
      numero_aula: dados.numero_aula,
      data: dados.data,
      justificado: dados.justificado,
    })
    .select('id, aluno_id, numero_aula, data, justificado, criado_em')
    .single()

  if (error) throw error
  return data
}

export async function atualizarFalta(id, dados, supabase = supabaseBrowser) {
  const { data, error } = await supabase
    .from('faltas')
    .update({
      numero_aula: dados.numero_aula,
      data: dados.data,
      justificado: dados.justificado,
    })
    .eq('id', id)
    .select('id, aluno_id, numero_aula, data, justificado, criado_em')
    .single()

  if (error) throw error
  return data
}
