import { NavLink, Outlet } from "react-router";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const MenuPublico = () => {
    return (
        <>
            <Navbar expand="lg" className="navbar navbar-expand-lg navbar-dark bg-success">
                <Container>
                    <NavLink className="navbar-brand" exact="true" to="/">Sys Gerência de Pesagens</NavLink>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavLink className="nav-link active" exact="true" to="/pesagenspublico">Pesagens</NavLink>
                            <NavLink className="nav-link active" exact="true" to="/sobre">Sobre</NavLink>
                             <NavLink className="btn btn-outline-light rounded-pill px-3 ms-2" exact="true" to="/login">Login</NavLink>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
             <div className="container mt-3">
                <Outlet />
            </div>
        </>
    )
}

export default MenuPublico;