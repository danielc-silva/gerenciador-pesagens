const Sobre = () => {
  return (
    <div className="container py-3">
      <h2 className="text-success fw-bold mb-2">
        Trabalho Prático 1 — Programação para a Web
      </h2>
      <p className="text-muted">
        Sistema voltado ao gerenciamento e controle ponderal de bovinos em fazendas.
      </p>

      <hr />

      <h3 className="h5 fw-bold text-success mt-3">Sobre o Sistema</h3>
      <p>
        O sistema possui uma área aberta para registro rápido de pesagens no campo e uma área administrativa restrita, acessada via login, que permite o controle total (CRUD) sobre piquetes, bovinos e pesagens.
      </p>

      <h3 className="h5 fw-bold text-success mt-4">Informações Acadêmicas</h3>
      <ul className="list-unstyled">
        <li><strong>Instituição:</strong> IFSUL — Campus Passo Fundo</li>
        <li><strong>Curso:</strong> Bacharelado em Ciência da Computação</li>
        <li><strong>Disciplina:</strong> Programação para a Web</li>
        <li><strong>Professora:</strong> Jéssica Di Domênico</li>
        <li><strong>Aluno:</strong> Daniel Cipriano da Silva</li>
      </ul>
    </div>
  );
};

export default Sobre;