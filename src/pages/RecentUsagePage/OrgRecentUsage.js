import React, { useContext, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BounceLoader } from 'react-spinners';
import { useTable, useSortBy } from 'react-table';
import Table from 'react-bootstrap/Table';

import useRecentUsage from './useRecentUsage';
import RecentUsageTable from './RecentUsageTable';
import moment from 'moment';
import { useOrganization } from '../../components/Firebase';

function formatDate({ cell: { value } }) {
  return moment(value).format('D MMM YYYY');
}

const OrgRecentUsage = ({ authUser }) => {
  const [, organization] = useOrganization(authUser ? authUser.organizationId : null);

  const [recentUsage, loading, noResponse] = useRecentUsage(
    authUser.organizationId,
    'organizationId',
  );

  return loading ? (
    <div
      style={{ display: 'flex', width: '100%', alignContent: 'center', justifyContent: 'center' }}
    >
      <BounceLoader sizeUnit={'px'} size={135} color={'#c00'} loading={true} />
    </div>
  ) : (
    <div>
      <h4>
        Data for {organization.name} Sub-District
      </h4>
      <RecentUsageTable recentUsage={recentUsage} loading={loading} />
    </div>
  );
};

export default OrgRecentUsage;
