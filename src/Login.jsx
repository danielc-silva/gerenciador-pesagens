import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { gravaAutenticacao, getToken } from "./Autenticacao";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

function Login() {
  // alterna entre tela de login false e cadastro de novo user true
  const [modoCadastro, setModoCadastro] = useState(false);

  // campos do formulário
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipo, setTipo] = useState("U");

  const [alerta, setAlerta] = useState({ status: "", message: "" });
  const [autenticado, setAutenticado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token != null) {
      setAutenticado(true);
    }
  }, []);

  const acaoLogin = async (e) => {
    e.preventDefault();
    try {
      setCarregando(true);
      setAlerta({ status: "", message: "" });

      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const json = await response.json();

      if (json.auth === false || !response.ok) {
        setAlerta({ status: "error", message: json.message || "Falha no login." });
      } else if (json.auth === true) {
        gravaAutenticacao(json);
        setAutenticado(true);
      }
    } catch (err) {
      setAlerta({ status: "error", message: "Erro de comunicação com a API." });
    } finally {
      setCarregando(false);
    }
  };

  const acaoCadastrar = async (e) => {
    e.preventDefault();
    try {
      setCarregando(true);
      setAlerta({ status: "", message: "" });

      const response = await fetch(`${BASE_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha, nome, telefone, tipo }),
      });

      const json = await response.json();

      if (!response.ok) {
        setAlerta({ status: "error", message: json.mensagem || "Erro ao criar conta." });
      } else {
        setAlerta({
          status: "success",
          message: "Conta criada com sucesso! Agora faça o seu login.",
        });
        setModoCadastro(false);
        setSenha("");
      }
    } catch (err) {
      setAlerta({ status: "error", message: "Erro ao conectar com o servidor." });
    } finally {
      setCarregando(false);
    }
  };

  if (autenticado === true) {
    return <Navigate to="/privado" />;
  }

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div
        className="card shadow-sm p-4 border-0 w-100"
        style={{ maxWidth: "460px", backgroundColor: "#f8f9fa", borderRadius: "12px" }}
      >
        <div className="text-center mb-3">
          <h3 className="h4 fw-bold text-success">
            {modoCadastro ? "Criar Nova Conta" : "Login de Usuário"}
          </h3>
          <p className="text-muted small">Gerenciador de Pesagens Bovinas</p>
        </div>

        {alerta.message && (
          <div
            className={`alert ${
              alerta.status === "error" ? "alert-danger" : "alert-success"
            } py-2 px-3 small`}
            role="alert"
          >
            {alerta.message}
          </div>
        )}

        {!modoCadastro ? (
          <form onSubmit={acaoLogin}>
            <div className="mb-3">
              <label className="form-label fw-semibold small">E-mail:</label>
              <input
                type="email"
                className="form-control bg-white"
                placeholder="Ex: admin@fazenda.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={50}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small">Senha:</label>
              <input
                type="password"
                className="form-control bg-white"
                placeholder="Informe sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                maxLength={20}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 py-2 fw-semibold mb-3"
              disabled={carregando}
            >
              {carregando ? "Autenticando..." : "Efetuar Login"}
            </button>

            <div className="text-center">
              <button
                type="button"
                className="btn btn-link text-success text-decoration-none small"
                onClick={() => {
                  setModoCadastro(true);
                  setAlerta({ status: "", message: "" });
                }}
              >
                Não possui conta? Cadastre-se aqui
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={acaoCadastrar}>
            <div className="mb-3">
              <label className="form-label fw-semibold small">Nome Completo:</label>
              <input
                type="text"
                className="form-control bg-white"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                maxLength={50}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small">E-mail (será seu login):</label>
              <input
                type="email"
                className="form-control bg-white"
                placeholder="seuemail@dominio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={50}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small">Telefone:</label>
              <input
                type="text"
                className="form-control bg-white"
                placeholder="(54)99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                maxLength={14}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small">Tipo de Usuário:</label>
              <select
                className="form-select bg-white"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="U">Usuário Comum / Operador (U)</option>
                <option value="A">Administrador (A)</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small">Senha:</label>
              <input
                type="password"
                className="form-control bg-white"
                placeholder="Máximo 20 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                maxLength={20}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 py-2 fw-semibold mb-3"
              disabled={carregando}
            >
              {carregando ? "Cadastrando..." : "Criar Conta"}
            </button>

            <div className="text-center">
              <button
                type="button"
                className="btn btn-link text-secondary text-decoration-none small"
                onClick={() => {
                  setModoCadastro(false);
                  setAlerta({ status: "", message: "" });
                }}
              >
                Já tenho conta — Voltar para o Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;