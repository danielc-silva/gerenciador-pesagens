import { useState, useEffect } from "react";

const API_PESAGENS = "http://localhost:3001/pesagens";
const API_BOVINOS = "http://localhost:3001/bovinos";

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
    <div>
      <h2>Registro de Pesagens (Área de Campo)</h2>
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
        <button type="submit">Registrar Pesagem</button>
      </form>

      <hr />

      <h3>Histórico de Pesagens</h3>
      <table border="1" cellPadding="6">
        <thead>
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
              <td colSpan="4">Nenhuma pesagem cadastrada no momento.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PesagensPublico;