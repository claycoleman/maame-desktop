import React, { useState } from 'react';
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
TODO installs  
react-router-dom
firebase
recompose
react-transition-group
react-icons
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
          <hr />

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
