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
  console.log(authUser);
  return (
    <Navbar bg="light" expand="sm" className={styles.navbar}>
      <Navbar.Brand className={styles.navBrand}>
        <Link
          style={{ color: 'white', textDecoration: 'none' }}
          href={ROUTES.LANDING}
          to={ROUTES.LANDING}
          active={window.location.pathname === ROUTES.LANDING}
        >
          MAAME
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {authUser ? <NavigationAuth isAdmin={authUser.isAdmin} /> : <NavigationNonAuth />}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

const NavigationAuth = ({ isAdmin }) => (
  <>
    <CustomNavLink route={ROUTES.HOME} text={'Dashboard'} />
    <CustomNavLink route={ROUTES.ACCOUNT} text={'Account'} />
    {isAdmin && <CustomNavLink route={ROUTES.ADMIN} text={'Admin'} />}
    <SignOutButton />
  </>
);

const NavigationNonAuth = ({}) => (
  <>
    <CustomNavLink route={ROUTES.LANDING} text={'Home'} />
    <CustomNavLink route={ROUTES.ABOUT} text={'About'} />
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
