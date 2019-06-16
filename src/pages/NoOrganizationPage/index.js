import React from 'react';
import { withBasicAuthorization, organizationAuthCondition } from '../../components/Session';

// TODO on snapshot of the organizations, see if now an organization has them
const NoOrganizationPage = () => (
  <div>
    <h1>Home Page!</h1>
  </div>
);

export default withBasicAuthorization(NoOrganizationPage);
