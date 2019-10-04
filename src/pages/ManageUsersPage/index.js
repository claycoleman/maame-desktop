import React, { useContext } from 'react';

import { AuthUserContext, withOrgAdminAuthorization } from '../../components/Session';
import BasePage from '..';

import * as ROUTES from '../../constants/routes';
import { FirebaseContext, useOrganization } from '../../components/Firebase';
import CommunityUsersManager from '../../components/CommunityUsersManager';
import ButtonLinks from '../../components/ButtonLinks';

// import styles from './HomePage.module.css';

const ManageUsersPage = ({ match }) => {
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const organizationId = match.params.orgId || (authUser ? authUser.organizationId : null);
  const [, organization] = useOrganization(organizationId);

  return BasePage(
    `Manage Communities and Users for\n${organization ? organization.name : ''}`,
    <>
      <CommunityUsersManager organization={organization} />
    </>,
    {
      backButton: (
        <ButtonLinks
          button={
            authUser.isTLOAdmin
              ? {
                  back: true,
                  text: 'Back to sub-districts',
                  to: ROUTES.MANAGE_ORGANIZATIONS,
                }
              : {
                  back: true,
                  text: 'Back to dashboard',
                  to: ROUTES.HOME,
                }
          }
        />
      ),
    },
  );
};

export default withOrgAdminAuthorization(ManageUsersPage);
