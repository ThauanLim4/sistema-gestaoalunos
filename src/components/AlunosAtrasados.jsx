import { Badge } from './ui.jsx'
import { formatarVencimento, TOM_STATUS, TEXTO_STATUS } from '../lib/format.js'

export default function AlunosAtrasados({ alunos }) {
  if (!alunos || alunos.length === 0) {
    return (
      <p className="text-sm text-gray-400">
        Nenhum aluno com pagamento atrasado no momento.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {alunos.map((aluno) => (
        <div
          key={aluno.id}
          className="flex w-full items-center justify-between rounded-xl bg-red-50 px-4 py-3"
        >
          <div>
            <p className="font-medium text-gray-800">{aluno.nome}</p>
            <p className="text-xs text-gray-500">
              {aluno.pagamento?.vencimento_dia
                ? `Vencimento todo ${formatarVencimento(aluno.pagamento.vencimento_dia).toLowerCase()}`
                : 'Sem dia de vencimento definido'}
            </p>
          </div>
          <Badge tone={TOM_STATUS.atrasado}>{TEXTO_STATUS.atrasado}</Badge>
        </div>
      ))}
    </div>
  )
}
