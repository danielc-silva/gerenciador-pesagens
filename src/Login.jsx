import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const isAuth = !!localStorage.getItem("usuario");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!usuario.trim()) {
      setErro("Por favor, informe seu nome de usuário.");
      return;
    }
    localStorage.setItem("usuario", usuario.trim());
    navigate("/privado");
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div
        className="card shadow-sm p-4 border-0 w-100"
        style={{ maxWidth: "420px", backgroundColor: "#f8f9fa", borderRadius: "12px" }}
      >
        {!isAuth ? (
          <>
            <div className="text-center mb-3">
              <h3 className="h4 fw-bold text-success">Acesso ao Sistema</h3>
              <p className="text-muted small">Gerenciamento de Pesagens e Rebanho</p>
            </div>

            {erro && (
              <div className="alert alert-danger py-2 px-3 small" role="alert">
                {erro}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">
                  Nome de Usuário:
                </label>
                <input
                  type="text"
                  className="form-control bg-white"
                  placeholder="Ex: operador01 ou admin"
                  value={usuario}
                  onChange={(e) => {
                    setUsuario(e.target.value);
                    if (erro) setErro("");
                  }}
                  autoFocus
                />
              </div>

              <button type="submit" className="btn btn-success w-100 py-2 fw-semibold">
                Entrar no Painel
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h4 className="h5 fw-bold text-success mb-2">Sessão Ativa</h4>
            <p className="text-muted small mb-3">
              Você está conectado como:{" "}
              <strong className="text-dark">{localStorage.getItem("usuario")}</strong>
            </p>

            <button
              type="button"
              className="btn btn-outline-danger w-100 py-2 fw-semibold"
              onClick={handleLogout}
            >
              Encerrar Sessão (Logout)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;