import React from 'react';
import { withOrganizationAuthorization } from '../../components/Session';
import BasePage from '..';

const HomePage = () => BasePage(
  "Dashboard",
  <>
    <h3>TODO Mimic the app's dashboard page</h3>
  </>
);

export default withOrganizationAuthorization(HomePage);
