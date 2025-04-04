import  Navbar  from "react-bootstrap/Navbar";
import  Nav  from "react-bootstrap/Nav";
import  Container  from "react-bootstrap/Container";
import { Link } from "react-router-dom";

import "./Header.css";


const Header = () => {
  return (
    <Navbar bg="primary" variant="dark">
    <Container>
        <Navbar.Brand to="/"><strong>Employee Web</strong></Navbar.Brand>
        <Nav className="me-auto">
            <Nav.Link as = {Link} to="/" className="nav-link">Employees</Nav.Link>
            <Nav.Link as = {Link} to="/employee" className="nav-link">Add Employee</Nav.Link>
            
            
            </Nav>

    </Container>
    </Navbar>
  )
}

export default Header;