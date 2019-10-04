import React, { useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { deepCopyObject } from '../../modules/helpers';
import { FirebaseContext } from '../../components/Firebase';
import { getOrFillReportedVisits } from '../AnalyticsPage/helpers';

function getRecentUsageCacheKey(id, levelField) {
  return `recent-usage-${id}-${levelField}`;
}

export default function useRecentUsage(id, levelField) {
  const firebase = useContext(FirebaseContext);
  const dispatch = useDispatch();
  const cache = useSelector(state => state.cachedRecentUsage);
  const storeUsers = useSelector(state => state.users);

  const [loading, setLoading] = useState(true);
  const [noResponse, setNoResponse] = useState(false);
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    if (!id || !levelField) {
      setNoResponse(true);
      setLoading(false);
      return;
    }
    setNoResponse(false);
    setLoading(true);

    const cacheKey = getRecentUsageCacheKey(id, levelField);
    const cachedRecentUsage = cache[cacheKey];

    if (cachedRecentUsage) {
      setUsage(cachedRecentUsage.usage);
      setNoResponse(false);
      setLoading(false);
      return;
    }
    
    // contents
    return firebase
      .pregnancies()
      .where(levelField, '==', id)
      .onSnapshot(snapshot => {
        const usage = {};
        for (const pregnancyDoc of snapshot.docs) {
          const pregnancyData = pregnancyDoc.data();
          pregnancyData.id = pregnancyDoc.id;
          const reportedVisits = getOrFillReportedVisits(pregnancyData);
          if (!usage[pregnancyData.userId]) {
            usage[pregnancyData.userId] = {
              latestRegistrant: 0,
              totalRegistrants: 0,
              latestUpdate: 0,
              latestVisit: 0,
              totalVisits: 0,
            };
          }
          // TODO add date
          usage[pregnancyData.userId].totalRegistrants += 1;
          if (pregnancyData.dateCreated > usage[pregnancyData.userId].latestRegistrant) {
            usage[pregnancyData.userId].latestRegistrant = pregnancyData.dateCreated;
          }
          if (pregnancyData.dateUpdated > usage[pregnancyData.userId].latestUpdate) {
            usage[pregnancyData.userId].latestUpdate = pregnancyData.dateUpdated;
          }
          for (let index = 0; index < reportedVisits.length; index++) {
            const visit = reportedVisits[index];
            if (visit) {
              // TODO add date
              usage[pregnancyData.userId].totalVisits += 1;
              if (visit.date > usage[pregnancyData.userId].latestVisit) {
                usage[pregnancyData.userId].latestVisit = visit.date;
              }
            }
          }
        }
        setUsage(usage);
        setLoading(false);

        dispatch({
          type: 'CACHE_RECENT_USAGE',
          key: cacheKey,
          data: { usage },
        });
      });
  }, [id, levelField]);

  useEffect(() => {
    if (!usage) {
      return;
    }
    setLoading(true);
    const userIds = Object.keys(usage);
    for (let index = 0; index < userIds.length; index++) {
      const userId = userIds[index];
      if (!storeUsers[userId]) {
        firebase
          .user(userId)
          .get()
          .then(doc => {
            const userData = doc.data();
            userData.id = doc.id;
            dispatch({ type: 'ADD_USER', user: userData, useId: true });
          });
      }
    }
    setLoading(false);
  }, [usage]);

  return [usage, loading, noResponse];
}
