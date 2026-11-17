import { NavLink, Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { getUsuario, logout } from "./Autenticacao";

const MenuPrivado = () => {
  const usuario = getUsuario();

  return (
    <>
      <Navbar expand="lg" className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
        <Container>
          <NavLink className="navbar-brand fw-bold" to="/privado">
            Sys Gerência de Pesagens
          </NavLink>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavLink className="nav-link" to="/privado/pesagens">
                Pesagens
              </NavLink>
              <NavLink className="nav-link" to="/privado/piquetes">
                Piquetes
              </NavLink>
              <NavLink className="nav-link" to="/privado/bovinos">
                Bovinos
              </NavLink>
              <NavLink className="nav-link" to="/privado/sobre">
                Sobre
              </NavLink>
            </Nav>

            <Nav className="align-items-center">
              <NavLink className="nav-link text-white me-2" to="/privado/usuario">
                Usuário:{" "}
                <strong>
                  {usuario ? `${usuario.nome} (${usuario.tipo})` : "Não autenticado"}
                </strong>
              </NavLink>

              <NavLink
                className="btn btn-outline-light rounded-pill px-3 ms-2"
                to="/"
                onClick={() => logout()}
              >
                Logout
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="container mt-3">
        <Outlet />
      </div>
    </>
  );
};

export default MenuPrivado;