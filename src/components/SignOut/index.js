import React, { useState } from 'react';

import { withFirebase } from '../Firebase';
import styles from '../Navigation/Navigation.module.css';
import IconModal, { ICON_STATES } from '../IconModal';
import { MODAL_TIMEOUT_LENGTH } from '../../constants/values';

const _SignOutButton = ({ firebase }) => {
  const [showModal, setShowModal] = useState(false)
  const exitFunction = () => {
    setShowModal(false);
    setTimeout(firebase.doSignOut, MODAL_TIMEOUT_LENGTH);
  };
  return (
    <>
      <IconModal
        show={showModal}
        text={'Signed out!'}
        icon={ICON_STATES.SUCCESS}
        onExit={exitFunction}
      />
      <div
        className={styles.navLink}
        onClick={() => {
          if (!showModal) {
            setShowModal(true);
          }
        }}
      >
        Sign Out
      </div>
    </>
  );
};

// so VS Code can auto import
const SignOutButton = withFirebase(_SignOutButton);

export default SignOutButton;
