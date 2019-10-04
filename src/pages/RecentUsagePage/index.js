import React, { useContext } from 'react';
import { BounceLoader } from 'react-spinners';
import { useSelector, useDispatch } from 'react-redux';

import BasePage from '..';
import { withOrgAdminAuthorization, AuthUserContext } from '../../components/Session';
import OrgRecentUsage from './OrgRecentUsage';
import TLORecentUsage from './TLORecentUsage';
import ButtonLinks from '../../components/ButtonLinks';
import * as ROUTES from '../../constants/routes';
import { FirebaseContext } from '../../components/Firebase';

const RecentUsagePage = () => {
  const authUser = useContext(AuthUserContext);
  // refresh data stuff
  // const firebase = useContext(FirebaseContext);
  // const dispatch = useDispatch();
  // const storeOrganizations = useSelector(state => state.organizations);

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
          {/* <button
            onClick={async () => {
              const organizations = await firebase
                .organizations()
                .get()
                .then(snapshot => {
                  return snapshot.docs.map(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    return data;
                  });
                });

              for (const org of organizations) {
                if (!storeOrganizations[org.id]) {
                  dispatch({ type: 'ADD_ORGANIZATION', organization: org });
                }
              }
            }}
          >
            Fetch orgs
          </button>
          <button
            onClick={async () => {
              const updatePatientsOrPregnancies = snapshot => {
                for (const doc of snapshot.docs) {
                  const data = doc.data();
                  data.id = doc.id;
                  if (data.topLevelOrganizationId === '' || data.topLevelOrganizationId === null) {
                    const topLevelOrganizationId = (storeOrganizations[data.organizationId] || {})
                      .topLevelOrganizationId;
                    if (topLevelOrganizationId) {
                      console.log('setting for', data.id);
                      doc.ref.set({ topLevelOrganizationId }, { merge: true });
                    }
                  } else if (data.topLevelOrganizationId === undefined) {
                    const topLevelOrganizationId =
                      (storeOrganizations[data.organizationId] || {}).topLevelOrganizationId ||
                      null;
                    console.log('setting null for', data.id);
                    doc.ref.set({ topLevelOrganizationId }, { merge: true });
                  }
                }
              };
              firebase
                .pregnancies()
                .get()
                .then(updatePatientsOrPregnancies);
              firebase
                .patients()
                .get()
                .then(updatePatientsOrPregnancies);
            }}
          >
            Update pregnancies and patients
          </button> */}
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
