import { NavLink, Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

const MenuPublico = () => {
  return (
    <>
      <Navbar expand="lg" className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
        <Container>
          <NavLink className="navbar-brand fw-bold" to="/">
            Sys Gerência de Pesagens
          </NavLink>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavLink className="nav-link" to="/">
                Início
              </NavLink>
              <NavLink className="nav-link" to="/sobre">
                Sobre
              </NavLink>
            </Nav>
            <Nav>
              <NavLink className="btn btn-outline-light rounded-pill px-3 ms-2" to="/login">
                Login
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

export default MenuPublico;