import React from 'react';
import { Text } from '@sitecore-jss/sitecore-jss-react';
import {Tab,Row,Nav,Col} from "react-bootstrap";


const MyTabs = (props) => (

  <Tab.Container id="left-tabs-example" defaultActiveKey="first">
    <Row>
      <Col sm={3}>
        <Nav variant="pills" className="flex-column">
          <Nav.Item>
            <Nav.Link eventKey="first">Tab 1</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="second">Tab 2</Nav.Link>
          </Nav.Item>
        </Nav>
      </Col>
      <Col sm={9}>
        <Tab.Content>
          <Tab.Pane eventKey="first">
            scssdcsdc
          </Tab.Pane>
          <Tab.Pane eventKey="second">
            dscscdsdc
          </Tab.Pane>
        </Tab.Content>
      </Col>
    </Row>
  </Tab.Container>

);

export default MyTabs;
