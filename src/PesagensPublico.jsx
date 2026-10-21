import { useState, useEffect } from "react";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const API_PESAGENS = `${BASE_URL}/pesagens`;
const API_BOVINOS = `${BASE_URL}/bovinos`;

function PesagensPublico() {
  const [pesoKg, setPesoKg] = useState("");
  const [dataPesagem, setDataPesagem] = useState("");
  const [brincoAferido, setBrincoAferido] = useState("");
  const [pesagens, setPesagens] = useState([]);
  const [bovinos, setBovinos] = useState([]);
  const [mensagem, setMensagem] = useState("");

  const carregarDados = async () => {
    try {
      // busca a a lista de pesagens
      const resPes = await fetch(API_PESAGENS);
      const dadosPes = await resPes.json();

      if (Array.isArray(dadosPes)) {
        setPesagens(dadosPes);
      } else {
        setPesagens([]);
        console.error("Retorno de pesagens não é uma lista:", dadosPes);
      }

      // busca a lista de animais para selação
      const resBov = await fetch(API_BOVINOS);
      const dadosBov = await resBov.json();

      if (Array.isArray(dadosBov)) {
        setBovinos(dadosBov);
      } else {
        setBovinos([]);
        console.error("Retorno de bovinos não é uma lista:", dadosBov);
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setPesagens([]);
      setBovinos([]);
      setMensagem("Falha na comunicação com a API.");
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!pesoKg || !dataPesagem || !brincoAferido) {
      setMensagem("Preencha todos os campos do formulário.");
      return;
    }

    try {
      const res = await fetch(API_PESAGENS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          peso_kg: Number(pesoKg),
          data_pesagem: dataPesagem,
          brinco_aferido: Number(brincoAferido),
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setPesoKg("");
        setDataPesagem("");
        setBrincoAferido("");
        setMensagem(data.mensagem || "Pesagem registrada com sucesso!");
        carregarDados();
      } else {
        setMensagem(data.mensagem || data.erro || "Erro ao registrar pesagem.");
      }
    } catch (err) {
      setMensagem("Falha ao conectar com o servidor.");
    }
  };

  return (
    <div className="container py-3">

      <div
        className="card shadow-sm p-4 mb-4 border-0"
        style={{ backgroundColor: "#f8f9fa", borderRadius: "12px" }}
      >
        <h3 className="h5 fw-bold text-success mb-3">
          Registro de Pesagens
        </h3>

        {mensagem && (
          <div className="alert alert-info py-2 px-3 mb-3 small" role="alert">
            <strong>Aviso:</strong> {mensagem}
          </div>
        )}

        <form onSubmit={handleSalvar}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold small">Bovino (Nº Brinco):</label>
              <select
                className="form-select bg-white"
                value={brincoAferido}
                onChange={(e) => setBrincoAferido(e.target.value)}
              >
                <option value="">Selecione o animal...</option>
                {bovinos.map((b) => (
                  <option key={b.numeroBrinco} value={b.numeroBrinco}>
                    Brinco Nº {b.numeroBrinco} (Nasc: {b.nascimento ? b.nascimento.split("T")[0] : ""})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold small">Peso (kg):</label>
              <input
                type="number"
                step="0.01"
                min="1"
                max="9999.99"
                className="form-control bg-white"
                placeholder="Ex: 485.50"
                value={pesoKg}
                onChange={(e) => setPesoKg(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold small">Data da Pesagem:</label>
              <input
                type="date"
                className="form-control bg-white"
                value={dataPesagem}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDataPesagem(e.target.value)}
              />
            </div>

            <div className="col-12 pt-2">
              <button type="submit" className="btn btn-success px-4">
                Registrar Pesagem
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Tabela */}
      <div className="mt-4">
        <h3 className="h5 fw-bold text-success mb-3">Histórico de Pesagens</h3>
        <div className="table-responsive shadow-sm" style={{ borderRadius: "8px", overflow: "hidden" }}>
          <table className="table table-striped table-hover table-bordered align-middle text-center mb-0">
            <thead className="table-success">
              <tr>
                <th>ID</th>
                <th>Nº Brinco</th>
                <th>Peso (kg)</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {pesagens.length > 0 ? (
                pesagens.map((p) => (
                  <tr key={p.idPesagem}>
                    <td>{p.idPesagem}</td>
                    <td>{p.brincoAferido}</td>
                    <td>{p.pesoKg} kg</td>
                    <td>{p.dataPesagem ? p.dataPesagem.split("T")[0] : ""}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-muted py-3">
                    Nenhuma pesagem cadastrada no momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PesagensPublico;