import FirebaseContext, { withFirebase } from './context';
import Firebase from './firebase';
import {
  useTLOVisitFlows,
  useTopLevelOrganization,
  useOrganization,
  useTLOScreens,
  useOrganizationsFromTLO,
} from './hooks';
import setupFirebase from './setupFirebase';

export default Firebase;

export {
  FirebaseContext,
  withFirebase,
  useTLOVisitFlows,
  useTopLevelOrganization,
  useTLOScreens,
  useOrganizationsFromTLO,
  setupFirebase,
  useOrganization,
};
