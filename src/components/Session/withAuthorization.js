import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

export const basicAuthCondition = authUser => !!authUser;
export const organizationAuthCondition = authUser =>
  basicAuthCondition(authUser) && !!authUser.organizationId;
export const adminAuthCondition = authUser =>
  organizationAuthCondition(authUser) && authUser.isAdmin;

const withAuthorization = (condition, fallbackRoute = ROUTES.LOGIN) => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      // onAuthStateChanged should fire immediately after this method is called,
      // which prevents people from staying on this page from an unauthed browser
      // and also new navigations there
      this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
          console.log(authUser);
          if (!condition(authUser)) {
            this.props.history.push(fallbackRoute);
          }
        },
        () => {
          if (!condition(null)) {
            this.props.history.push(fallbackRoute);
          }
        },
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      // use consumer to prevent page from loading even briefly before we go
      return (
        <AuthUserContext.Consumer>
          {authUser => (condition(authUser) ? <Component {...this.props} /> : null)}
        </AuthUserContext.Consumer>
      );
    }
  }

  return compose(
    withRouter,
    withFirebase,
  )(WithAuthorization);
};

export const withBasicAuthorization = Component => withAuthorization(basicAuthCondition)(Component);
export const withOrganizationAuthorization = Component =>
  withAuthorization(organizationAuthCondition, ROUTES.NO_ORGANIZATION)(Component);
export const withAdminAuthorization = Component =>
  withAuthorization(adminAuthCondition, ROUTES.LOST)(Component); // TODO improve this, should probably redirect to a "no permissions page"

export default withAuthorization;
