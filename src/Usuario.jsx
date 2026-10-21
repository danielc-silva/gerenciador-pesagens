import withAuth from "./withAuth";
const Usuario = () => {
    return (
        <>
            <h1>Dados do usuário</h1>
            <p><b>Nome do usuário:</b> {localStorage.getItem("usuario")}</p>
        </>
    )
}

export default withAuth(Usuario);