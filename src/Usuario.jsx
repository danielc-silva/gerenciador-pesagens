import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, gravaAutenticacao } from "./Autenticacao";
import withAuth from "./withAuth";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const Usuario = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipo, setTipo] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const res = await fetch(`${BASE_URL}/usuarios/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: getToken(),
          },
        });

        if (res.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        const dados = await res.json();
        if (res.ok) {
          setEmail(dados.email || "");
          setNome(dados.nome || "");
          setTelefone(dados.telefone || "");
          setTipo(dados.tipo || "U");
          setSenha(dados.senha || "");
        } else {
          setErro(dados.mensagem || "Erro ao carregar dados do usuário.");
        }
      } catch (err) {
        setErro("Falha ao comunicar com a API.");
      }
    };

    carregarPerfil();
  }, [navigate]);

  const handleSalvar = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");

    try {
      const res = await fetch(`${BASE_URL}/usuarios/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: getToken(),
        },
        body: JSON.stringify({ nome, telefone, senha }),
      });

      if (res.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      const data = await res.json();
      if (res.ok) {
        gravaAutenticacao({ auth: true, token: data.token });
        setMensagem(data.mensagem || "Seus dados foram atualizados com sucesso!");
      } else {
        setErro(data.mensagem || "Erro ao atualizar dados.");
      }
    } catch (err) {
      setErro("Erro na comunicação com o servidor.");
    }
  };

  return (
    <div className="container py-4 d-flex justify-content-center">
      <div
        className="card shadow-sm p-4 border-0 w-100"
        style={{ maxWidth: "520px", backgroundColor: "#f8f9fa", borderRadius: "12px" }}
      >
        <h3 className="h5 fw-bold text-success mb-3">Meus Dados de Acesso</h3>

        {mensagem && (
          <div className="alert alert-success py-2 px-3 small" role="alert">
            {mensagem}
          </div>
        )}

        {erro && (
          <div className="alert alert-danger py-2 px-3 small" role="alert">
            {erro}
          </div>
        )}

        <form onSubmit={handleSalvar}>
          <div className="mb-3">
            <label className="form-label fw-semibold small">E-mail (Identificador):</label>
            <input
              type="email"
              className="form-control bg-light"
              value={email}
              disabled
              readOnly
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small">Perfil de Acesso:</label>
            <input
              type="text"
              className="form-control bg-light"
              value={tipo === "A" ? "Administrador (A) — Permissão Total" : "Usuário Comum (U) — Sem permissão de exclusão"}
              disabled
              readOnly
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small">Nome Completo:</label>
            <input
              type="text"
              className="form-control bg-white"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              maxLength={50}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small">Telefone:</label>
            <input
              type="text"
              className="form-control bg-white"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              maxLength={14}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small">Senha:</label>
            <input
              type="text"
              className="form-control bg-white"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              maxLength={20}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100 py-2 fw-semibold">
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
};

export default withAuth(Usuario);