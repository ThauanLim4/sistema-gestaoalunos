import { getBrowserClient } from '../lib/supabaseClient.js'

export async function listarTurmas(supabase = getBrowserClient()) {
  const { data, error } = await supabase
    .from('turmas')
    .select('id, turma_cidade, numero_turma, dia_turma, status, criada_em')
    .order('numero_turma', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function criarTurma(dados, supabase = getBrowserClient()) {
  const { data, error } = await supabase
    .from('turmas')
    .insert({
      turma_cidade: dados.turma_cidade,
      numero_turma: dados.numero_turma,
      dia_turma: dados.dia_turma,
      status: dados.status ?? 'ativa',
    })
    .select('id, turma_cidade, numero_turma, dia_turma, status, criada_em')
    .single()

  if (error) throw error
  return data
}

export async function atualizarTurma(id, dados, supabase = getBrowserClient()) {
  const { data, error } = await supabase
    .from('turmas')
    .update({
      turma_cidade: dados.turma_cidade,
      numero_turma: dados.numero_turma,
      dia_turma: dados.dia_turma,
      status: dados.status,
    })
    .eq('id', id)
    .select('id, turma_cidade, numero_turma, dia_turma, status, criada_em')
    .single()

  if (error) throw error
  return data
}

export async function excluirTurma(id, supabase = getBrowserClient()) {
  const { error: updateErr } = await supabase
    .from('alunos')
    .update({ turma_id: null })
    .eq('turma_id', id)
  if (updateErr) throw updateErr

  const { error } = await supabase.from('turmas').delete().eq('id', id)
  if (error) throw error
}
