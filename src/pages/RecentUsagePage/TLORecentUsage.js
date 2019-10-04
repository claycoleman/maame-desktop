import React, { useContext, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BounceLoader } from 'react-spinners';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import moment from 'moment';

import useRecentUsage from './useRecentUsage';
import { RecentUsageSortingMode, RecentUsageSortingModeToSortingKey } from './helpers';
import { useTopLevelOrganization } from '../../components/Firebase';

const TLORecentUsage = ({ authUser }) => {
  // _loading,
  const [tloLoading, topLevelOrganization] = useTopLevelOrganization(
    authUser ? authUser.topLevelOrganizationId : null,
  );
  const [recentUsage, loading, noResponse] = useRecentUsage(
    authUser.topLevelOrganizationId,
    'topLevelOrganizationId',
  );
  const [sorting, setSorting] = useState(RecentUsageSortingMode.LATEST_REGISTRANT);
  const storeUsers = useSelector(state => state.users);

  let recentUsageSorted;
  if (recentUsage) {
    recentUsageSorted = Object.keys(recentUsage)
      .map(userId => {
        const dataForUser = recentUsage[userId];
        return { id: userId, value: dataForUser[RecentUsageSortingModeToSortingKey[sorting]] };
      })
      .sort((a, b) => {
        return b.value - a.value;
      });
  }

  return loading || tloLoading ? (
    <BounceLoader sizeUnit={'px'} size={135} color={'#c00'} loading={true} />
  ) : (
    <div>
      <h4>
        {topLevelOrganization.name} District: {sorting}
      </h4>
      <Form>
        <Form.Row>
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Sort By</Form.Label>
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic" style={{ minWidth: 200 }}>
                {sorting}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {Object.keys(RecentUsageSortingMode).map(recentUsageSortingKey => (
                  <Dropdown.Item
                    onClick={() => setSorting(RecentUsageSortingMode[recentUsageSortingKey])}
                  >
                    {RecentUsageSortingMode[recentUsageSortingKey]}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
        </Form.Row>
      </Form>
      {recentUsageSorted.map(({ id, value }) => {
        const user = storeUsers[id];
        if (!user) {
          return null;
        }
        let displayString = value;
        if (
          sorting === RecentUsageSortingMode.LATEST_REGISTRANT ||
          sorting === RecentUsageSortingMode.LATEST_UPDATE ||
          sorting === RecentUsageSortingMode.LATEST_VISIT
        ) {
          displayString = moment(value).format('D MMM YYYY');
        }
        return (
          <Row id={id}>
            <Col md={6}>
              <b>
                {user.firstName} {user.lastName}
              </b>
            </Col>
            <Col md={6}> {displayString}</Col>
          </Row>
        );
      })}
    </div>
  );
};

export default TLORecentUsage;
