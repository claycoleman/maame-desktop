import React from 'react';
import { Link } from 'react-router-dom';
import { withOrganizationAuthorization } from '../../components/Session';
import landingStyles from '../LandingPage/LandingPage.module.css';
import BasePage from '..';
import { MdArrowForward } from 'react-icons/md';

import * as ROUTES from '../../constants/routes';


const HomePage = () =>
  BasePage(
    'Dashboard',
    <>
      <h3>TODO Mimic the app's dashboard page</h3>
      <div>
        <p>A bunch of text and other info</p>
      </div>
      <h3>Customize your guided visit flows</h3>
      <div className={landingStyles.buttonsContainer} style={{ justifyContent: 'center' }}>
        <Link
          className={landingStyles.button}
          to={ROUTES.FLOW_CUSTOMIZER}
        >
          Take me there
          <MdArrowForward className={landingStyles.icon} color="white" size={20} />
        </Link>
      </div>
    </>,
  );

export default withOrganizationAuthorization(HomePage);
