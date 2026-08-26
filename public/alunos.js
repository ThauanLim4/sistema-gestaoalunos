const initialAlunos = [
  {
    id: 1,
    nome: "Beatriz Souza Lima",
    idade: 21,
    cpf: "123.456.789-00",
    telefone: "(83) 99123-4567",
    email: "beatriz.lima@email.com",
    endereco: "Rua das Acácias, 120 - Pombal/PB",
    dataMatricula: "2026-02-10",
    pagamento: {
      status: "em_dia",
      metodo: "Pix",
      valor: 150,
      vencimentoDia: 10,
      historico: [
        { id: 1, data: "2026-06-10", valor: 150 },
        { id: 2, data: "2026-07-10", valor: 150 },
      ],
    },
    faltas: [
      { id: 1, data: "2026-06-14", justificada: false },
      { id: 2, data: "2026-07-02", justificada: true },
    ],
    arquivos: [
      { id: 1, nome: "Introdução - Slides.pdf", tipo: "Slide", data: "2026-06-01" },
      { id: 2, nome: "Atividade 01.docx", tipo: "Atividade", data: "2026-06-05" },
    ],
  },
  {
    id: 2,
    nome: "Rafael Costa Andrade",
    idade: 19,
    cpf: "987.654.321-00",
    telefone: "(83) 99876-5432",
    email: "rafael.andrade@email.com",
    endereco: "Av. Brasil, 45 - Pombal/PB",
    dataMatricula: "2026-03-05",
    pagamento: {
      status: "atrasado",
      metodo: "Cartão de Crédito",
      valor: 150,
      vencimentoDia: 5,
      historico: [{ id: 1, data: "2026-06-05", valor: 150 }],
    },
    faltas: [
      { id: 1, data: "2026-06-20", justificada: false },
      { id: 2, data: "2026-06-27", justificada: false },
      { id: 3, data: "2026-07-04", justificada: false },
    ],
    arquivos: [{ id: 1, nome: "Material de Apoio - Unidade 1.pdf", tipo: "Material de Apoio", data: "2026-05-20" }],
  },
  {
    id: 3,
    nome: "Camila Ferreira Nunes",
    idade: 24,
    cpf: "456.789.123-00",
    telefone: "(83) 99555-2211",
    email: "camila.nunes@email.com",
    endereco: "Rua Piauí, 78 - Pombal/PB",
    dataMatricula: "2026-01-15",
    pagamento: {
      status: "em_dia",
      metodo: "Dinheiro",
      valor: 150,
      vencimentoDia: 15,
      historico: [
        { id: 1, data: "2026-05-15", valor: 150 },
        { id: 2, data: "2026-06-15", valor: 150 },
        { id: 3, data: "2026-07-15", valor: 150 },
      ],
    },
    faltas: [],
    arquivos: [
      { id: 1, nome: "Slides - Módulo 2.pptx", tipo: "Slide", data: "2026-06-10" },
      { id: 2, nome: "Atividade 02.pdf", tipo: "Atividade", data: "2026-06-18" },
      { id: 3, nome: "Leitura complementar.pdf", tipo: "Material de Apoio", data: "2026-06-22" },
    ],
  },
];


export default initialAlunos;