import { getBrowserClient } from '../lib/supabaseClient.js'

export async function listarFaltas(alunoId, supabase = getBrowserClient()) {
  const { data, error } = await supabase
    .from('faltas')
    .select('id, aluno_id, numero_aula, data, justificado, criado_em')
    .eq('aluno_id', alunoId)
    .order('numero_aula', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function criarFalta(dados, supabase = getBrowserClient()) {
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

export async function atualizarFalta(id, dados, supabase = getBrowserClient()) {
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

export async function excluirFalta(id, supabase = getBrowserClient()) {
  const { error } = await supabase.from('faltas').delete().eq('id', id)
  if (error) throw error
}

export async function contarFaltasPorAluno(alunoIds, supabase = getBrowserClient()) {
  if (!Array.isArray(alunoIds) || alunoIds.length === 0) return {}
  const { data, error } = await supabase
    .from('faltas')
    .select('aluno_id')
    .in('aluno_id', alunoIds)

  if (error) throw error
  return (data ?? []).reduce((contagem, falta) => {
    contagem[falta.aluno_id] = (contagem[falta.aluno_id] ?? 0) + 1
    return contagem
  }, {})
}
