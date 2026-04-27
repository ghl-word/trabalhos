import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'MedAgenda',
    message: 'Backend em execução com sucesso.'
  });
});

app.get('/api/appointments', (req, res) => {
  res.json(appointments);
});

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

app.listen(PORT, () => {
  console.log(`MedAgenda backend iniciado na porta ${PORT}`);
});
