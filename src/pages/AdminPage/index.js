import React from 'react';

import { withAdminAuthorization } from '../../components/Session';

const AdminPage = () => (
  <div>
    <h1>AdminPage</h1>
  </div>
);

export default withAdminAuthorization(AdminPage);
