import React, { useContext } from 'react';
import BasePage from '..';
import FlowCustomizer from '../../components/FlowCustomizer';
import FlowVisitAssigner from '../../components/FlowVisitAssigner';

import './styles.css';

import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav';
import Col from 'react-bootstrap/Col';
import { CONTAINER_WIDTHS } from '../../constants/values';
import { useTopLevelOrganization } from '../../components/Firebase';
import AuthUserContext from '../../components/Session/context';
import { withTLOAdminAuthorization } from '../../components/Session';

const TABS = {
  BUILD_FLOWS: 'build',
  ASSIGN_FLOWS_TO_VISITS: 'assign',
};

const FlowCustomizerPage = () => {
  const authUser = useContext(AuthUserContext);

  const [_loading, topLevelOrganization] = useTopLevelOrganization(
    authUser ? authUser.topLevelOrganizationId : null,
  );

  return BasePage(
    'Flow Customizer',
    <>
      <Tab.Container defaultActiveKey={TABS.BUILD_FLOWS}>
        <Row id="flowCustomizer">
          <Col xs={12}>
            <Nav
              variant="pills"
              className="flex-row"
              style={{ justifyContent: 'center', marginBottom: 16 }}
            >
              <Nav.Item>
                <Nav.Link className="navLink" eventKey={TABS.BUILD_FLOWS}>
                  Build Flows
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link className="navLink" eventKey={TABS.ASSIGN_FLOWS_TO_VISITS}>
                  Assign Flows to Visits
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        <Tab.Content>
          <Tab.Pane eventKey={TABS.BUILD_FLOWS}>
            <FlowCustomizer topLevelOrganization={topLevelOrganization} />
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.ASSIGN_FLOWS_TO_VISITS}>
            <FlowVisitAssigner topLevelOrganization={topLevelOrganization} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>,
    { width: CONTAINER_WIDTHS.WIDE },
  );
};

export default withTLOAdminAuthorization(FlowCustomizerPage);
