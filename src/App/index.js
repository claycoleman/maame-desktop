import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../components/Navigation';
import LandingPage from '../pages/LandingPage';

import * as ROUTES from '../constants/routes';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import PasswordForgetPage from '../pages/PasswordForgetPage';
import HomePage from '../pages/HomePage';
import AccountPage from '../pages/AccountPage';
import AdminPage from '../pages/AdminPage';
import { setupAuthentication } from '../components/Session';

/*
SETUP TODO => all SETUP TODOs should be completed and removed after copying
*/

class App extends Component {
  constructor(props) {
    super(props);

    // global state can be here
    this.state = {};
  }

  render() {
    return (
      <Router>
        <div>
          <Navigation />

          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route exact path={ROUTES.LOGIN} component={LoginPage} />
          <Route exact path={ROUTES.REGISTER} component={RegisterPage} />
          <Route exact path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />

          <Route exact path={ROUTES.HOME} component={HomePage} />
          <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route exact path={ROUTES.ADMIN} component={AdminPage} />
        </div>
      </Router>
    );
  }
}

export default setupAuthentication(App);
