const BemVindo = () => {
  return (
    <div className="container py-4">
      <h2 className="text-success fw-bold mb-3">
        Gerenciador de Pesagens de Bovinos
      </h2>

      <p className="text-muted">
        Desenvolvido para simplificar o manejo na fazenda, o Gerenciador de Pesagens opera em dois níveis de acesso:
      </p>

      <p>
        <strong>Lida de campo:</strong> os funcionários têm acesso rápido para registrar a pesagem de cada animal na balança de forma simples e sem burocracia.
      </p>

      <p>
        <strong>Painel administrativo:</strong> o proprietário conta com ferramentas completas de governança para gerenciar o histórico de pesagens, cadastrar e alocar o rebanho e controlar a capacidade de cada piquete.
      </p>
    </div>
  );
};

export default BemVindo;