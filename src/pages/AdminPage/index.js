import React from 'react';

import { withTLOAdminAuthorization } from '../../components/Session';
import BasePage from '..';

const AdminPage = () =>
  BasePage(
    'Admin View',
    <>
      <h3>Add users to organizations here?</h3>
      <h3>Make users admins here?</h3>
    </>,
  );

export default withTLOAdminAuthorization(AdminPage);
