import React from 'react';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import * as ROUTES from '../../constants/routes';
import SignOutButton from '../SignOut';
import { withAuthentication } from '../Session';

import styles from './Navigation.module.css';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const Navigation = ({ authUser }) => {
  return (
    <div style={{ width: '100vw', backgroundColor: '#F8F9FA' }}>
      <Navbar bg="light" expand="sm" className={styles.navbar}>
        <Navbar.Brand className={styles.navBrand}>
          <Link
            style={{
              color: 'white',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontFamily: 'Open Sans',
              textTransform: 'uppercase',
            }}
            href={ROUTES.LANDING}
            to={ROUTES.LANDING}
            active={window.location.pathname === ROUTES.LANDING}
          >
            Maame
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ marginRight: 12 }} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {renderNavigationForAuthStatus(authUser)}
            {/* <div style={{ marginRight: 24 }} />  */}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

const renderNavigationForAuthStatus = authUser => {
  // OFFLINE TESTING
  // return <NavigationAuth isAdmin={false} />;
  if (!authUser) {
    return <NavigationNoAuth />;
  } else if (!authUser.organizationId) {
    return <NavigationNoOrg />;
  } else {
    return <NavigationAuth isAdmin={authUser.isTLOAdmin} />;
  }
};

const NavigationAuth = ({ isAdmin }) => (
  <>
    <CustomNavLink route={ROUTES.HOME} text={'Dashboard'} />
    {isAdmin && <CustomNavLink route={ROUTES.ACCOUNT} text={'Account'} />}
    {/* {isAdmin && <CustomNavLink route={ROUTES.ADMIN} text={'Admin'} />} */}
    <SignOutButton />
  </>
);

const NavigationNoOrg = () => (
  <>
    <CustomNavLink route={ROUTES.NO_ORGANIZATION} text={'No Organization'} />
    <CustomNavLink route={ROUTES.ACCOUNT} text={'Account'} />
    <SignOutButton />
  </>
);

const NavigationNoAuth = () => (
  <>
    <CustomNavLink route={ROUTES.LANDING} text={'Home'} />
    {/* <CustomNavLink route={ROUTES.ABOUT} text={'About'} /> */}
    {/* <CustomNavLink route={ROUTES.DONATIONS} text={'Donate'} /> */}
    <CustomNavLink route={ROUTES.LOGIN} text={'Sign In'} />
  </>
);

const CustomNavLink = ({ route, text }) => (
  <LinkContainer
    exact
    to={route}
    active={window.location.pathname === route}
    className={styles.navLink}
    activeStyle={{
      backgroundColor: 'rgba(204, 0, 0, 0.2)',
      color: 'black',
    }}
  >
    <Nav.Item>{text}</Nav.Item>
  </LinkContainer>
);

export default withAuthentication(Navigation);
