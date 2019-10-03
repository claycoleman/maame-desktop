import React, { Component } from 'react';

import { compose } from 'recompose';
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
import ManageOrganizationsPage from '../pages/ManageOrganizationsPage';
import ManageUsersPage from '../pages/ManageUsersPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import { setupFirebase } from '../components/Firebase';
import { setupStore } from '../components/Store';

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

            {/* COMMUNITY PAGES */}
            <Route exact path={ROUTES.ANALYTICS} component={AnalyticsPage} />

            {/* SUB DISTRICT PAGES */}
            <Route exact path={ROUTES.MANAGE_USERS} component={ManageUsersPage} />

            {/* DISTRICT PAGES */}
            <Route exact path={ROUTES.MANAGE_ORGANIZATIONS} component={ManageOrganizationsPage} />
            <Route exact path={ROUTES.FLOW_CUSTOMIZER} component={FlowCustomizerPage} />
            <Route exact path={ROUTES.SCREEN_BUILDER} component={ScreenBuilderPage} />

            {/* ADMIN PAGES */}
            <Route exact path={ROUTES.ADMIN} component={AdminPage} />

            <Route exact path={ROUTES.LOST} component={LostPage} />
            <Route component={LostPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default compose(
  setupFirebase,
  setupAuthentication,
  setupStore,
)(App);
