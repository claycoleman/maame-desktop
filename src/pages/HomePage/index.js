import React from 'react';
import { withOrganizationAuthorization } from '../../components/Session';

const HomePage = () => (
  <div>
    <h1>Home Page!</h1>
  </div>
);

export default withOrganizationAuthorization(HomePage);
