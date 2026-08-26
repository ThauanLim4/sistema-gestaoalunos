import { getBrowserClient } from '../lib/supabaseClient.js'

export async function listarAlunos(supabase = getBrowserClient()) {
  const [alunosResp, pagamentosResp] = await Promise.all([
    supabase
      .from('alunos')
      .select(
        'id, nome, status, cpf, telefone, email, endereco, data_nascimento, data_matricula'
      ),
    supabase
      .from('pagamentos')
      .select('id, aluno_id, status, valor, vencimento_dia'),
  ])

  if (alunosResp.error) throw alunosResp.error
  if (pagamentosResp.error) throw pagamentosResp.error

  const pagamentosPorAluno = new Map(
    (pagamentosResp.data ?? []).map((pagamento) => [pagamento.aluno_id, pagamento])
  )

  return (alunosResp.data ?? []).map((aluno) => {
    const pagamento = pagamentosPorAluno.get(aluno.id) ?? null

    return {
      id: aluno.id,
      nome: aluno.nome,
      status: aluno.status,
      cpf: aluno.cpf,
      telefone: aluno.telefone,
      email: aluno.email,
      endereco: aluno.endereco,
      data_nascimento: aluno.data_nascimento,
      data_matricula: aluno.data_matricula,
      pagamento: pagamento
        ? {
            status: pagamento.status,
            valor: pagamento.valor,
            vencimento_dia: pagamento.vencimento_dia,
          }
        : null,
    }
  })
}

export async function criarAluno(dados, supabase = getBrowserClient()) {
  const { data, error } = await supabase
    .from('alunos')
    .insert({
      nome: dados.nome,
      cpf: dados.cpf,
      telefone: dados.telefone,
      email: dados.email,
      endereco: dados.endereco,
      data_nascimento: dados.data_nascimento,
      data_matricula: dados.data_matricula,
      status: dados.status ?? 'ativo',
    })
    .select('id, nome, status')
    .single()

  if (error) throw error
  return data
}

export async function atualizarAluno(id, dados, supabase = getBrowserClient()) {
  const { data, error } = await supabase
    .from('alunos')
    .update({
      nome: dados.nome,
      cpf: dados.cpf,
      telefone: dados.telefone,
      email: dados.email,
      endereco: dados.endereco,
      data_nascimento: dados.data_nascimento,
      data_matricula: dados.data_matricula,
      status: dados.status ?? 'cursando',
    })
    .eq('id', id)
    .select('id, nome, status, cpf, telefone, email, endereco, data_nascimento, data_matricula')
    .single()

  if (error) throw error
  return data
}

export async function excluirAluno(id, supabase = getBrowserClient()) {
  const { data: pagamentosDoAluno, error: pgErr } = await supabase
    .from('pagamentos')
    .select('id')
    .eq('aluno_id', id)
  if (pgErr) throw pgErr

  if (pagamentosDoAluno && pagamentosDoAluno.length > 0) {
    const ids = pagamentosDoAluno.map((p) => p.id)

    const { error: histErr } = await supabase
      .from('historico_pagamentos')
      .delete()
      .in('pagamento_id', ids)
    if (histErr) throw histErr

    const { error: contratoErr } = await supabase
      .from('pagamentos')
      .delete()
      .eq('aluno_id', id)
    if (contratoErr) throw contratoErr
  }

  const { error: faltaErr } = await supabase
    .from('faltas')
    .delete()
    .eq('aluno_id', id)
  if (faltaErr) throw faltaErr

  const { error } = await supabase.from('alunos').delete().eq('id', id)
  if (error) throw error
}
