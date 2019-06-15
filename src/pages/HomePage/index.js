import React from 'react';
import { withBasicAuthorization } from '../../components/Session';

const HomePage = () => (
  <div>
    <h1>HomePage</h1>
  </div>
);

export default withBasicAuthorization(HomePage);
