import { Mail, Phone, MapPin, Cake, CalendarDays } from 'lucide-react'
import { Badge } from './ui.jsx'
import {
  iniciais,
  formatarData,
  situacaoAluno,
  TEXTO_SITUACAO_ALUNO,
  TOM_SITUACAO_ALUNO,
} from '../lib/format.js'

export default function StudentCard({ aluno, onSelecionar }) {
  const situacao = situacaoAluno(aluno)

  return (
    <button
      type="button"
      onClick={() => onSelecionar?.(aluno)}
      className="group text-left w-full bg-white rounded-2xl border border-purple-100 p-5 shadow-sm hover:shadow-md hover:border-purple-200 transition"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold text-sm shrink-0">
          {iniciais(aluno.nome)}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 truncate">{aluno.nome}</p>
          <p className="text-xs text-gray-400 truncate">{aluno.email || 'Sem e-mail'}</p>
        </div>
        <div className="ml-auto">
          <Badge tone={TOM_SITUACAO_ALUNO[situacao]}>
            {TEXTO_SITUACAO_ALUNO[situacao]}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-gray-500">
          <Cake size={16} className="text-purple-400 shrink-0" />
          <span className="truncate">{formatarData(aluno.data_nascimento)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <CalendarDays size={16} className="text-purple-400 shrink-0" />
          <span className="truncate">{formatarData(aluno.data_matricula)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Phone size={16} className="text-purple-400 shrink-0" />
          <span className="truncate">{aluno.telefone || '—'}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Mail size={16} className="text-purple-400 shrink-0" />
          <span className="truncate">{aluno.email || '—'}</span>
        </div>
        <div className="col-span-2 flex items-center gap-2 text-gray-500">
          <MapPin size={16} className="text-purple-400 shrink-0" />
          <span className="truncate">{aluno.endereco || '—'}</span>
        </div>
      </div>
    </button>
  )
}
