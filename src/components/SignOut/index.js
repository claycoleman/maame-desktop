import React from 'react';

import { withFirebase } from '../Firebase';

const _SignOutButton = ({ firebase }) => (
  <button type="button" onClick={firebase.doSignOut}>
    Sign Out
  </button>
);

const SignOutButton = withFirebase(_SignOutButton);

export default SignOutButton;
