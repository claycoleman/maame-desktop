import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { withOrganizationAuthorization, AuthUserContext } from '../../components/Session';
import BasePage from '..';
import RefreshDataButtons from '../../components/RefreshDataButtons';

import * as ROUTES from '../../constants/routes';

import styles from './HomePage.module.css';

const HomePage = () => {
  // OFFLINE TESTING
  // const authUser = useContext(AuthUserContext) || { isTLOAdmin: true };
  const authUser = useContext(AuthUserContext);
  let bodyLinks;

  if (authUser.isTLOAdmin) {
    // district level
    bodyLinks = [
      { text: 'Manage sub-districts and communities', to: ROUTES.MANAGE_ORGANIZATIONS },
      {
        text: 'View district, sub-district, and community analytics',
        to: ROUTES.ANALYTICS,
      },
      {
        text: 'View recent usage',
        to: ROUTES.RECENT_USAGE,
      },
    ];
  } else if (authUser.isOrgAdmin) {
    // sub district level
    bodyLinks = [
      { text: 'Manage communities', to: ROUTES.MANAGE_USERS_BASE },
      {
        text: 'View sub-district and community analytics',
        to: ROUTES.ANALYTICS,
      },
      {
        text: 'View recent usage',
        to: ROUTES.RECENT_USAGE,
      },
    ];
  } else {
    // community level
    bodyLinks = [
      {
        text: 'View community analytics',
        to: ROUTES.ANALYTICS,
      },
    ];
  }

  return BasePage(
    'Dashboard',
    <>
      <div className={styles.sections}>
        {bodyLinks.map((linkItem) => (
          <Link
            key={linkItem.to}
            className={[styles.sectionLink, styles.large].join(' ')}
            to={linkItem.to}
          >
            {linkItem.text}
          </Link>
        ))}
      </div>
      {/* <RefreshDataButtons /> */}

      {/* <div>
        <p>A bunch of text and other info</p>
      </div>
      <h3>Customize your guided visit flows</h3>
      <ButtonLinks
        button={{ text: 'Take me there', to: ROUTES.FLOW_CUSTOMIZER }}
        style={{ justifyContent: 'center' }}
      /> */}
    </>,
  );
};

export default withOrganizationAuthorization(HomePage);
