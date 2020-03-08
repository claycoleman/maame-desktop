import React from 'react';
import { BounceLoader } from 'react-spinners';
import moment from 'moment';

import useRecentUsage from './useRecentUsage';
import RecentUsageTable from './RecentUsageTable';
import { useTopLevelOrganization } from '../../components/Firebase';

function formatDate({ cell: { value } }) {
  return moment(value).format('D MMM YYYY');
}

const TLORecentUsage = ({ authUser }) => {
  // _loading,
  const [tloLoading, topLevelOrganization] = useTopLevelOrganization(
    authUser ? authUser.topLevelOrganizationId : null,
  );
  const [recentUsage, loading, noResponse] = useRecentUsage(
    authUser.topLevelOrganizationId,
    'topLevelOrganizationId',
  );

  return loading || tloLoading ? (
    <div
      style={{ display: 'flex', width: '100%', alignContent: 'center', justifyContent: 'center' }}
    >
      <BounceLoader sizeUnit={'px'} size={135} color={'#c00'} loading={true} />
    </div>
  ) : (
    <div>
      <h4>Data for {topLevelOrganization.name} District</h4>
      <RecentUsageTable recentUsage={recentUsage} loading={loading || tloLoading} />
    </div>
  );
};

export default TLORecentUsage;
