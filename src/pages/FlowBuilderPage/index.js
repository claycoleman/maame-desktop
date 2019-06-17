import React, { Component } from 'react';
import FlowBuilder from '../../components/FlowBuilder';
import { withAdminAuthorization } from '../../components/Session';
import BasePage from '..';

const FlowBuilderPage = () => BasePage('Flow Builder', <FlowBuilder />);

export default withAdminAuthorization(FlowBuilderPage);
