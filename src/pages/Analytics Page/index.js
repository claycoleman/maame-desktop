import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthUserContext, withOrganizationAuthorization } from '../../components/Session';
import BasePage from '..';

import * as ROUTES from '../../constants/routes';
import OrganizationsManager from '../../components/OrganizationsManager';
import { useTopLevelOrganization } from '../../components/Firebase';
import ButtonLinks from '../../components/ButtonLinks';
import CommunityUsersManager from '../../components/CommunityUsersManager';
import { useOrganization } from '../../components/Firebase/hooks';

// import styles from './HomePage.module.css';

const AnalyticsPage = () => {
  // const authUser = useContext(AuthUserContext);
  // const [error, loading, topLevelOrganization] = useTopLevelOrganization(
  //   authUser ? authUser.topLevelOrganizationId : null,
  // );
  // const adminOrganizationId = topLevelOrganization
  //   ? topLevelOrganization.adminOrganizationId
  //   : null;
  // const [adminUsersError, adminUsersLoading, adminOrganization] = useOrganization(
  //   adminOrganizationId,
  // );

  // console.log(topLevelOrganization);
  // console.log(adminOrganization);

  return BasePage(
    'Analytics',
    <>
      <p>This page is still under construction. Please try again later.</p>
    </>,
    {
      backButton: (
        <ButtonLinks
          button={{
            back: true,
            text: 'Back to dashboard',
            to: ROUTES.HOME,
          }}
        />
      ),
    },
  );
};

export default withOrganizationAuthorization(AnalyticsPage);
