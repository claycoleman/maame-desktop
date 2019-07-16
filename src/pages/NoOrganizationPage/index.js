import React, { useState, useContext } from 'react';
import { MdArrowForward } from 'react-icons/md';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import BasePage from '..';
import { withBasicAuthorization, AuthUserContext } from '../../components/Session';
import { FirebaseContext } from '../../components/Firebase';
import styles from '../LandingPage/LandingPage.module.css';
import IconModal, { ICON_STATES } from '../../components/IconModal';
import { MODAL_TIMEOUT_LENGTH } from '../../constants/values';
import * as ROUTES from '../../constants/routes';

// TODO on snapshot of the organizations, see if now an organization has them
const NoOrganizationPage = ({ history }) => {
  const authUser = useContext(AuthUserContext);
  const firebase = useContext(FirebaseContext);

  const [showModal, setShowModal] = useState(false);
  const [modalIcon, setModalIcon] = useState(null);
  const [modalText, setModalText] = useState(null);

  const handleModalFinished = () => {
    // we should hide the modal after it's done
    const wasSucccessful = modalIcon === ICON_STATES.SUCCESS;
    setShowModal(false);
    setTimeout(() => {
      if (wasSucccessful) {
        // redirect home
        history.push(ROUTES.HOME);
      }
    }, MODAL_TIMEOUT_LENGTH);
  };

  if (authUser.organizationId) {
    history.push(ROUTES.HOME);
  }

  return BasePage(
    'Waiting for Organization',
    <>
      <IconModal show={showModal} text={modalText} icon={modalIcon} onExit={handleModalFinished} />
      <p style={{ textAlign: 'left' }}>
        You're logged in, but your account isn't associated with a health organization yet. If your
        organization is already signed up with Maame, please have your organization leader approve
        your account by adding your email address <b>({authUser.email}) </b>
        to your organization user list, and then try refreshing below.
      </p>
      <p style={{ textAlign: 'left' }}>
        If you haven't signed up your organization with Maame, reach out to{' '}
        <a target="_blank" rel="noopener noreferrer" href="mailto:aob.maame@gmail.com">
          aob.maame@gmail.com
        </a>{' '}
        and the Maame team will contact you shortly about getting your organization set up with the
        Maame tools and services.
      </p>
      <div className={styles.flexRow}>
        <a
          className={styles.button}
          href="#refreshOrganizationStatus"
          onClick={event => {
            event.preventDefault();

            setShowModal(true);
            setModalIcon(ICON_STATES.LOADING);
            setModalText('Loading...');

            firebase
              .user(authUser.uid)
              .get()
              .then(snapshot => {
                const dbUser = snapshot.data();
                if (dbUser && dbUser.organizationId) {
                  setModalIcon(ICON_STATES.SUCCESS);
                  setModalText('Logged in!');
                } else {
                  setModalIcon(ICON_STATES.ERROR);
                  setModalText('No organization yet!');
                }
              })
              .catch(error => {
                this.setState({ error, modalText: 'Uh oh...', modalIcon: ICON_STATES.ERROR });
              });
          }}
        >
          Refresh Organization Status
          <MdArrowForward className={styles.icon} color="white" size={20} />
        </a>
      </div>
    </>,
  );
};

export default compose(
  withBasicAuthorization,
  withRouter,
)(NoOrganizationPage);
