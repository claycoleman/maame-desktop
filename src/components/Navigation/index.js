import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import SignOutButton from '../SignOut';
import { withAuthentication } from '../Session';

const Navigation = ({ authUser }) => (
  <div>{authUser ? <NavigationAuth isAdmin={authUser.isAdmin} /> : <NavigationNonAuth />}</div>
);

const NavigationAuth = ({ isAdmin }) => (
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.HOME}>Home</Link>
    </li>
    <li>
      <Link to={ROUTES.ACCOUNT}>Account</Link>
    </li>
    {isAdmin && (
      <li>
        <Link to={ROUTES.ADMIN}>Admin</Link>
      </li>
    )}
    <li>
      <SignOutButton />
    </li>
  </ul>
);

const NavigationNonAuth = () => {
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.LOGIN}>Sign In</Link>
    </li>
  </ul>;
};

export default withAuthentication(Navigation);
