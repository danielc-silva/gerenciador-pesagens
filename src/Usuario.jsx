import withAuth from "./withAuth";

const Usuario = () => {
  return (
    <div className="container py-4">
      <h2 className="text-success fw-bold mb-3">Dados do Usuário</h2>
      <p>
        <strong>Nome do usuário:</strong> {localStorage.getItem("usuario")}
      </p>
    </div>
  );
};

export default withAuth(Usuario);