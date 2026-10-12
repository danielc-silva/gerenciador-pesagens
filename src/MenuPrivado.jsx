import { NavLink, Outlet } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const MenuPrivado = () => {
    return (
        <>
            <Navbar expand="lg" className="navbar navbar-expand-lg navbar-dark bg-secondary">
                <Container>
                    <NavLink className="navbar-brand" to="/privado">
                        Sys Gerência de Pesagens
                    </NavLink>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavLink className="nav-link" to="/privado/pesagensprivado">Pesagens</NavLink>
                            <NavLink className="nav-link" to="/privado/piquetes">Piquetes</NavLink>
                            <NavLink className="nav-link" to="/privado/bovinos">Bovinos</NavLink>
                            <NavLink className="nav-link" to="/privado/sobre">Sobre</NavLink>
                            <NavLink className="nav-link" to="/privado/usuario">
                                Usuário: {localStorage.getItem("usuario")}
                            </NavLink>
                            <NavLink className="nav-link" to="/privado/login">Logout</NavLink>
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