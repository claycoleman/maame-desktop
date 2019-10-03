import React, { useContext, useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { BounceLoader } from 'react-spinners';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
import 'react-bootstrap-typeahead/css/Typeahead.css';

import { AuthUserContext, withOrganizationAuthorization } from '../../components/Session';
import BasePage from '..';

import { deepCopyObject } from '../../modules/helpers';
import * as ROUTES from '../../constants/routes';
import {
  FirebaseContext,
  useOrganization,
  useOrganizationsFromTLO,
  useTopLevelOrganization,
} from '../../components/Firebase';
import ButtonLinks from '../../components/ButtonLinks';
import Button from 'react-bootstrap/Button';

import {
  AnalyticsScope,
  trimesterBuckets,
  ageBuckets,
  parityBuckets,
  birthWeightBuckets,
  pncDateBuckets,
  AnalyticsDateMode,
  AnalyticsDateModeToFormat,
} from './helpers';
import useStats from './useStats';

const renderTitleAndStatGroupForBuckets = (title, stats, buckets) => {
  return (
    <Col
      xs={12}
      style={{
        backgroundColor: '#B4B4B4',
        borderRadius: 4,
        marginBottom: 12,
        padding: 12,
        paddingBottom: 0,
      }}
    >
      <h4
        textBreakStrategy="balanced"
        style={{ textAlign: 'center', fontWeight: 'bold', width: '100%' }}
      >
        {title}
      </h4>
      <Row>
        {buckets.map((bucket, index) => {
          return renderTitleAndStat(bucket.display, stats[index], buckets === ageBuckets);
        })}
      </Row>
    </Col>
  );
};

const renderTitleAndStatGroup = (title, stats) => {
  return (
    <Col
      xs={12}
      style={{
        backgroundColor: '#B4B4B4',
        borderRadius: 4,
        marginBottom: 12,
        padding: 12,
        paddingBottom: 0,
      }}
    >
      <h4
        textBreakStrategy="balanced"
        style={{ textAlign: 'center', fontWeight: 'bold', width: '100%' }}
      >
        {title}
      </h4>
      <Row>
        {stats.map(stat => {
          return renderTitleAndStat(stat.display, stat.value);
        })}
      </Row>
    </Col>
  );
};

const renderTitleAndStat = (title, stat, mini) => {
  return (
    <Col sm={mini ? 3 : 6}>
      <div
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 12,
          backgroundColor: 'lightgray',
          paddingVertical: 4,
          paddingHorizontal: 12,
          borderRadius: 4,
        }}
      >
        <h4 style={{ fontStyle: 'italic' }}>{title}:</h4>
        <h4 style={{ textAlign: 'center' }}>{stat}</h4>
      </div>
    </Col>
  );
};

