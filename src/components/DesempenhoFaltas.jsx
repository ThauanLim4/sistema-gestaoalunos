const CORES = {
  bom: '#1D9E75',
  mediano: '#EF9F27',
  ruim: '#E24B4A',
  critico: '#791F1F',
}

// Faixas de fundo da barra (0-3, 3-7, 7-12 e >12 quando aplicável)
const ZONAS = [
  { de: 0, ate: 3, cor: 'rgba(29,158,117,0.14)' },
  { de: 3, ate: 7, cor: 'rgba(239,159,39,0.16)' },
  { de: 7, ate: 12, cor: 'rgba(226,75,74,0.14)' },
]

function classificar(faltas) {
  if (faltas <= 3) return { texto: 'Bom', cor: CORES.bom }
  if (faltas <= 7) return { texto: 'Mediano', cor: CORES.mediano }
  if (faltas <= 12) return { texto: 'Ruim', cor: CORES.ruim }
  return { texto: 'Crítico', cor: CORES.critico }
}

function ResumoCard({ cor, label, valor }) {
  return (
    <div className="rounded-xl border border-purple-100 bg-white px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: cor }} />
        {label}
      </div>
      <div className="mt-0.5 text-xl font-semibold leading-tight text-gray-800">{valor}</div>
    </div>
  )
}

export default function DesempenhoFaltas({
  alunos = [],
  faltasPorAluno = {},
  totalAulas = 24,
}) {
  const lista = alunos
    .map((a) => ({
      id: a.id,
      nome: a.nome || 'Sem nome',
      faltas: Math.max(0, Number(faltasPorAluno?.[a.id]) || 0),
    }))
    .sort((x, y) => y.faltas - x.faltas || x.nome.localeCompare(y.nome, 'pt-BR'))

  const maiorFalta = lista.reduce((max, a) => Math.max(max, a.faltas), 0)
  const max = Math.max(12, maiorFalta)
  const pct = (v) => `${(v / max) * 100}%`

  const contagem = {
    bom: lista.filter((a) => a.faltas <= 3).length,
    mediano: lista.filter((a) => a.faltas >= 4 && a.faltas <= 7).length,
    ruim: lista.filter((a) => a.faltas >= 8 && a.faltas <= 12).length,
    critico: lista.filter((a) => a.faltas >= 13).length,
  }

  const marcas = [0, 3, 7, 12].concat(max > 12 ? [max] : [])

  if (lista.length === 0) {
    return <p className="py-4 text-sm text-gray-400">Nenhum aluno nesta turma.</p>
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-1">
        <div className="text-sm font-medium text-purple-900">Faltas por aluno</div>
        <div className="text-xs text-gray-500">Total: {totalAulas} aulas</div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4">
        <ResumoCard cor={CORES.bom} label="Bom (0 a 3)" valor={contagem.bom} />
        <ResumoCard cor={CORES.mediano} label="Mediano (4 a 7)" valor={contagem.mediano} />
        <ResumoCard cor={CORES.ruim} label="Ruim (8 a 12)" valor={contagem.ruim} />
        <ResumoCard cor={CORES.critico} label="Crítico (13+)" valor={contagem.critico} />
      </div>

      {/* Eixo de referência (alinhado à barra de largura total) */}
      <div className="px-3 mb-1">
        <div className="relative h-4 text-[11px] text-gray-400">
          {marcas.map((v) => (
            <span key={v} className="absolute -translate-x-1/2" style={{ left: pct(v) }}>
              {v}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {lista.map((a) => {
          const k = classificar(a.faltas)
          const presenca = Math.max(0, Math.round(((totalAulas - a.faltas) / totalAulas) * 100))
          return (
            <div key={a.id} className="rounded-xl border border-purple-100 bg-white p-3">
              <div className="flex items-center gap-2">
                <span
                  className="flex-1 min-w-0 truncate text-sm font-medium text-gray-700"
                  title={a.nome}
                >
                  {a.nome}
                </span>
                <span className="shrink-0 text-xs text-gray-500">
                  {a.faltas} {a.faltas === 1 ? 'falta' : 'faltas'}
                </span>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ background: k.cor, color: k.texto === 'Mediano' ? '#2b1a00' : '#fff' }}
                >
                  {k.texto}
                </span>
              </div>

              <div
                className="relative mt-2 h-4 overflow-hidden rounded bg-gray-100"
                role="img"
                aria-label={`${a.nome}: ${a.faltas} faltas, ${k.texto}, ${presenca}% de presença`}
              >
                {ZONAS.map((z) => (
                  <div
                    key={z.de}
                    className="absolute top-0 bottom-0"
                    style={{ left: pct(z.de), width: `${((z.ate - z.de) / max) * 100}%`, background: z.cor }}
                  />
                ))}
                {max > 12 && (
                  <div
                    className="absolute top-0 bottom-0"
                    style={{ left: pct(12), right: 0, background: 'rgba(121,31,31,0.25)' }}
                  />
                )}
                {a.faltas > 0 && (
                  <div
                    className="absolute left-0 top-0 bottom-0 rounded-[3px]"
                    style={{ width: pct(a.faltas), background: k.cor }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-3 text-xs text-gray-400">
        Classificação por faltas: Bom (0–3), Mediano (4–7), Ruim (8–12) e Crítico (13+).
      </p>
    </div>
  )
}
