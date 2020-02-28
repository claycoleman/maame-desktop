import React, { useContext } from 'react';
import { BounceLoader } from 'react-spinners';

import BasePage from '..';
import { withOrgAdminAuthorization, AuthUserContext } from '../../components/Session';
import OrgRecentUsage from './OrgRecentUsage';
import TLORecentUsage from './TLORecentUsage';
import ButtonLinks from '../../components/ButtonLinks';
import * as ROUTES from '../../constants/routes';

const RecentUsagePage = () => {
  const authUser = useContext(AuthUserContext);

  return BasePage(
    'Recent Usage',
    <>
      {!authUser ? (
        <div
          style={{
            width: '100%',
            height: 400,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <BounceLoader sizeUnit={'px'} size={135} color={'#c00'} loading={true} />
          {/* refresh data stuff */}
        </div>
      ) : authUser.isTLOAdmin ? (
        <TLORecentUsage authUser={authUser} />
      ) : (
        <OrgRecentUsage authUser={authUser} />
      )}
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

export default withOrgAdminAuthorization(RecentUsagePage);
