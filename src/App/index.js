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
import NoOrganizationPage from '../pages/NoOrganizationPage';
import DonationsPage from '../pages/DonationsPage';
import FlowBuilderPage from '../pages/FlowBuilderPage';

import { setupAuthentication } from '../components/Session';

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

          {/* PUBLIC PAGES */}
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route exact path={ROUTES.LOGIN} component={LoginPage} />
          <Route exact path={ROUTES.REGISTER} component={RegisterPage} />
          <Route exact path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
          <Route exact path={ROUTES.DONATIONS} component={DonationsPage} />

          {/* NO ORG PAGES */}
          <Route exact path={ROUTES.NO_ORGANIZATION} component={NoOrganizationPage} />

          {/* AUTHED PAGES */}
          <Route exact path={ROUTES.HOME} component={HomePage} />
          <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route exact path={ROUTES.FLOW_BUILDER} component={FlowBuilderPage} />

          {/* ADMIN PAGES */}
          <Route exact path={ROUTES.ADMIN} component={AdminPage} />

        </div>
      </Router>
    );
  }
}

export default setupAuthentication(App);
