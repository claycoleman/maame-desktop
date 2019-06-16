import React from 'react';
import { withBasicAuthorization, organizationAuthCondition } from '../../components/Session';

// TODO on snapshot of the organizations, see if now an organization has them
const NoOrganizationPage = () => (
  <div>
    <h1>No Organization Page!</h1>
    {/* TODO import the same page that we have in the app */}
  </div>
);

export default withBasicAuthorization(NoOrganizationPage);
