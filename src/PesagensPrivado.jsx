import { useState, useEffect } from "react";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const API_PESAGENS = `${BASE_URL}/pesagens`;
const API_BOVINOS = `${BASE_URL}/bovinos`;

function PesagensPrivado() {
  const [pesoKg, setPesoKg] = useState("");
  const [dataPesagem, setDataPesagem] = useState("");
  const [brincoAferido, setBrincoAferido] = useState("");
  const [pesagens, setPesagens] = useState([]);
  const [bovinos, setBovinos] = useState([]);
  const [mensagem, setMensagem] = useState("");

  // caso for null novo cadastro caso for um valor edição de algum cadastro do banco
  const [idEdicao, setIdEdicao] = useState(null);

  const carregarDados = async () => {
    try {
      // busca a lista de pesagens cadastrada no banco
      const resPes = await fetch(API_PESAGENS);
      const dadosPes = await resPes.json();

      if (Array.isArray(dadosPes)) {
        setPesagens(dadosPes);
      } else {
        setPesagens([]);
        setMensagem(dadosPes.erro || dadosPes.mensagem || "Erro ao carregar pesagens.");
      }

      // busca a lista de animais para selecionar no cria ou editar
      const resBov = await fetch(API_BOVINOS);
      const dadosBov = await resBov.json();

      if (Array.isArray(dadosBov)) {
        setBovinos(dadosBov);
      } else {
        setBovinos([]);
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setPesagens([]);
      setBovinos([]);
      setMensagem("Falha na comunicação com o servidor.");
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // carrega os dados da pesagen selecionada para a edição
  const handleCarregarEdicao = (pesagem) => {
    setIdEdicao(pesagem.idPesagem);
    setPesoKg(pesagem.pesoKg);
    setDataPesagem(pesagem.dataPesagem ? pesagem.dataPesagem.split("T")[0] : "");
    setBrincoAferido(pesagem.brincoAferido);
    setMensagem("");
  };

  // cancela edição e limpa os campos
  const handleCancelarEdicao = () => {
    setIdEdicao(null);
    setPesoKg("");
    setDataPesagem("");
    setBrincoAferido("");
  };

  // salva para isso decide entr post e put criar oou editr
  const handleSalvar = async (e) => {
    e.preventDefault(); // nçao deixa o navegadro recarrecgar o component
    if (!pesoKg || !dataPesagem || !brincoAferido) {
      setMensagem("Preencha todos os campos do formulário.");
      return;
    }

    const url = idEdicao ? `${API_PESAGENS}/${idEdicao}` : API_PESAGENS;
    const metodo = idEdicao ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          peso_kg: Number(pesoKg),
          data_pesagem: dataPesagem,
          brinco_aferido: Number(brincoAferido),
        }),
      });
      const data = await res.json();

      if (res.ok) {
        handleCancelarEdicao();
        setMensagem(data.mensagem || "Operação realizada com sucesso!");
        carregarDados();
      } else {
        setMensagem(data.mensagem || data.erro || "Erro ao registrar pesagem.");
      }
    } catch (err) {
      setMensagem("Falha ao conectar com o servidor.");
    }
  };

  const handleRemover = async (id) => {
    if (window.confirm("Deseja realmente excluir este registro de pesagem?")) {
      try {
        const res = await fetch(`${API_PESAGENS}/${id}`, { method: "DELETE" });
        const data = await res.json();

        if (res.ok) {
          setMensagem(data.mensagem || "Pesagem removida com sucesso.");
          if (idEdicao === id) {
            handleCancelarEdicao();
          }
          carregarDados();
        } else {
          setMensagem(data.mensagem || data.erro || "Erro ao remover pesagem.");
        }
      } catch (err) {
        setMensagem("Falha na comunicação com a API.");
      }
    }
  };

  return (
  <div className="container py-3">

    <div
      className="card shadow-sm p-4 mb-4 border-0"
      style={{ backgroundColor: "#f8f9fa", borderRadius: "12px" }}
    >
      <h3 className="h5 fw-bold text-success mb-3">
        {idEdicao ? `Editar Pesagem (Registro Nº ${idEdicao})` : "Registro de Pesagens"}
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
              step="0.01" // vai incrementando de 0.01 ao clicar na setinha
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
            <button type="submit" className="btn btn-success px-4 me-2">
              {idEdicao ? "Salvar Alterações" : "Registrar Pesagem"}
            </button>

            {idEdicao && (
              <button
                type="button"
                className="btn btn-outline-secondary px-3"
                onClick={handleCancelarEdicao}
              >
                Cancelar Edição
              </button>
            )}
          </div>
        </div>
      </form>
    </div>

    {/* Tabela */}
    <div className="mt-4">
      <h3 className="h5 fw-bold text-success mb-3">Histórico Geral de Pesagens</h3>
      <div className="table-responsive shadow-sm" style={{ borderRadius: "8px", overflow: "hidden" }}>
        <table className="table table-striped table-hover table-bordered align-middle text-center mb-0">
          <thead className="table-success">
            <tr>
              <th>ID</th>
              <th>Nº Brinco</th>
              <th>Peso (kg)</th>
              <th>Data</th>
              <th>Ações</th>
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
                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm me-2"
                      onClick={() => handleRemover(p.idPesagem)}
                    >
                      Remover
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleCarregarEdicao(p)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-muted py-3">
                  Nenhum registro de pesagem encontrado.
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

export default PesagensPrivado;