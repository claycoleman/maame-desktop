import React from 'react';
import { compose } from 'recompose';

import { PasswordForgetForm } from '../PasswordForgetPage';
import PasswordChangeForm from '../../components/PasswordChange';
import { withAuthentication, withOrganizationAuthorization } from '../../components/Session';
import BasePage from '..';

const AccountPageBase = ({ authUser }) =>
  BasePage(
    'Account Page',
    <>
      <p>Account: {authUser.email}</p>
      <hr />
      <h3>Reset Your Password</h3>
      <PasswordForgetForm />
      <hr />
      <h3>Change Your Password</h3>
      <PasswordChangeForm />
    </>,
  );

const AccountPage = compose(
  withOrganizationAuthorization,
  withAuthentication,
)(AccountPageBase);

export default AccountPage;
