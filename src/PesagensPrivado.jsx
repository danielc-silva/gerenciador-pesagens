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
    e.preventDefault();
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
    <div>
      <h2>{idEdicao ? `Editar Pesagem (Registro Nº ${idEdicao})` : "Registro de Pesagens (Administrativo)"}</h2>
      {mensagem && <p><strong>Aviso:</strong> {mensagem}</p>}

      <form onSubmit={handleSalvar}>
        <div>
          <label>Bovino (Nº Brinco): </label>
          <select
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
        <br />
        <div>
          <label>Peso (kg): </label>
          <input
            type="number"
            step="0.01"
            placeholder="Ex: 485.50"
            value={pesoKg}
            onChange={(e) => setPesoKg(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label>Data da Pesagem: </label>
          <input
            type="date"
            value={dataPesagem}
            onChange={(e) => setDataPesagem(e.target.value)}
          />
        </div>
        <br />
        <button type="submit">
          {idEdicao ? "Salvar Alterações" : "Registrar Pesagem"}
        </button>

        {idEdicao && (
          <button type="button" onClick={handleCancelarEdicao} style={{ marginLeft: "8px" }}>
            Cancelar Edição
          </button>
        )}
      </form>

      <hr />

      <h3>Histórico Geral de Pesagens</h3>
      <table border="1" cellPadding="6">
        <thead>
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
                  <button onClick={() => handleRemover(p.idPesagem)}>Remover</button>
                  <button onClick={() => handleCarregarEdicao(p)} style={{ marginLeft: "6px" }}>
                    Editar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Nenhum registro de pesagem encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PesagensPrivado;