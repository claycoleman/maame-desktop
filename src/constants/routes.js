/* PUBLIC PAGES */
export const LANDING = '/';
export const LOGIN = '/signin';
export const REGISTER = '/signup';
export const PASSWORD_FORGET = '/pw-forget';
export const ABOUT = '/about';
export const DONATIONS = '/donations';
export const LOST = '/lost';

/* NO ORG PAGES */
export const NO_ORGANIZATION = '/no-organization';

/* AUTHED PAGES */
export const HOME = '/dashboard';
export const ACCOUNT = '/account';

/* COMMUNITY PAGES */
export const ANALYTICS = '/analytics';
export const RECENT_USAGE = '/recent-usage';

/* SUB DISTRICT PAGES */
export const MANAGE_USERS_BASE = '/manage-users/';
export const MANAGE_USERS = `${MANAGE_USERS_BASE}:orgId?`; // orgId will be passed when entering as a top level admin

/* DISTRICT PAGES */
export const MANAGE_ORGANIZATIONS = '/manage-orgs';
export const FLOW_CUSTOMIZER = '/flows';
export const SCREEN_BUILDER = '/flows/screen-builder/:screenId';

/* ADMIN PAGES */
export const ADMIN = '/admin';
