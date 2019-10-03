import moment from 'moment';
import { copyArray } from '../../modules/helpers';

export const DELIVERY_VISIT_INDEX = 8;
export const NUMBER_OF_VISITS = 12;
export const DELIVERY_TYPE_KEY = 'Type of Delivery';
export const DELIVERY_PLACE_KEY = 'Place of Delivery';
export const END_EARLY_REASON_KEY = 'Reason for Ending Early';

export const AnalyticsDateMode = {
  WEEK: 'Week',
  MONTH: 'Month',
  QUARTER: 'Quarter',
  HALF: 'Half',
  YEAR: 'Year',
  LAST_TWELVE_MONTHS: 'Last 12 Months',
};

export const AnalyticsScope = {
  USER: 0, // community scope
  ORGANIZATION: 1, // sub-district scope
  TOP_LEVEL_ORGANIZATION: 2, // district scope
};

export const AnalyticsDateModeToFormat = {};
AnalyticsDateModeToFormat[AnalyticsDateMode.WEEK] = 'D MMM YYYY';
AnalyticsDateModeToFormat[AnalyticsDateMode.MONTH] = 'MMM YYYY';
AnalyticsDateModeToFormat[AnalyticsDateMode.QUARTER] = '[Q]Q YYYY';
AnalyticsDateModeToFormat[AnalyticsDateMode.HALF] = 'MMM YYYY';
AnalyticsDateModeToFormat[AnalyticsDateMode.YEAR] = 'YYYY';
AnalyticsDateModeToFormat[AnalyticsDateMode.LAST_TWELVE_MONTHS] = 'MMM YYYY';

export const ageBuckets = [
  {
    min: null,
    max: 14,
    display: '10-14',
  },
  {
    min: 15,
    max: 19,
    display: '15-19',
  },
  {
    min: 20,
    max: 24,
    display: '20-24',
  },
  {
    min: 25,
    max: 29,
    display: '25-29',
  },
  {
    min: 30,
    max: 34,
    display: '30-34',
  },
  {
    min: 35,
    max: null,
    display: '≥ 35',
  },
];

export const trimesterBuckets = [
  {
    min: null,
    max: 12,
    display: 'First Trimester',
  },
  {
    min: 13,
    max: 24,
    display: 'Second Trimester',
  },
  {
    min: 25,
    max: null,
    display: 'Third Trimester',
  },
];

export const parityBuckets = [
  {
    min: null,
    max: 0,
    display: '0',
  },
  {
    min: 1,
    max: 2,
    display: '1-2',
  },
  {
    min: 3,
    max: 4,
    display: '3-4',
  },
  {
    min: 5,
    max: null,
    display: '5+',
  },
];

export const birthWeightBuckets = [
  {
    min: null,
    max: 2.5,
    display: 'Below 2.5 kg',
  },
  {
    min: 2.5,
    max: null,
    display: '2.5 kg and above',
  },
];

export const pncDateBuckets = [
  {
    min: 0,
    max: 1,
    display: '1st PNC on day 1 or 2',
  },
  {
    min: 2,
    max: 7,
    display: '1st PNC on day 3 - 7',
  },
  {
    min: 8,
    max: null,
    display: '1st PNC on day 8 or above',
  },
];

export const defaultAntenatalStats = {
  registrants: 0,
  attendances: 0,
  making4thVisit: 0,
  making8thVisit: 0,
  mothersBelowMinHeight: 0,
  seenAt36Weeks: 0,

  durationsAtRegistration: trimesterBuckets.map(_ => 0),
  agesAtRegistration: ageBuckets.map(_ => 0),
  paritiesAtRegistration: parityBuckets.map(_ => 0),
};

export const defaultDeliveryPNCStats = {
  agesAtDelivery: ageBuckets.map(_ => 0),
  birthWeights: birthWeightBuckets.map(_ => 0),

  maleLiveBirthToPrimigravidae: 0,
  femaleLiveBirthToPrimigravidae: 0,
  stillBirthToPrimigravidae: 0,

  // TODO TWIN FIX
  // put together
  singleBirthMothers: 0,
  singleBirths: 0,
  doubleBirthMothers: 0,
  doubleBirths: 0,
  tripleBirthMothers: 0,
  tripleBirths: 0,
  otherMultipleBirthMothers: 0,
  otherMultipleBirths: 0,

  normalBirths: 0,
  cSectionBirths: 0,
  vacuumBirths: 0,
  forcepsBirths: 0,
  otherBirths: 0,

  totalBirthMothers: 0,
  totalBirths: 0,

  totalMaleBirths: 0,
  totalFemaleBirths: 0,

  // TODO STILL BIRTH
  // put together
  maceratedStillBirths: 0,
  freshStillBirths: 0,
  totalStillBirths: 0,

  deliveryAtFacility: 0,
  deliveryAtHome: 0,

  agesOfMaternalDeaths: ageBuckets.map(_ => 0),
  totalMaternalDeaths: 0,
  totalNeonatalDeaths: 0,

  daysForPNC1: pncDateBuckets.map(_ => 0),
  pncAttendances: 0,
  agesOfPostnatal: ageBuckets.map(_ => 0),
};

