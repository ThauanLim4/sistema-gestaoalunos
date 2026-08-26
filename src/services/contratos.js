import { supabase as supabaseBrowser } from '../lib/supabaseClient.js'

export async function listarContratos(supabase = supabaseBrowser) {
  const { data, error } = await supabase
    .from('pagamentos')
    .select('id, aluno_id, valor, vencimento_dia, status, criado_em')
    .order('criado_em', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function criarContrato(dados, supabase = supabaseBrowser) {
  const { data, error } = await supabase
    .from('pagamentos')
    .insert({
      aluno_id: dados.aluno_id,
      valor: dados.valor,
      vencimento_dia: dados.vencimento_dia,
      status: dados.status ?? 'em_dia',
    })
    .select('id, aluno_id, valor, vencimento_dia, status, criado_em')
    .single()

  if (error) throw error
  return data
}

export async function atualizarContrato(id, dados, supabase = supabaseBrowser) {
  const { data, error } = await supabase
    .from('pagamentos')
    .update({
      aluno_id: dados.aluno_id,
      valor: dados.valor,
      vencimento_dia: dados.vencimento_dia,
      status: dados.status ?? 'em_dia',
    })
    .eq('id', id)
    .select('id, aluno_id, valor, vencimento_dia, status, criado_em')
    .single()

  if (error) throw error
  return data
}