const AnalyticsPage = () => {
  const firebase = useContext(FirebaseContext);

  const authUser = useContext(AuthUserContext);
  // _loading,
  const [, topLevelOrganization] = useTopLevelOrganization(
    authUser ? authUser.topLevelOrganizationId : null,
  );

  const organizationId = authUser ? authUser.organizationId : null;
  const organization = useOrganization(organizationId);

  const storeOrganizations = useSelector(state => state.organizations);
  const storeUsers = useSelector(state => state.users);
  const dispatch = useDispatch();
  const organizationsLoading = useOrganizationsFromTLO(topLevelOrganization, true);

  const [referenceDate, setReferenceDate] = useState(moment().subtract('month', 1));
  const [dateMode, setDateMode] = useState(AnalyticsDateMode.QUARTER);

  // TODO if you're in the admin org, this should default to the entire community.
  const [scope, setScope] = useState(null);
  const [initialScopeSet, setInitialScopeSet] = useState(false);
  const [scopeOptions, setScopeOptions] = useState([]);

  const refDate = referenceDate.clone();
  const currentDateFormat = AnalyticsDateModeToFormat[dateMode];
  const maxDateString = moment().format(currentDateFormat);
  const currentDateString = refDate.format(currentDateFormat);
  let displayDateString = currentDateString;

  switch (dateMode) {
    case AnalyticsDateMode.WEEK:
      // 17 June 2019 - 23 June 2019
      displayDateString = 'Week of ' + currentDateString;
      break;

    case AnalyticsDateMode.LAST_TWELVE_MONTHS:
      // July 2018 - June 2019
      displayDateString = `${refDate
        .subtract(12, 'months')
        .format(currentDateFormat)}–${currentDateString}`;
      break;
    case AnalyticsDateMode.QUARTER:
      // Qx 2019
      break;
    case AnalyticsDateMode.HALF:
      // Hx 2019
      displayDateString = `${refDate.quarter() <= 2 ? 'H1' : 'H2'} ${refDate.format('YYYY')}`;
      break;
    case AnalyticsDateMode.YEAR:
      // 2019
      break;
    case AnalyticsDateMode.MONTH:
      // June 2019
      break;
  }

  const [antenatalStats, deliveryPNCStats, otherStats, loading, noResponse] = useStats(
    referenceDate,
    dateMode,
    scope,
    authUser,
    displayDateString,
  );

  const updateUserMappingForEachOrganization = (forceRefresh = false) => {
    for (const orgId in storeOrganizations) {
      if (storeOrganizations.hasOwnProperty(orgId)) {
        const organization = storeOrganizations[orgId];

        const userList = organization ? organization.approvedUsers : null;
        if (!organization.isAdminOrg) {
          if (userList === null) {
            return;
          }

          userList.forEach(userEmail => {
            if (!storeUsers[userEmail] || forceRefresh === userEmail) {
              firebase
                .users()
                .where('email', '==', userEmail)
                .get()
                .then(snapshot => {
                  if (snapshot && snapshot.docs && snapshot.docs.length > 0) {
                    const userData = snapshot.docs[0].data();
                    userData.id = snapshot.docs[0].id;
                    dispatch({ type: 'ADD_USER', user: userData });
                  } else {
                    // no user for that email, this shouldn't happen in the future
                    // after storeUsers are only created here
                    dispatch({ type: 'ADD_USER', user: { email: userEmail, noUserDoc: true } });
                  }
                });
            }
          });
        }
      }
    }
  };
  useEffect(updateUserMappingForEachOrganization, [storeOrganizations]);

  useEffect(() => {
    async function handleScope() {
      // fix scope
      // TODO add the scope dropdown, which will allow you to choose the entire district, a single organization, or your own community.
      // if you're in the admin org, you shouldn't be able to choose community.
      if (authUser.isTLOAdmin) {
        // district level
        // odds are, this user doesn't belong to any single district. that means they don't have a user or a valid community.
        if (topLevelOrganization && topLevelOrganization.organizations) {
          const tloOption = {
            type: AnalyticsScope.TOP_LEVEL_ORGANIZATION,
            id: topLevelOrganization.id,
            label: `${topLevelOrganization.name}`,
          };
          if (!initialScopeSet) {
            setInitialScopeSet(true);
            setScope(tloOption);
          }

          // get all of the sub-districts and communities, use those
          const orgOptions = Object.keys(storeOrganizations)
            .map(orgId => {
              const org = storeOrganizations[orgId];
              if (!org.isAdminOrg) {
                return {
                  type: AnalyticsScope.ORGANIZATION,
                  id: org.id,
                  label: `${org.name}`,
                };
              }
              return null;
            })
            .filter(option => option != null);

          const userOptions = Object.keys(storeUsers)
            .map(userEmail => {
              const user = storeUsers[userEmail];
              return {
                type: AnalyticsScope.USER,
                id: user.id,
                label: `${user.firstName} ${user.lastName}`,
              };
            })
            .filter(option => option != null);
          setScopeOptions([tloOption, ...orgOptions, ...userOptions]);
        }
      } else if (authUser.isOrgAdmin) {
        // sub district level
        if (organization) {
          const orgOption = {
            type: AnalyticsScope.ORGANIZATION,
            id: organization.id,
            label: `All of ${organization.name}`,
          };
          if (!initialScopeSet) {
            setInitialScopeSet(true);
            setScope(orgOption);
          }

          // get all of the communities, use those
          const userOptions = Object.keys(storeUsers)
            .map(userEmail => {
              const user = storeUsers[userEmail];
              return {
                type: AnalyticsScope.USER,
                id: user.id,
                label: `${user.firstName} ${user.lastName}`,
              };
            })
            .filter(option => option != null);
          setScopeOptions([orgOption, ...userOptions]);
        }
      } else {
        // community level
        if (!initialScopeSet) {
          setInitialScopeSet(true);
          setScope({
            type: AnalyticsScope.USER,
            id: authUser.id,
            label: `${authUser.firstName} ${authUser.lastName}`,
          });
        }
      }
    }
    handleScope(!scope);
  }, [authUser, organization, topLevelOrganization, storeUsers, organizationsLoading]);

  const CustomFormInput = ({ value, onClick }) => {
    return (
      <Button variant="secondary" onClick={onClick} style={{ minWidth: 200 }}>
        {displayDateString}
      </Button>
    );
  };

  const selected = scope == null ? [] : [scope];
  const typeaheadRef = useRef(null);

  return BasePage(
    'Analytics',
    <>
      <h3>{displayDateString} Statistics</h3>
      <Form>
        <Form.Row>
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Current Period</Form.Label>
            <br />
            <DatePicker
              calendarClassName="custom-datepicker"
              customInput={<CustomFormInput />}
              selected={referenceDate.valueOf()}
              maxDate={new Date()}
              onChange={newDateString => {
                setReferenceDate(moment(newDateString));
              }}
              dateFormat="dd/MM/yyyy"
              showMonthYearPicker={dateMode !== AnalyticsDateMode.WEEK}
              showYearDropdown
              showMonthDropdown
              showWeekNumbers
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Date Mode</Form.Label>
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic" style={{ minWidth: 200 }}>
                {dateMode}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {Object.keys(AnalyticsDateMode).map(dateModeKey => (
                  <Dropdown.Item onClick={() => setDateMode(AnalyticsDateMode[dateModeKey])}>
                    {AnalyticsDateMode[dateModeKey]}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>

          {scopeOptions.length !== 0 && authUser && (authUser.isTLOAdmin || authUser.isOrgAdmin) && (
            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Current Scope</Form.Label>
              <Typeahead
                id="typeahead"
                variant="secondary"
                multiple
                selectHintOnEnter
                renderToken={(option, props, index) => {
                  return (
                    <div
                      className="rbt-token"
                      onClick={() => {
                        if (typeaheadRef.current) {
                          typeaheadRef.current.clear();
                        }
                      }}
                    >
                      {option.label}
                    </div>
                  );
                }}
                onChange={newSelection => {
                  setScope(newSelection[1] || newSelection[0]);
                  if (typeaheadRef.current) {
                    typeaheadRef.current.blur();
                  }
                }}
                inputProps={{
                  onFocusCapture: () => {
                    if (typeaheadRef.current) {
                      typeaheadRef.current.clear();
                    }
                  },
                }}
                options={scopeOptions}
                labelKey="label"
                selected={selected}
                ref={ref => (typeaheadRef.current = ref)}
              />
              {/* <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic" style={{ minWidth: 200 }}>
                  {scope.name}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {Object.keys(AnalyticsDateMode).map(dateModeKey => (
                    <Dropdown.Item onClick={() => setScope(AnalyticsDateMode[dateModeKey])}>
                      {AnalyticsDateMode[dateModeKey]}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown> */}
            </Form.Group>
          )}
        </Form.Row>
      </Form>
      {noResponse ? (
        <div
          style={{
            width: '100%',
            height: 400,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          Please select a scope.
        </div>
      ) : loading ? (
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
      ) : (
        <Row>
          {renderTitleAndStat('New registered pregnancies', antenatalStats.registrants)}
          {renderTitleAndStat('Attendances', antenatalStats.attendances)}
          {renderTitleAndStat('Making 4th visit', antenatalStats.making4thVisit)}
          {renderTitleAndStat('Making 8th visit', antenatalStats.making8thVisit)}
          {renderTitleAndStat('Seen at 36 weeks', antenatalStats.seenAt36Weeks)}
          {renderTitleAndStat('Mothers below 150 cm / 5 ft', antenatalStats.mothersBelowMinHeight)}
          {renderTitleAndStatGroupForBuckets(
            'Duration of pregnancy at registration',
            antenatalStats.durationsAtRegistration,
            trimesterBuckets,
          )}
          {renderTitleAndStatGroupForBuckets(
            'Age at registration',
            antenatalStats.agesAtRegistration,
            ageBuckets,
          )}
          {renderTitleAndStatGroupForBuckets(
            'Parity at registration',
            antenatalStats.paritiesAtRegistration,
            parityBuckets,
          )}
          {renderTitleAndStat('Total Women Delivering', deliveryPNCStats.totalBirthMothers)}
          {renderTitleAndStat('Total Babies Delivered', deliveryPNCStats.totalBirths)}
          {renderTitleAndStat('Male Live Births', deliveryPNCStats.totalMaleBirths)}
          {renderTitleAndStat('Female Live Births', deliveryPNCStats.totalFemaleBirths)}
          {renderTitleAndStatGroupForBuckets(
            'Age at delivery',
            deliveryPNCStats.agesAtDelivery,
            ageBuckets,
          )}
          {renderTitleAndStatGroupForBuckets(
            'Birth weight',
            deliveryPNCStats.birthWeights,
            birthWeightBuckets,
          )}
          {renderTitleAndStat('Delivery at hospital or HC', deliveryPNCStats.deliveryAtFacility)}
          {renderTitleAndStat('Delivery at home / with TBA', deliveryPNCStats.deliveryAtHome)}
          {renderTitleAndStatGroup('Delivery Type', [
            {
              display: 'Normal / SVD',
              value: deliveryPNCStats.normalBirths,
            },
            {
              display: 'Caesarean Section',
              value: deliveryPNCStats.cSectionBirths,
            },
            {
              display: 'Vacuum',
              value: deliveryPNCStats.vacuumBirths,
            },
            {
              display: 'Forceps',
              value: deliveryPNCStats.forcepsBirths,
            },
            {
              display: 'Other',
              value: deliveryPNCStats.otherBirths,
            },
          ])}
          {/* TODO TWIN FIX add twins */}
          {renderTitleAndStatGroup('Primigravidae', [
            {
              display: 'Male Live Births to Primigravidae',
              value: deliveryPNCStats.maleLiveBirthToPrimigravidae,
            },
            {
              display: 'Female Live Births to Primigravidae',
              value: deliveryPNCStats.femaleLiveBirthToPrimigravidae,
            },
            {
              display: 'Still Births to Primigravidae',
              value: deliveryPNCStats.stillBirthToPrimigravidae,
            },
          ])}
          {/* // TODO STILL BIRTH */}
          {renderTitleAndStat('Total Still Births', deliveryPNCStats.totalStillBirths)}
          {renderTitleAndStat('Total Maternal Deaths', deliveryPNCStats.totalMaternalDeaths)}

          {renderTitleAndStatGroupForBuckets(
            'Ages of Maternal Deaths',
            deliveryPNCStats.agesOfMaternalDeaths,
            ageBuckets,
          )}

          {renderTitleAndStat('PNC attendances', deliveryPNCStats.pncAttendances)}
          {renderTitleAndStatGroupForBuckets(
            'Age at PNC registration',
            deliveryPNCStats.agesOfPostnatal,
            ageBuckets,
          )}
          {renderTitleAndStatGroupForBuckets(
            'Days before PNC 1',
            deliveryPNCStats.daysForPNC1,
            pncDateBuckets,
          )}
          {/* TODO implement referrals */}
          {renderTitleAndStatGroup('Abortions', [
            {
              display: 'Elective Abortions',
              value: otherStats.electiveAbortions,
            },
            {
              display: 'Spontaneous Abortions',
              value: otherStats.spontaneousAbortions,
            },
            {
              display: 'Induced Abortions',
              value: otherStats.inducedAbortions,
            },
          ])}
          {renderTitleAndStatGroup('Abortion Methods', [
            {
              display: 'Vacuum',
              value: otherStats.vacuumAbortions,
            },
            {
              display: 'D&C',
              value: otherStats.dAndCAbortions,
            },
            {
              display: 'Medical',
              value: otherStats.medicalAbortions,
            },
          ])}
          {renderTitleAndStatGroupForBuckets(
            'Ages of mothers performing abortions',
            otherStats.agesOfAbortions,
            ageBuckets,
          )}
        </Row>
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

export default withOrganizationAuthorization(AnalyticsPage);
