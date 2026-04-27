import { useEffect, useMemo, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const emptyForm = {
  patient: '',
  doctor: '',
  specialty: '',
  date: '',
  time: '',
  status: 'Aguardando'
};

export default function App() {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadAppointments() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/appointments`);
      if (!response.ok) {
        throw new Error('Não foi possível buscar os agendamentos.');
      }
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  const stats = useMemo(() => {
    const total = appointments.length;
    const confirmed = appointments.filter(item => item.status === 'Confirmada').length;
    const waiting = appointments.filter(item => item.status === 'Aguardando').length;

    return { total, confirmed, waiting };
  }, [appointments]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao cadastrar consulta.');
      }

      setSuccess('Consulta cadastrada com sucesso.');
      setForm(emptyForm);
      loadAppointments();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="tag">Sistema de agendamento médico</p>
          <h1>MedAgenda</h1>
          <p className="subtitle">
            Painel simples para visualizar e cadastrar consultas médicas.
          </p>
        </div>
      </header>

      <section className="stats-grid">
        <StatCard title="Total de consultas" value={stats.total} />
        <StatCard title="Confirmadas" value={stats.confirmed} />
        <StatCard title="Aguardando" value={stats.waiting} />
      </section>

      <main className="content-grid">
        <section className="card">
          <h2>Nova consulta</h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input name="patient" placeholder="Paciente" value={form.patient} onChange={handleChange} />
            <input name="doctor" placeholder="Médico" value={form.doctor} onChange={handleChange} />
            <input name="specialty" placeholder="Especialidade" value={form.specialty} onChange={handleChange} />
            <input name="date" type="date" value={form.date} onChange={handleChange} />
            <input name="time" type="time" value={form.time} onChange={handleChange} />
            <select name="status" value={form.status} onChange={handleChange}>
              <option>Aguardando</option>
              <option>Confirmada</option>
              <option>Remarcada</option>
            </select>
            <button type="submit">Cadastrar consulta</button>
          </form>

          {success && <p className="message success">{success}</p>}
          {error && <p className="message error">{error}</p>}
        </section>

        <section className="card">
          <div className="table-header">
            <h2>Consultas do dia</h2>
            <button onClick={loadAppointments}>Atualizar</button>
          </div>

          {loading ? (
            <p>Carregando dados...</p>
          ) : appointments.length === 0 ? (
            <p>Nenhuma consulta cadastrada.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Paciente</th>
                    <th>Médico</th>
                    <th>Especialidade</th>
                    <th>Data</th>
                    <th>Hora</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(item => (
                    <tr key={item.id}>
                      <td>{item.patient}</td>
                      <td>{item.doctor}</td>
                      <td>{item.specialty}</td>
                      <td>{item.date}</td>
                      <td>{item.time}</td>
                      <td>
                        <span className={`badge ${item.status.toLowerCase()}`}>{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <article className="stat-card">
      <span>{title}</span>
      <strong>{value}</strong>
    </article>
  );
}