export const defaultOtherStats = {
  // TODO implement with referrals
  // put together
  antenatalReferralsIn: 0,
  antenatalReferralsOut: 0,

  deliveryReferralsIn: 0,
  deliveryReferralsOut: 0,

  postnatalReferralsIn: 0,
  postnatalReferralsOut: 0,

  electiveAbortions: 0,
  spontaneousAbortions: 0,
  inducedAbortions: 0,

  vacuumAbortions: 0,
  dAndCAbortions: 0,
  medicalAbortions: 0,
  agesOfAbortions: ageBuckets.map(_ => 0),
};

function timeBetweenDates(unit, earlierDateValue, laterDateValue = null) {
  if (!laterDateValue) {
    return moment().diff(moment(earlierDateValue), unit);
  }
  return moment(laterDateValue).diff(moment(earlierDateValue), unit);
}

export function yearsBetweenDates(earlierDateValue, laterDateValue = null) {
  return timeBetweenDates('years', earlierDateValue, laterDateValue);
}

export function weeksBetweenDates(earlierDateValue, laterDateValue = null) {
  return timeBetweenDates('weeks', earlierDateValue, laterDateValue);
}

export function daysBetweenDates(earlierDateValue, laterDateValue = null) {
  return timeBetweenDates('days', earlierDateValue, laterDateValue);
}

export function hoursBetweenDates(earlierDateValue, laterDateValue = null) {
  return timeBetweenDates('hours', earlierDateValue, laterDateValue);
}

export function minutesBetweenDates(earlierDateValue, laterDateValue = null) {
  return timeBetweenDates('minutes', earlierDateValue, laterDateValue);
}

export const hasPregnancyDelivered = pregnancy => {
  return pregnancy && pregnancy.deliveryStatus === DeliveryStatus.ACTUAL;
};

export const DeliveryStatus = {
  ESTIMATED: 'expected',
  ACTUAL: 'actual',
  DONT_USE___ENDED_EARLY: 'ended_early',
};

export const DeliveryType = {
  NORMAL: 'Normal',
  VACUUM: 'Vacuum',
  CAESAREAN_SECTION: 'Caesarean Section',
  FORCEPS: 'Forceps',
  OTHER: 'Other',
};

export const EndEarlyReasons = {
  PASSED_AWAY: 'Client Passed Away',
  ELECTIVE_ABORTION: 'Elective Abortion',
  SPONTANEOUS_ABORTION: 'Spontaneous Abortion',
  INDUCED_ABORTION: 'Induced Abortion',
  MOVED: 'Client Moved',
  OTHER: 'Other',
};

export const BirthLocationType = {
  HOSPITAL: 'Hospital',
  HEALTH_CENTER: 'Health Centre',
  CHPS: 'Community Clinic (CHPS)',
  HOME: 'Home',
  OTHER: 'Other',
};

export const skilledDelivery = birthLocation =>
  [BirthLocationType.HOSPITAL, BirthLocationType.HEALTH_CENTER, BirthLocationType.CHPS].indexOf(
    birthLocation,
  ) >= 0;

export const PregnancyOutcomes = {
  HEALTHY: 'Healthy',
  ISSUES: 'Issues',
  PASSED_AWAY: 'Passed Away',
  STILL_PREGNANT: 'still_pregnant',
  PATIENT_DELETED: 'patient_deleted',
  PATIENT_MOVED: 'patient_moved',
};

export const Sexes = {
  MALE: 'Male',
  FEMALE: 'Female',
};

export const AbortionMethods = {
  ELECTRIC_MANUAL_VACUUM: 'Electric/Manual Vacuum Aspiration',
  D_AND_C: 'D&C',
  MEDICAL: 'Medical',
};

export function getOrFillReportedVisits(pregnancy) {
  let reportedVisits = copyArray(pregnancy.reportedVisits);
  while (reportedVisits.length < NUMBER_OF_VISITS) {
    reportedVisits.push(null);
  }
  // TODO remove this, just to fix inital ones
  while (reportedVisits.length > NUMBER_OF_VISITS) {
    reportedVisits.pop();
  }
  return reportedVisits;
}

export function mapValueToBucket(value, buckets) {
  for (let index = 0; index < buckets.length; index++) {
    const bucket = buckets[index];

    if (bucket.min != null && value < bucket.min) {
      continue;
    }
    if (bucket.max != null && value > bucket.max) {
      continue;
    }

    // we're in this bucket
    return index;
  }
}
