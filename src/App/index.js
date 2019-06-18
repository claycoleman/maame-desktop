import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

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

// import DonationsPage from '../pages/DonationsPage';
// import AboutPage from '../pages/AboutPage';

import FlowCustomizerPage from '../pages/FlowCustomizerPage';
import ScreenBuilderPage from '../pages/ScreenBuilderPage';

import { setupAuthentication } from '../components/Session';
import LostPage from '../pages/LostPage';

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
          <Switch>
            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route exact path={ROUTES.LOGIN} component={LoginPage} />
            <Route exact path={ROUTES.REGISTER} component={RegisterPage} />
            <Route exact path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />

            {/* TODO maybe build donations <Route exact path={ROUTES.DONATIONS} component={DonationsPage} /> */}
            {/* TODO maybe build about ? <Route exact path={ROUTES.ABOUT} component={AboutPage} /> */}

            {/* NO ORG PAGES */}
            <Route exact path={ROUTES.NO_ORGANIZATION} component={NoOrganizationPage} />

            {/* AUTHED PAGES */}
            <Route exact path={ROUTES.HOME} component={HomePage} />
            <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />

            <Route exact path={ROUTES.FLOW_CUSTOMIZER} component={FlowCustomizerPage} />
            <Route exact path={ROUTES.SCREEN_BUILDER} component={ScreenBuilderPage} />

            {/* ADMIN PAGES */}
            <Route exact path={ROUTES.ADMIN} component={AdminPage} />

            <Route component={LostPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default setupAuthentication(App);
