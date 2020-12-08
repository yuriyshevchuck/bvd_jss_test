import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { Image } from '@sitecore-jss/sitecore-jss-react';


function DroplistOrNavLink({child}) {
   if (child.children && child.children.length > 0) {
     return (
      <NavDropdown title={child.link.text} id="basic-nav-dropdown">
       {child.children.map((child) => (
         <NavDropdown.Item href={child.link.url}>{child.link.text}</NavDropdown.Item>
       ))}
      </NavDropdown>
     )
   }
  return <Nav.Link href={child.link.url}>{child.link.text}</Nav.Link>;
}

const Header = (props) => {
  // Query results in integrated GraphQL replace the normal `fields` data
  // i.e. with { data, }
    return (
      props.fields.data.item && (
        <Navbar bg="light" expand="lg">
          <Image
            field={props.fields.data.item.logo.jss}
            editable={false}
            imageParams={{ mw: 100, mh: 50 }}
            height="50"
            width="80"
            data-sample="other-attributes-pass-through"/>
          <Navbar.Brand href="#home">{props.fields.data.item.heading.value}</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {props.fields.data.item.children.map((child) => (
              <DroplistOrNavLink child={child} />
            ))}
          </Nav>
            <Form inline>
              <FormControl type="text" placeholder="Search" className="mr-sm-2" />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>
      )
  );
};

export default Header;