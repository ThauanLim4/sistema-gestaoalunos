export function formatarMoeda(valor) {
  const numero = Number(valor)
  if (!Number.isFinite(numero)) return '—'
  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function formatarVencimento(dia) {
  if (dia == null) return '—'
  return `Dia ${dia}`
}

export function iniciais(nome) {
  if (!nome) return '?'
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? '')
    .join('')
}

export function statusPagamento(aluno) {
  if (!aluno.pagamento) return 'sem_pagamento'
  return aluno.pagamento.status
}

export const TEXTO_STATUS = {
  em_dia: 'Em dia',
  atrasado: 'Atrasado',
  sem_pagamento: 'Sem pagamento',
  cancelado: 'Cancelado',
}

export const TOM_STATUS = {
  em_dia: 'green',
  atrasado: 'red',
  sem_pagamento: 'gray',
  cancelado: 'amber',
}

export function formatarData(data) {
  if (!data) return '—'
  const iso = String(data).slice(0, 10)
  const [ano, mes, dia] = iso.split('-')
  if (!ano || !mes || !dia) return String(data)
  return `${dia}/${mes}/${ano}`
}

export function situacaoAluno(aluno) {
  const s = aluno.status
  if (s === 'ativo') return 'cursando'
  if (s === 'inativo') return 'desistente'
  return s ?? 'cursando'
}

export const TEXTO_SITUACAO_ALUNO = {
  cursando: 'Cursando',
  desistente: 'Desistente',
  ativo: 'Cursando',
  inativo: 'Desistente',
}

export const TOM_SITUACAO_ALUNO = {
  cursando: 'green',
  desistente: 'red',
  ativo: 'green',
  inativo: 'red',
}
