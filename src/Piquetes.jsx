import { useState, useEffect } from "react";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const API = `${BASE_URL}/piquetes`;

function Piquetes() {
  const [rotulo, setRotulo] = useState("");
  const [lotacaoMaxima, setLotacaoMaxima] = useState("");
  const [piquetes, setPiquetes] = useState([]);
  const [mensagem, setMensagem] = useState("");

  // caso for null ta criando novo caso for um valor numeric tá editand
  const [idEdicao, setIdEdicao] = useState(null);

  const carregarPiquetes = async () => {
    try {
      const res = await fetch(API);
      const dados = await res.json();

      // so atualiza a list c realmente for um array
      if (Array.isArray(dados)) {
        setPiquetes(dados);
      } else {
        setPiquetes([]);
        setMensagem(dados.erro || dados.mensagem || "Erro ao carregar a lista de piquetes.");
      }
    } catch (err) {
      console.error("Erro ao buscar piquetes:", err);
      setPiquetes([]);
      setMensagem("Falha na conexão com a API.");
    }
  };

  useEffect(() => {
    carregarPiquetes();
  }, []);

  // preenche o formulário com os dados do piquete selecionado
  const handleCarregarEdicao = (piquete) => {
    setIdEdicao(piquete.idPiquete);
    setRotulo(piquete.rotulo);
    setLotacaoMaxima(piquete.lotacaoMaxima);
    setMensagem("");
  };

  // cancela a edição e limpa os campos
  const handleCancelarEdicao = () => {
    setIdEdicao(null);
    setRotulo("");
    setLotacaoMaxima("");
  };

  // salva, ve se é um post ou um put
  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!rotulo || !lotacaoMaxima) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    const url = idEdicao ? `${API}/${idEdicao}` : API;
    const metodo = idEdicao ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rotulo, lotacao_maxima: Number(lotacaoMaxima) }),
      });
      const data = await res.json();

      if (res.ok) {
        handleCancelarEdicao();
        setMensagem(data.mensagem);
        carregarPiquetes();
      } else {
        setMensagem(data.mensagem || data.erro || "Erro ao salvar piquete.");
      }
    } catch (err) {
      setMensagem("Falha na conexão com a API.");
    }
  };

  const handleRemover = async (id) => {
    if (window.confirm("Deseja excluir este piquete? Todos os animais vinculados também serão removidos.")) {
      try {
        const res = await fetch(`${API}/${id}`, { method: "DELETE" });
        const data = await res.json();

        if (res.ok) {
          setMensagem(data.mensagem || "Piquete removido com sucesso.");
          // Se estava editando o item removido, cancela a edição
          if (idEdicao === id) {
            handleCancelarEdicao();
          }
          carregarPiquetes();
        } else {
          setMensagem(data.mensagem || data.erro || "Erro ao remover piquete.");
        }
      } catch (err) {
        setMensagem("Falha ao comunicar com a API.");
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
          {idEdicao ? "Editar Piquete" : "Cadastrar Piquete"}
        </h3>

        {mensagem && (
          <div className="alert alert-info py-2 px-3 mb-3 small" role="alert">
            <strong>Aviso:</strong> {mensagem}
          </div>
        )}

        <form onSubmit={handleSalvar}>
          <div className="row g-3">
            <div className="col-12 col-md-7">
              <label className="form-label fw-semibold small">Nome da Área / Rótulo:</label>
              <input
                type="text"
                className="form-control bg-white"
                placeholder="Ex: Pasto Norte"
                value={rotulo}
                onChange={(e) => setRotulo(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-5">
              <label className="form-label fw-semibold small">Lotação Máxima (cabeças):</label>
              <input
                type="number"
                min="1"
                className="form-control bg-white"
                placeholder="Ex: 20"
                value={lotacaoMaxima}
                onChange={(e) => setLotacaoMaxima(e.target.value)}
              />
            </div>

            <div className="col-12 pt-2">
              <button type="submit" className="btn btn-success px-4 me-2">
                {idEdicao ? "Salvar Alterações" : "Cadastrar Piquete"}
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
        <h3 className="h5 fw-bold text-success mb-3">Lista de Piquetes</h3>
        <div className="table-responsive shadow-sm" style={{ borderRadius: "8px", overflow: "hidden" }}>
          <table className="table table-striped table-hover table-bordered align-middle text-center mb-0">
            <thead className="table-success">
              <tr>
                <th>ID</th>
                <th>Rótulo</th>
                <th>Capacidade Máxima</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {piquetes.length > 0 ? (
                piquetes.map((p) => (
                  <tr key={p.idPiquete}>
                    <td>{p.idPiquete}</td>
                    <td>{p.rotulo}</td>
                    <td>{p.lotacaoMaxima}</td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm me-2"
                        onClick={() => handleRemover(p.idPiquete)}
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
                  <td colSpan="4" className="text-muted py-3">
                    Nenhum piquete cadastrado.
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

export default Piquetes;