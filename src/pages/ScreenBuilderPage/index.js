import React from 'react';
import ScreenBuilder from '../../components/ScreenBuilder';
import { withTLOAdminAuthorization } from '../../components/Session';
import BasePage from '..';
import { CONTAINER_WIDTHS } from '../../constants/values';

const ScreenBuilderPage = () =>
  BasePage('Flow Builder', <ScreenBuilder />, { width: CONTAINER_WIDTHS.WIDE });

export default withTLOAdminAuthorization(ScreenBuilderPage);
