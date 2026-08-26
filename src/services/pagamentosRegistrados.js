import { supabase as supabaseBrowser } from '../lib/supabaseClient.js'

export async function listarPagamentosRegistrados(contratoId, supabase = supabaseBrowser) {
  const { data, error } = await supabase
    .from('historico_pagamentos')
    .select('id, pagamento_id, data, valor, metodo_pagamento, criado_em')
    .eq('pagamento_id', contratoId)
    .order('data', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function criarPagamentoRegistrado(dados, supabase = supabaseBrowser) {
  const { data, error } = await supabase
    .from('historico_pagamentos')
    .insert({
      pagamento_id: dados.pagamento_id,
      data: dados.data,
      metodo_pagamento: dados.metodo_pagamento,
      valor: dados.valor,
    })
    .select('id, pagamento_id, data, valor, metodo_pagamento, criado_em')
    .single()

  if (error) throw error
  return data
}

export async function atualizarPagamentoRegistrado(id, dados, supabase = supabaseBrowser) {
  const { data, error } = await supabase
    .from('historico_pagamentos')
    .update({
      data: dados.data,
      metodo_pagamento: dados.metodo_pagamento,
      valor: dados.valor,
    })
    .eq('id', id)
    .select('id, pagamento_id, data, valor, metodo_pagamento, criado_em')
    .single()

  if (error) throw error
  return data
}
