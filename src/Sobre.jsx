const Sobre = () => {
    return (
        <>
            <h1>Trabalho Prático 1 — Programação para a Web</h1>
            <p>
                Este trabalho propõe um sistema de gerenciamento de pesagens de bovinos em fazendas.
            </p>

            <h2>Sobre o Sistema</h2>
            <p>
                O sistema conta com uma área aberta para cadastro de pesagens, onde qualquer usuário da fazenda pode registrar aferições de peso para os animais previamente cadastrados.
            </p>
            <p>
                O sistema também possui autenticação de usuário. Ao realizar o login, o usuário tem acesso a um painel administrativo completo, podendo cadastrar novos piquetes, registrar novos animais e gerenciar pesagens, com controle e operações completas de inclusão, alteração e exclusão (CRUD) sobre todas as tabelas.
            </p>

            <h2>Informações Acadêmicas</h2>
            <ul>
                <li><strong>Instituição:</strong> Instituto Federal Sul-rio-grandense (IFSUL) — Campus Passo Fundo</li>
                <li><strong>Curso:</strong> Bacharelado em Ciência da Computação</li>
                <li><strong>Disciplina:</strong> Programação para a Web</li>
                <li><strong>Professora:</strong> Jéssica Di Domênico</li>
                <li><strong>Aluno:</strong> Daniel Cipriano da Silva</li>
            </ul>
        </>
    )
}

export default Sobre;