import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '.';
import { useSelector, useDispatch } from 'react-redux';
import { orgListenerKey, tloListenerKey, tloOrgsListenerKey } from '../Store';

export function useOrganization(id) {
  const firebase = useContext(FirebaseContext);

  const dispatch = useDispatch();
  const organization = useSelector(state => state.organizations[id]);
  const cachedListeners = useSelector(state => state.cachedListeners);
  const [loading, setLoading] = useState(true);

  if (id && !cachedListeners[orgListenerKey(id)] && !organization) {
    const unsubscriber = firebase.organization(id).onSnapshot(
      doc => {
        const fetchedOrg = doc.data();
        fetchedOrg.id = doc.id;
        dispatch({ type: 'ADD_ORGANIZATION', organization: fetchedOrg });
        setLoading(false);
      },
      err => {
        dispatch({ type: 'ADD_ORGANIZATION', organization: { error: err } });
      },
    );
    dispatch({ type: 'FETCH_ORGANIZATION', organizationId: id, unsubscriber });
  }
  if (!!organization && loading) {
    setLoading(false);
  }
  return [loading, organization];
}

export function useTopLevelOrganization(id) {
  const firebase = useContext(FirebaseContext);

  const dispatch = useDispatch();
  const topLevelOrganization = useSelector(state => state.topLevelOrganization);
  const cachedListeners = useSelector(state => state.cachedListeners);
  const [loading, setLoading] = useState(true);

  if (id && !cachedListeners[tloListenerKey(id)] && !topLevelOrganization) {
    const unsubscriber = firebase.topLevelOrganization(id).onSnapshot(
      doc => {
        const fetchedOrg = doc.data();
        fetchedOrg.id = doc.id;
        dispatch({ type: 'SET_TOP_LEVEL_ORGANIZATION', topLevelOrganization: fetchedOrg });
        setLoading(false);
      },
      err => {
        dispatch({ type: 'SET_TOP_LEVEL_ORGANIZATION', topLevelOrganization: { error: err } });
      },
    );
    dispatch({ type: 'FETCH_TOP_LEVEL_ORGANIZATION', topLevelOrganizationId: id, unsubscriber });
  }
  if (!!topLevelOrganization && loading) {
    setLoading(false);
  }
  return [loading, topLevelOrganization];
}

export function useTLOVisitFlows(topLevelOrganization) {
  // initialize our default state
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visitFlows, setVisitFlows] = useState([]);

  // when the id attribute changes (including mount)
  // subscribe to the topLevelOrganization document and update
  // our state when it changes.
  useEffect(() => {
    if (topLevelOrganization) {
      const unsubscribe = topLevelOrganization.ref.collection('visit-flows').onSnapshot(
        snapshot => {
          setVisitFlows(
            snapshot.docs.map(doc => {
              const visitData = doc.data();
              visitData.id = doc.id;
              return visitData;
            }),
          );
          setLoading(false);
        },
        err => {
          setError(err);
          setLoading(false);
        },
      );

      // returning the unsubscribe function will ensure that
      // we unsubscribe from document changes when our id
      // changes to a different value.
      return () => unsubscribe();
    }
  }, [topLevelOrganization]);

  return [error, loading, visitFlows];
}

export function useTLOScreens(topLevelOrganization) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [screens, setScreens] = useState([]);

  useEffect(() => {
    if (topLevelOrganization) {
      const unsubscribe = topLevelOrganization.ref.collection('screens').onSnapshot(
        snapshot => {
          setScreens(
            snapshot.docs.map(doc => {
              const screenData = doc.data();
              screenData.id = doc.id;
              return screenData;
            }),
          );
          setLoading(false);
        },
        err => {
          setError(err);
          setLoading(false);
        },
      );

      return () => unsubscribe();
    }
  }, [topLevelOrganization]);

  return [error, loading, screens];
}

export function useOrganizationsFromTLO(topLevelOrganization, shouldExcludeAdminOrg = true) {
  const firebase = useContext(FirebaseContext);

  const dispatch = useDispatch();

  const cachedListeners = useSelector(state => state.cachedListeners);
  const [loading, setLoading] = useState(true);

  if (topLevelOrganization && !cachedListeners[tloOrgsListenerKey(topLevelOrganization.id)]) {
    const unsubscriber = firebase
      .organizations()
      .where('topLevelOrganizationId', '==', topLevelOrganization.id)
      .onSnapshot(
        snapshot => {
          const newTLOOrgs = snapshot.docs
            .map(doc => {
              const fetchedOrg = doc.data();
              fetchedOrg.id = doc.id;
              dispatch({ type: 'ADD_ORGANIZATION', organization: fetchedOrg });
              return fetchedOrg;
            })
            .filter(org => !shouldExcludeAdminOrg || !org.isAdminOrg);
          dispatch({ type: 'SET_TLO_ORGS', tloOrgs: newTLOOrgs.map(org => org.id) });
          setLoading(false);
        },
        err => {
          dispatch({ type: 'SET_TLO_ORG_ERROR', error: err });
          setLoading(false);
        },
      );
    dispatch({
      type: 'FETCH_TLO_ORGS',
      topLevelOrganizationId: topLevelOrganization.id,
      unsubscriber,
    });
  } else if (loading) {
    setLoading(false);
  }
  return loading;

  // const firebase = useContext(FirebaseContext);
  // const [error, setError] = useState(false);
  // const [loading, setLoading] = useState(true);
  // const [organizations, setOrganizations] = useState([]);

  // useEffect(() => {
  //   if (topLevelOrganization) {
  //     const unsubscribe = firebase
  //       .organizations()
  //       .where('topLevelOrganizationId', '==', topLevelOrganization.id)
  //       .onSnapshot(
  //         snapshot => {
  //           setOrganizations(
  //             snapshot.docs
  //               .map(doc => {
  //                 const orgData = doc.data();
  //                 orgData.id = doc.id;
  //                 return orgData;
  //               })
  //               .filter(org => !shouldExcludeAdminOrg || !org.isAdminOrg),
  //           );
  //           setLoading(false);
  //         },
  //         err => {
  //           setError(err);
  //           setLoading(false);
  //         },
  //       );

  //     return () => unsubscribe();
  //   }
  // }, [topLevelOrganization]);

  // // OFFLINE TESTING
  // // return ['', false, [{ id: 123, name: 'Test 1' }, { id: 456, name: 'Test 2' }]];

  // return [error, loading, organizations];
}
