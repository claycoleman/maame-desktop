import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FirebaseContext } from '../../components/Firebase';

const RefreshDataButtons = () => {
  // refresh data stuff
  const firebase = useContext(FirebaseContext);
  const dispatch = useDispatch();
  const storeOrganizations = useSelector(state => state.organizations);

  return (
    <button
      onClick={async () => {
        const fetchOrgs = async () => {
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
        };
        await fetchOrgs();

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
                (storeOrganizations[data.organizationId] || {}).topLevelOrganizationId || null;
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
      Fetch orgs & Update pregnancies and patients
    </button>
  );
};

export default RefreshDataButtons;
