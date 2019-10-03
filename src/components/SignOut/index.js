import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import styles from '../Navigation/Navigation.module.css';
import IconModal, { ICON_STATES } from '../IconModal';
import { MODAL_TIMEOUT_LENGTH } from '../../constants/values';
import { compose } from 'recompose';

import * as ROUTES from '../../constants/routes';

const _SignOutButton = ({ firebase, history }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const exitFunction = () => {
    setShowModal(false);
    setTimeout(() => {
      history.push(ROUTES.LANDING);
      dispatch({ type: 'RESET_STORE' });
      firebase.doSignOut();
    }, MODAL_TIMEOUT_LENGTH);
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
const SignOutButton = compose(
  withFirebase,
  withRouter,
)(_SignOutButton);

export default SignOutButton;
