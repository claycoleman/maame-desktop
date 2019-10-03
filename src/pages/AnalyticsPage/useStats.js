import React, { useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { deepCopyObject } from '../../modules/helpers';
import {
  DELIVERY_VISIT_INDEX,
  DELIVERY_TYPE_KEY,
  DELIVERY_PLACE_KEY,
  END_EARLY_REASON_KEY,
  skilledDelivery,
  AnalyticsScope,
  defaultAntenatalStats,
  defaultDeliveryPNCStats,
  defaultOtherStats,
  trimesterBuckets,
  ageBuckets,
  parityBuckets,
  birthWeightBuckets,
  pncDateBuckets,
  DeliveryStatus,
  daysBetweenDates,
  weeksBetweenDates,
  yearsBetweenDates,
  EndEarlyReasons,
  DeliveryType,
  PregnancyOutcomes,
  Sexes,
  AbortionMethods,
  getOrFillReportedVisits,
  AnalyticsDateMode,
  mapValueToBucket,
  AnalyticsDateModeToFormat,
} from './helpers';
import { FirebaseContext } from '../../components/Firebase';
import moment from 'moment';

function getStatsQueryKey(displayDateString, scope) {
  return `${displayDateString}-${JSON.stringify(scope)}`;
}

export default function useStats(referenceDate, dateMode, scope, user, displayDateString) {
  const firebase = useContext(FirebaseContext);

  const [loading, setLoading] = useState(true);
  const [antenatalStats, setAntenatalStats] = useState(null);
  const [deliveryPNCStats, setDeliveryPNCStats] = useState(null);
  const [otherStats, setOtherStats] = useState(null);
  const [noResponse, setNoResponse] = useState(false);

  const cachedStatsQueries = useSelector(state => state.cachedStatsQueries);
  const dispatch = useDispatch();

  const withinCurrentTimeframe = date => {
    if (!moment.isMoment(date)) {
      date = moment(date);
    }
    switch (dateMode) {
      case AnalyticsDateMode.WEEK:
        return date.week() === referenceDate.week() && date.year() === referenceDate.year();

      case AnalyticsDateMode.LAST_TWELVE_MONTHS:
        const bottomDate = referenceDate.clone().subtract(12, 'months');
        return date.valueOf() >= bottomDate.valueOf() && date.valueOf() < referenceDate.valueOf();

      case AnalyticsDateMode.QUARTER:
        return date.quarter() === referenceDate.quarter() && date.year() === referenceDate.year();

      case AnalyticsDateMode.HALF:
        return (
          ((date.quarter() <= 2 && referenceDate.quarter() <= 2) ||
            (date.quarter() >= 3 && referenceDate.quarter() >= 3)) &&
          date.year() === referenceDate.year()
        );

      case AnalyticsDateMode.YEAR:
        return date.year() === referenceDate.year();

      case AnalyticsDateMode.MONTH:
        return date.month() === referenceDate.month() && date.year() === referenceDate.year();
    }
  };

  useEffect(() => {
    if (!user || !scope) {
      setNoResponse(true);
      setLoading(false);
      return;
    }
    setNoResponse(false);
    setLoading(true);

    const cacheKey = getStatsQueryKey(displayDateString, scope);
    const cachedQuery = cachedStatsQueries[cacheKey];
    if (cachedQuery != null) {
      // bingo
      setAntenatalStats(cachedQuery.antenatalStats);
      setDeliveryPNCStats(cachedQuery.deliveryPNCStats);
      setOtherStats(cachedQuery.otherStats);
      setLoading(false);
      return;
    }

    const refDate = referenceDate.clone();
    let query = firebase
      .pregnancies()
      .where('lastMenstrualPeriodDate', '>=', refDate.subtract(1, 'year').valueOf());
    if (scope.type === AnalyticsScope.TOP_LEVEL_ORGANIZATION) {
      // query all orgs that have TLOId of current org
      // query all pregnancies that have orgId in that list

      // TODO maybe regionId if we decide to do regions later under the same organization?
      // TODO give all pregnancies a topLevelOrg id.

      // district level
      query = query.where('topLevelOrganizationId', '==', scope.id);
    } else if (scope.type === AnalyticsScope.ORGANIZATION) {
      // sub district level
      query = query.where('organizationId', '==', scope.id);
    } else if (scope.type === AnalyticsScope.USER) {
      query = query.where('userId', '==', scope.id);
    } else {
      // should never get here
      return;
    }

    return query.onSnapshot(snapshot => {
      let antenatalStats = deepCopyObject(defaultAntenatalStats);
      let deliveryPNCStats = deepCopyObject(defaultDeliveryPNCStats);
      let otherStats = deepCopyObject(defaultOtherStats);

      for (const pregnancyDoc of snapshot.docs) {
        const pregnancyData = pregnancyDoc.data();
        pregnancyData.id = pregnancyDoc.id;
        const reportedVisits = getOrFillReportedVisits(pregnancyData);
        const deliveryData = pregnancyData.deliveryData || {};

        if (withinCurrentTimeframe(pregnancyData.dateCreated)) {
          antenatalStats.registrants += 1;

          if (pregnancyData.belowMinHeight) {
            antenatalStats.mothersBelowMinHeight += 1;
          }

          const trimesterBucket = mapValueToBucket(
            weeksBetweenDates(pregnancyData.lastMenstrualPeriodDate, pregnancyData.dateCreated),
            trimesterBuckets,
          );
          antenatalStats.durationsAtRegistration[trimesterBucket] += 1;

          const ageBucket = mapValueToBucket(
            yearsBetweenDates(pregnancyData.patientBirthDate, pregnancyData.dateCreated),
            ageBuckets,
          );
          antenatalStats.agesAtRegistration[ageBucket] += 1;

          const parityBucket = mapValueToBucket(pregnancyData.patientCurrentParity, parityBuckets);
          antenatalStats.paritiesAtRegistration[parityBucket] += 1;
        }

        // TODO VISIT FIX
        for (let index = 0; index < reportedVisits.slice(0, DELIVERY_VISIT_INDEX).length; index++) {
          const visit = reportedVisits.slice(0, DELIVERY_VISIT_INDEX)[index];

          if (
            visit &&
            visit.date &&
            !visit.differentFacility &&
            withinCurrentTimeframe(visit.date)
          ) {
            antenatalStats.attendances += 1;

            // TODO VISIT FIX remove the 'index ===' statements
            if (visit.number === 4 || index === 3) {
              antenatalStats.making4thVisit += 1;
            } else if (visit.number === 8 || index === 7) {
              antenatalStats.making8thVisit += 1;
            } else if (visit.week === 36 || index === 5) {
              antenatalStats.seenAt36Weeks += 1;
            }
          }
        }

        if (
          pregnancyData.deliveryStatus === DeliveryStatus.ACTUAL &&
          withinCurrentTimeframe(pregnancyData.deliveryDate)
        ) {
          // delivery in the time period

          deliveryPNCStats.totalBirthMothers += 1;
          // TODO TWIN FIX
          // add more potentially
          deliveryPNCStats.totalBirths += 1;
          if (pregnancyData.childOutcome === PregnancyOutcomes.PASSED_AWAY) {
            // TODO STILL BIRTH FIX
            // macerated or fresh
            deliveryPNCStats.totalStillBirths += 1;
          } else {
            // TODO TWIN FIX
            // TODO VISIT FLOW NAME KEY FIX
            if (deliveryData['Sex'] === Sexes.MALE) {
              deliveryPNCStats.totalMaleBirths += 1;
            } else {
              deliveryPNCStats.totalFemaleBirths += 1;
            }
          }

          // TODO VISIT FLOW NAME KEY FIX
          switch (deliveryData[DELIVERY_TYPE_KEY]) {
            case DeliveryType.NORMAL:
              deliveryPNCStats.normalBirths += 1;
              break;
            case DeliveryType.CAESAREAN_SECTION:
              deliveryPNCStats.cSectionBirths += 1;
              break;
            case DeliveryType.VACUUM:
              deliveryPNCStats.vacuumBirths += 1;
              break;
            case DeliveryType.FORCEPS:
              deliveryPNCStats.forcepsBirths += 1;
              break;
            case DeliveryType.OTHER:
              deliveryPNCStats.otherBirths += 1;
              break;
          }

          // TODO VISIT FLOW NAME KEY FIX
          if (skilledDelivery(deliveryData[DELIVERY_PLACE_KEY])) {
            deliveryPNCStats.deliveryAtFacility += 1;
          } else {
            deliveryPNCStats.deliveryAtHome += 1;
          }

          const ageBucket = mapValueToBucket(
            yearsBetweenDates(pregnancyData.patientBirthDate, pregnancyData.deliveryDate),
            ageBuckets,
          );
          deliveryPNCStats.agesAtDelivery[ageBucket] += 1;

          const weightBucket = mapValueToBucket(
            // TODO VISIT FLOW NAME KEY FIX
            deliveryData['Weight'],
            birthWeightBuckets,
          );
          deliveryPNCStats.birthWeights[weightBucket] += 1;

          if (pregnancyData.patientCurrentParity === 0) {
            // primigravidae
            if (pregnancyData.childOutcome === PregnancyOutcomes.PASSED_AWAY) {
              deliveryPNCStats.stillBirthToPrimigravidae += 1;
            } else {
              // TODO TWIN FIX
              if (deliveryData['Sex'] === Sexes.MALE) {
                deliveryPNCStats.maleLiveBirthToPrimigravidae += 1;
              } else {
                deliveryPNCStats.femaleLiveBirthToPrimigravidae += 1;
              }
            }
          }

          if (pregnancyData.motherOutcome === PregnancyOutcomes.PASSED_AWAY) {
            deliveryPNCStats.totalMaternalDeaths += 1;
            deliveryPNCStats.agesOfMaternalDeaths[ageBucket] += 1;
          }
        }

        // postnatal registrants come from the first pnc visit
        // TODO VISIT FIX
        const firstPNC = reportedVisits[DELIVERY_VISIT_INDEX + 1];
        if (firstPNC && firstPNC.date && withinCurrentTimeframe(firstPNC.date)) {
          // count all PNC
          for (const pncVisit of reportedVisits.slice(DELIVERY_VISIT_INDEX + 1)) {
            if (pncVisit && !pncVisit.differentFacility) {
              deliveryPNCStats.pncAttendances += 1;
            }
          }

          const pncDateBucket = mapValueToBucket(
            daysBetweenDates(pregnancyData.deliveryDate, firstPNC.date),
            pncDateBuckets,
          );
          console.log(pregnancyData.deliveryData, firstPNC.date);
          console.log(daysBetweenDates(pregnancyData.deliveryData, firstPNC.date));
          console.log(pncDateBucket);
          deliveryPNCStats.daysForPNC1[pncDateBucket] += 1;

          const pncAgeBucket = mapValueToBucket(
            yearsBetweenDates(pregnancyData.patientBirthDate, firstPNC.date),
            ageBuckets,
          );
          deliveryPNCStats.agesOfPostnatal[pncAgeBucket] += 1;
        }

        if (pregnancyData.endedEarly && withinCurrentTimeframe(pregnancyData.endedEarlyDate)) {
          // ended early within the period
          const endEarlyAgeBucket = mapValueToBucket(
            yearsBetweenDates(pregnancyData.patientBirthDate, pregnancyData.endedEarlyDate),
            ageBuckets,
          );

          switch (pregnancyData.endEarlyData[END_EARLY_REASON_KEY]) {
            case EndEarlyReasons.PASSED_AWAY:
              deliveryPNCStats.totalMaternalDeaths += 1;
              deliveryPNCStats.agesOfMaternalDeaths[endEarlyAgeBucket] += 1;
              break;

            case EndEarlyReasons.ELECTIVE_ABORTION:
              otherStats.electiveAbortions += 1;
              otherStats.agesOfAbortions[endEarlyAgeBucket] += 1;
              break;
            case EndEarlyReasons.SPONTANEOUS_ABORTION:
              otherStats.spontaneousAbortions += 1;
              otherStats.agesOfAbortions[endEarlyAgeBucket] += 1;
              break;
            case EndEarlyReasons.INDUCED_ABORTION:
              otherStats.inducedAbortions += 1;
              otherStats.agesOfAbortions[endEarlyAgeBucket] += 1;
              break;
          }

          // TODO VISIT FLOW NAME KEY FIX
          switch (pregnancyData.endEarlyData['Abortion Method']) {
            case AbortionMethods.D_AND_C:
              otherStats.dAndCAbortions += 1;
              break;
            case AbortionMethods.ELECTRIC_MANUAL_VACUUM:
              otherStats.vacuumAbortions += 1;
              break;
            case AbortionMethods.MEDICAL:
              otherStats.medicalAbortions += 1;
              break;
          }
        }
      }

      setAntenatalStats(antenatalStats);
      setDeliveryPNCStats(deliveryPNCStats);
      setOtherStats(otherStats);
      setLoading(false);

      dispatch({
        type: 'CACHE_STATS_QUERY',
        key: cacheKey,
        data: { antenatalStats, deliveryPNCStats, otherStats },
      });
    });
  }, [referenceDate, dateMode, scope, user]);

  return [antenatalStats, deliveryPNCStats, otherStats, loading, noResponse];
}
