import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthUserContext, withTLOAdminAuthorization } from '../../components/Session';
import BasePage from '..';

import * as ROUTES from '../../constants/routes';
import OrganizationsManager from '../../components/OrganizationsManager';
import { useTopLevelOrganization } from '../../components/Firebase';
import ButtonLinks from '../../components/ButtonLinks';
import CommunityUsersManager from '../../components/CommunityUsersManager';
import { useOrganization } from '../../components/Firebase/hooks';

// import styles from './HomePage.module.css';

const ManageOrganizationsPage = () => {
  const authUser = useContext(AuthUserContext);
  const [error, loading, topLevelOrganization] = useTopLevelOrganization(
    authUser ? authUser.topLevelOrganizationId : null,
  );
  const adminOrganizationId = topLevelOrganization
    ? topLevelOrganization.adminOrganizationId
    : null;
  const [adminUsersError, adminUsersLoading, adminOrganization] = useOrganization(
    adminOrganizationId,
  );

  console.log(topLevelOrganization);
  console.log(adminOrganization);

  return BasePage(
    'Manage Sub-Districts',
    <>
      <OrganizationsManager topLevelOrganization={topLevelOrganization} />
      <hr style={{ marginTop: '2rem', marginBottom: '2rem' }} />
      <h3>Manage District Admin Users</h3>
      <CommunityUsersManager organization={adminOrganization} isAdminOrg={true} />
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

export default withTLOAdminAuthorization(ManageOrganizationsPage);
