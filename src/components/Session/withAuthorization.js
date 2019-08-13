import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

export const basicAuthCondition = authUser => !!authUser;

// OFFLINE TESTING
// export const organizationAuthCondition = authUser =>
//   true || (basicAuthCondition(authUser) && !!authUser.organizationId);

// export const orgAdminAuthCondition = authUser =>
//   true || (organizationAuthCondition(authUser) && authUser.isOrgAdmin);

// export const tloAdminAuthCondition = authUser =>
//   true || (organizationAuthCondition(authUser) && authUser.isTLOAdmin);

export const organizationAuthCondition = authUser =>
  basicAuthCondition(authUser) && !!authUser.organizationId;

export const orgAdminAuthCondition = authUser =>
  tloAdminAuthCondition(authUser) || (organizationAuthCondition(authUser) && authUser.isOrgAdmin);

export const tloAdminAuthCondition = authUser =>
  organizationAuthCondition(authUser) && authUser.isTLOAdmin;

const withAuthorization = (condition, fallbackRoute = ROUTES.LOGIN) => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      // onAuthStateChanged should fire immediately after this method is called,
      // which prevents people from staying on this page from an unauthed browser
      // and also new navigations there
      this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
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

// community level auth
export const withOrganizationAuthorization = Component =>
  withAuthorization(organizationAuthCondition, ROUTES.NO_ORGANIZATION)(Component);

// sub district admin level auth
export const withOrgAdminAuthorization = Component =>
  withAuthorization(orgAdminAuthCondition, ROUTES.LOST)(Component); // TODO improve this, should probably redirect to a "no permissions page"

// district admin level auth
export const withTLOAdminAuthorization = Component =>
  withAuthorization(tloAdminAuthCondition, ROUTES.LOST)(Component); // TODO improve this, should probably redirect to a "no permissions page"

export default withAuthorization;
