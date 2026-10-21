import { useState, useEffect } from "react";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const API_BOVINOS = `${BASE_URL}/bovinos`;
const API_PIQUETES = `${BASE_URL}/piquetes`;

function Bovinos() {
  const [nascimento, setNascimento] = useState("");
  const [piqueteAlocado, setPiqueteAlocado] = useState("");
  const [bovinos, setBovinos] = useState([]);
  const [piquetes, setPiquetes] = useState([]);
  const [mensagem, setMensagem] = useState("");

  // caso for null novo cadastro no banco caso for um valor então é a edição de um cadastro no bd
  const [brincoEdicao, setBrincoEdicao] = useState(null);

  const carregarDados = async () => {
    try {
      // busca os bovinos que estao no bd
      const resBov = await fetch(API_BOVINOS);
      const dadosBov = await resBov.json();

      if (Array.isArray(dadosBov)) {
        setBovinos(dadosBov);
      } else {
        setBovinos([]);
        setMensagem(dadosBov.erro || dadosBov.mensagem || "Erro ao carregar a lista de bovinos.");
      }

      // busca os piquetes para selecão ao cadastrar bovinos
      const resPiq = await fetch(API_PIQUETES);
      const dadosPiq = await resPiq.json();

      if (Array.isArray(dadosPiq)) {
        setPiquetes(dadosPiq);
      } else {
        setPiquetes([]);
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setBovinos([]);
      setPiquetes([]);
      setMensagem("Falha na comunicação com o servidor.");
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // carrega os dados do bovino selecionado nos campos
  const handleCarregarEdicao = (bovino) => {
    setBrincoEdicao(bovino.numeroBrinco);
    setNascimento(bovino.nascimento ? bovino.nascimento.split("T")[0] : "");
    setPiqueteAlocado(bovino.piqueteAlocado);
    setMensagem("");
  };

  // cancela a ediçao e limpa os campos
  const handleCancelarEdicao = () => {
    setBrincoEdicao(null);
    setNascimento("");
    setPiqueteAlocado("");
  };

  // salva decidindo caso null novo cadastro no banco, caso seja um valor então é a edição de um cadastro no BD
  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!nascimento || !piqueteAlocado) {
      setMensagem("Preencha todos os campos do formulário.");
      return;
    }

    const url = brincoEdicao ? `${API_BOVINOS}/${brincoEdicao}` : API_BOVINOS;
    const metodo = brincoEdicao ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nascimento,
          piquete_alocado: Number(piqueteAlocado),
        }),
      });
      const data = await res.json();

      if (res.ok) {
        handleCancelarEdicao();
        setMensagem(data.mensagem || "Bovino salvo com sucesso!");
        carregarDados();
      } else {
        // exibe a mensagem caso por exemplo o piquete esteja com lotação maxima
        setMensagem(data.mensagem || data.erro || "Erro ao salvar animal.");
      }
    } catch (err) {
      setMensagem("Falha na comunicação com o servidor.");
    }
  };

  // faz a remocao de um bovino do bd
  const handleRemover = async (brinco) => {
    if (window.confirm(`Deseja remover o bovino brinco Nº ${brinco}? Todas as pesagens vinculadas também serão removidas.`)) {
      try {
        const res = await fetch(`${API_BOVINOS}/${brinco}`, { method: "DELETE" });
        const data = await res.json();

        if (res.ok) {
          setMensagem(data.mensagem || "Bovino removido com sucesso.");
          if (brincoEdicao === brinco) {
            handleCancelarEdicao();
          }
          carregarDados();
        } else {
          setMensagem(data.mensagem || data.erro || "Erro ao remover bovino.");
        }
      } catch (err) {
        setMensagem("Falha na comunicação com o servidor.");
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
          {brincoEdicao ? `Editar Bovino (Brinco Nº ${brincoEdicao})` : "Cadastrar Bovino"}
        </h3>

        {mensagem && (
          <div className="alert alert-info py-2 px-3 mb-3 small" role="alert">
            <strong>Aviso:</strong> {mensagem}
          </div>
        )}

        <form onSubmit={handleSalvar}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold small">Data de Nascimento:</label>
              <input
                type="date"
                className="form-control bg-white"
                value={nascimento}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setNascimento(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold small">Piquete Alocado (Pasto):</label>
              <select
                className="form-select bg-white"
                value={piqueteAlocado}
                onChange={(e) => setPiqueteAlocado(e.target.value)}
              >
                <option value="">Selecione o pasto...</option>
                {piquetes.map((p) => (
                  <option key={p.idPiquete} value={p.idPiquete}>
                    {p.rotulo} (Máx: {p.lotacaoMaxima})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 pt-2">
              <button type="submit" className="btn btn-success px-4 me-2">
                {brincoEdicao ? "Salvar Alterações" : "Cadastrar Bovino"}
              </button>

              {brincoEdicao && (
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
        <h3 className="h5 fw-bold text-success mb-3">Rebanho Cadastrado</h3>
        <div className="table-responsive shadow-sm" style={{ borderRadius: "8px", overflow: "hidden" }}>
          <table className="table table-striped table-hover table-bordered align-middle text-center mb-0">
            <thead className="table-success">
              <tr>
                <th>Nº Brinco (ID)</th>
                <th>Nascimento</th>
                <th>Piquete ID</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {bovinos.length > 0 ? (
                bovinos.map((b) => (
                  <tr key={b.numeroBrinco}>
                    <td>{b.numeroBrinco}</td>
                    <td>{b.nascimento ? b.nascimento.split("T")[0] : ""}</td>
                    <td>{b.piqueteAlocado}</td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm me-2"
                        onClick={() => handleRemover(b.numeroBrinco)}
                      >
                        Remover
                      </button>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleCarregarEdicao(b)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-muted py-3">
                    Nenhum animal cadastrado no rebanho.
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

export default Bovinos;