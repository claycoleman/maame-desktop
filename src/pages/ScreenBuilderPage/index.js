import React from 'react';
import ScreenBuilder from '../../components/ScreenBuilder';
import { withAdminAuthorization } from '../../components/Session';
import BasePage from '..';
import { CONTAINER_WIDTHS } from '../../constants/values';

const ScreenBuilderPage = () => BasePage('Flow Builder', <ScreenBuilder />, CONTAINER_WIDTHS.WIDE);

export default withAdminAuthorization(ScreenBuilderPage);
