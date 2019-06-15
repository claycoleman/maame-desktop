import React from 'react';
import { compose } from 'recompose';

import { PasswordForgetForm } from '../PasswordForgetPage';
import PasswordChangeForm from '../../components/PasswordChange';
import { withAuthentication, withBasicAuthorization } from '../../components/Session';

const AccountPageBase = ({ authUser }) => (
  <div>
    <h1>Account Page</h1>
    <h2>Account: {authUser.email}</h2>
    <PasswordForgetForm />
    <PasswordChangeForm />
  </div>
);

const AccountPage = compose(
  withBasicAuthorization,
  withAuthentication,
)(AccountPageBase);

export default AccountPage;
