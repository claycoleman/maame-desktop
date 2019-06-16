import React from 'react';

import { withFirebase } from '../Firebase';
import styles from '../Navigation/Navigation.module.css'

const _SignOutButton = ({ firebase }) => (
  <div className={styles.navLink} onClick={firebase.doSignOut}>
    Sign Out
  </div>
);

// so VS Code can auto import
const SignOutButton = withFirebase(_SignOutButton);

export default SignOutButton;
