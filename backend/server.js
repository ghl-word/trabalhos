import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
console.log(process.env.GEMINI_API_KEY ? "✅ Chave da IA carregada" : "❌ CHAVE AUSENTE");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🔥 IA CONFIG
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 📅 Dados mock
let appointments = [
  {
    id: 1,
    patient: 'Ana Souza',
    doctor: 'Dr. Ricardo Lima',
    specialty: 'Clínico Geral',
    date: '2026-04-01',
    time: '09:00',
    status: 'Confirmada'
  },
  {
    id: 2,
    patient: 'Carlos Mendes',
    doctor: 'Dra. Marina Costa',
    specialty: 'Pediatria',
    date: '2026-04-01',
    time: '10:30',
    status: 'Aguardando'
  },
  {
    id: 3,
    patient: 'Fernanda Rocha',
    doctor: 'Dr. Paulo Oliveira',
    specialty: 'Cardiologia',
    date: '2026-04-01',
    time: '14:00',
    status: 'Confirmada'
  }
];

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'MedAgenda',
    message: 'Backend em execução com sucesso.'
  });
});

// 📅 Listar consultas
app.get('/api/appointments', (req, res) => {
  res.json(appointments);
});

// ➕ Criar consulta
app.post('/api/appointments', (req, res) => {
  const { patient, doctor, specialty, date, time, status } = req.body;

  if (!patient || !doctor || !specialty || !date || !time) {
    return res.status(400).json({
      message: 'Preencha paciente, médico, especialidade, data e horário.'
    });
  }

  const newAppointment = {
    id: appointments.length + 1,
    patient,
    doctor,
    specialty,
    date,
    time,
    status: status || 'Aguardando'
  };

  appointments.push(newAppointment);
  res.status(201).json(newAppointment);
});

// 🤖 ROTA IA (Com Chat e Contexto)
app.post('/api/ia', async (req, res) => {
  try {
    const { pergunta } = req.body;

    // 1. Configura o modelo com a Instrução de Sistema (Contexto)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "Você é um assistente virtual da clínica médica MedAgenda. Responda as perguntas apenas em português, de forma educada, prestativa e concisa.",
    });

    // 2. Inicia o Chat
    const chat = model.startChat({
      history: [], // Aqui você pode, no futuro, passar mensagens antigas para a IA lembrar da conversa
    });

    // 3. Envia a mensagem do usuário
    const result = await chat.sendMessage(pergunta || "Teste de conexão");
    
    // 4. Extrai o texto da resposta
    const resposta = result.response.text();

    res.json({
      sucesso: true,
      resposta
    });

  } catch (error) {
    console.error("ERRO IA:", error);

    res.status(500).json({
      sucesso: false,
      erro: error.message
    });
  }
});

// 🚀 INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`🚀 MedAgenda backend iniciado na porta ${PORT}`);
});