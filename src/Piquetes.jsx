import { useState, useEffect } from "react";

const API = "http://localhost:3001/piquetes";

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
    <div>
      <h2>{idEdicao ? "Editar Piquete" : "Cadastrar Piquete"}</h2>
      {mensagem && <p><strong>Aviso:</strong> {mensagem}</p>}

      <form onSubmit={handleSalvar}>
        <div>
          <label>Nome da Área: </label>
          <input
            type="text"
            placeholder="Ex: Pasto Norte"
            value={rotulo}
            onChange={(e) => setRotulo(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label>Lotação Máxima (cabeças): </label>
          <input
            type="number"
            placeholder="Ex: 20"
            value={lotacaoMaxima}
            onChange={(e) => setLotacaoMaxima(e.target.value)}
          />
        </div>
        <br />
        <button type="submit">
          {idEdicao ? "Salvar Alterações" : "Cadastrar Piquete"}
        </button>

        {idEdicao && (
          <button type="button" onClick={handleCancelarEdicao} style={{ marginLeft: "8px" }}>
            Cancelar Edição
          </button>
        )}
      </form>

      <hr />

      <h3>Lista de Piquetes</h3>
      <table border="1" cellPadding="6">
        <thead>
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
                  <button onClick={() => handleRemover(p.idPiquete)}>
                    Remover
                  </button>
                  <button onClick={() => handleCarregarEdicao(p)} style={{ marginLeft: "6px" }}>
                    Editar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Nenhum piquete cadastrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Piquetes;