import { getBrowserClient } from '../lib/supabaseClient.js'

const COLUNAS_PROVA = 'id, nome_prova, total_questoes, numero_prova'
const COLUNAS_NOTA = 'id, aluno_id, prova_id, nota, feita_em'

export async function listarProvas(supabase = getBrowserClient()) {
  const { data, error } = await supabase
    .from('provas')
    .select(COLUNAS_PROVA)
    .order('numero_prova', { ascending: true, nullsFirst: false })

  if (error) throw error
  return data ?? []
}

export async function criarProva(dados, supabase = getBrowserClient()) {
  const { data, error } = await supabase
    .from('provas')
    .insert({
      nome_prova: dados.nome_prova,
      total_questoes: dados.total_questoes,
      numero_prova: dados.numero_prova,
    })
    .select(COLUNAS_PROVA)
    .single()

  if (error) throw error
  return data
}

export async function atualizarProva(id, dados, supabase = getBrowserClient()) {
  const { data, error } = await supabase
    .from('provas')
    .update({
      nome_prova: dados.nome_prova,
      total_questoes: dados.total_questoes,
      numero_prova: dados.numero_prova,
    })
    .eq('id', id)
    .select(COLUNAS_PROVA)
    .single()

  if (error) throw error
  return data
}

export async function excluirProva(id, supabase = getBrowserClient()) {
  const { error: notasErr } = await supabase.from('notas').delete().eq('prova_id', id)
  if (notasErr) throw notasErr

  const { error } = await supabase.from('provas').delete().eq('id', id)
  if (error) throw error
}

export async function listarNotasPorProva(provaId, supabase = getBrowserClient()) {
  const { data, error } = await supabase
    .from('notas')
    .select(COLUNAS_NOTA)
    .eq('prova_id', provaId)

  if (error) throw error
  return data ?? []
}

// entradas: [{ aluno_id, nota }] — nota vazia/null remove o registro existente
export async function salvarNotasProva(provaId, entradas, supabase = getBrowserClient()) {
  const existentes = await listarNotasPorProva(provaId, supabase)
  const porAluno = new Map(existentes.map((n) => [n.aluno_id, n]))

  const paraInserir = []
  const paraAtualizar = []
  const paraExcluir = []

  for (const entrada of entradas) {
    const atual = porAluno.get(entrada.aluno_id)
    const valor = entrada.nota
    const vazio = valor === null || valor === undefined || String(valor).trim() === ''
    const notaNum = vazio ? null : Number(valor)

    if (notaNum === null || Number.isNaN(notaNum)) {
      if (atual) paraExcluir.push(atual.id)
      continue
    }

    if (atual) {
      if (Number(atual.nota) !== notaNum) {
        paraAtualizar.push({ id: atual.id, nota: notaNum })
      }
    } else {
      paraInserir.push({
        aluno_id: entrada.aluno_id,
        prova_id: provaId,
        nota: notaNum,
        feita_em: new Date().toISOString(),
      })
    }
  }

  if (paraExcluir.length > 0) {
    const { error } = await supabase.from('notas').delete().in('id', paraExcluir)
    if (error) throw error
  }

  if (paraAtualizar.length > 0) {
    const resultados = await Promise.all(
      paraAtualizar.map((item) =>
        supabase.from('notas').update({ nota: item.nota }).eq('id', item.id)
      )
    )
    const falha = resultados.find((r) => r.error)
    if (falha) throw falha.error
  }

  if (paraInserir.length > 0) {
    const { error } = await supabase.from('notas').insert(paraInserir)
    if (error) throw error
  }
}
