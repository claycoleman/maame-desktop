import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '.';

export function useTopLevelOrganization(id) {
  // initialize our default state
  const firebase = useContext(FirebaseContext);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [topLevelOrganization, setTopLevelOrganization] = useState(null);

  // when the id attribute changes (including mount)
  // subscribe to the topLevelOrganization document and update
  // our state when it changes.
  useEffect(() => {
    if (id) {
      const unsubscribe = firebase.topLevelOrganization(id).onSnapshot(
        doc => {
          setTopLevelOrganization(doc);
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
  }, [id, firebase]);

  return [error, loading, topLevelOrganization];
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
              // TODO extract visit data
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
