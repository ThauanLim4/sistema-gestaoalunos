import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { inputClass } from './ui.jsx'
import { criarAluno, atualizarAluno } from '../services/alunos.js'

function formatarCpf(valor) {
  const numeros = valor.replace(/\D/g, '').slice(0, 11)
  return numeros
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export default function NovoAlunoModal({ aluno, onClose, onCriado }) {
  const [nome, setNome] = useState(aluno?.nome ?? '')
  const [cpf, setCpf] = useState(aluno?.cpf ?? '')
  const [telefone, setTelefone] = useState(aluno?.telefone ?? '')
  const [email, setEmail] = useState(aluno?.email ?? '')
  const [endereco, setEndereco] = useState(aluno?.endereco ?? '')
  const [dataNascimento, setDataNascimento] = useState(aluno?.data_nascimento ?? '')
  const [dataMatricula, setDataMatricula] = useState(aluno?.data_matricula ?? '')
  const [status, setStatus] = useState(aluno?.status ?? 'cursando')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nome.trim()) return
    setSalvando(true)
    setErro(null)
    try {
      const payload = {
        nome: nome.trim(),
        cpf: cpf.trim(),
        telefone: telefone.trim(),
        email: email.trim(),
        endereco: endereco.trim(),
        data_nascimento: dataNascimento || null,
        data_matricula: dataMatricula || null,
        status,
      }
      const salvo = aluno
        ? await atualizarAluno(aluno.id, payload)
        : await criarAluno(payload)
      onCriado?.(salvo)
    } catch (err) {
      console.error(err)
      setErro(
        aluno
          ? 'Não foi possível atualizar o aluno. Verifique as permissões e as colunas no banco.'
          : 'Não foi possível cadastrar o aluno. Verifique as permissões e se as colunas existem no banco.'
      )
      setSalvando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-purple-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-lg font-semibold text-purple-900">
            {aluno ? 'Editar aluno' : 'Novo aluno'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-purple-600 transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-600 mb-1">Nome completo</span>
            <input
              required
              autoFocus
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Maria Silva"
              className={inputClass}
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-sm font-medium text-gray-600 mb-1">CPF</span>
              <input
                value={cpf}
                onChange={(e) => setCpf(formatarCpf(e.target.value))}
                placeholder="000.000.000-00"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-600 mb-1">Telefone</span>
              <input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="83999999999"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-600 mb-1">E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aluno@exemplo.com"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-600 mb-1">Situação</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={inputClass}
              >
                <option value="cursando">Cursando</option>
                <option value="desistente">Desistente</option>
              </select>
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-600 mb-1">
                Data de nascimento
              </span>
              <input
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-600 mb-1">
                Data de matrícula
              </span>
              <input
                type="date"
                value={dataMatricula}
                onChange={(e) => setDataMatricula(e.target.value)}
                className={inputClass}
              />
            </label>
          </div>

          <label className="block">
            <span className="block text-sm font-medium text-gray-600 mb-1">Endereço</span>
            <textarea
              rows={2}
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Rua, número, bairro, cidade"
              className={inputClass}
            />
          </label>

          {erro && <p className="text-sm text-red-600">{erro}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition font-medium disabled:opacity-60"
            >
              {salvando && <Loader2 size={16} className="animate-spin" />}
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
