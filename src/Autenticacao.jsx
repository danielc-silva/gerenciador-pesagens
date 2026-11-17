import { jwtDecode } from "jwt-decode";

const NOMEAPP = "gerenciadorpesagens";

export const getToken = () => {
  const localStorageAutenticacao = localStorage.getItem(NOMEAPP + "/autenticacao");
  const autenticacao = localStorageAutenticacao
    ? JSON.parse(localStorageAutenticacao)
    : null;

  if (autenticacao === null || autenticacao.auth === false || !autenticacao.token) {
    return null;
  }

  try {
    let decoded = jwtDecode(autenticacao.token);
    if (decoded.exp <= Math.floor(new Date() / 1000)) {
      console.log("Token expirado");
      logout();
      return null;
    } else {
      return autenticacao.token;
    }
  } catch (err) {
    logout();
    return null;
  }
};

export const getUsuario = () => {
  const localStorageAutenticacao = localStorage.getItem(NOMEAPP + "/autenticacao");
  const autenticacao = localStorageAutenticacao
    ? JSON.parse(localStorageAutenticacao)
    : null;

  if (autenticacao === null || autenticacao.auth === false || !autenticacao.token) {
    return null;
  }

  try {
    let decoded = jwtDecode(autenticacao.token);
    if (decoded.exp <= Math.floor(new Date() / 1000)) {
      console.log("Token expirado");
      logout();
      return null;
    } else {
      return decoded.usuario;
    }
  } catch (err) {
    logout();
    return null;
  }
};

export const gravaAutenticacao = (json) => {
  localStorage.setItem(NOMEAPP + "/autenticacao", JSON.stringify(json));
};

export const logout = () => {
  localStorage.setItem(
    NOMEAPP + "/autenticacao",
    JSON.stringify({ auth: false, token: "" })
  );
};