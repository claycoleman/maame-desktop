import React, { useContext } from 'react';
import { AuthUserContext, withTLOAdminAuthorization } from '../../components/Session';
import BasePage from '..';

import * as ROUTES from '../../constants/routes';
import OrganizationsManager from '../../components/OrganizationsManager';
import { useTopLevelOrganization, useOrganization } from '../../components/Firebase';
import ButtonLinks from '../../components/ButtonLinks';
import CommunityUsersManager from '../../components/CommunityUsersManager';

// import styles from './HomePage.module.css';

const ManageOrganizationsPage = () => {
  const authUser = useContext(AuthUserContext);
  // _tloLoading
  const [, topLevelOrganization] = useTopLevelOrganization(
    authUser ? authUser.topLevelOrganizationId : null,
  );
  const adminOrganizationId = topLevelOrganization
    ? topLevelOrganization.adminOrganizationId
    : null;
  const [, adminOrganization] = useOrganization(adminOrganizationId);

  return BasePage(
    'Manage Sub-Districts',
    <div style={{paddingBottom: 40}}>
      <OrganizationsManager topLevelOrganization={topLevelOrganization} />
      <hr style={{ marginTop: '2rem', marginBottom: '2rem' }} />
      <h3>Manage District Admin Users</h3>
      <CommunityUsersManager organization={adminOrganization} isAdminOrg={true} />
    </div>,
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
