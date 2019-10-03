import React, { useContext } from 'react';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { FirebaseContext } from '../Firebase';
import { orgListenerKey, tloListenerKey, tloOrgsListenerKey } from './helpers';

const initialState = {
  cachedListeners: {},

  topLevelOrganization: null,
  organizations: {},

  hasAllTLOOrganizations: false,

  users: {},

  cachedStatsQueries: {},
};

function reducer(state = initialState, action) {
  const updateStoreWith = updatedState => {
    return Object.assign({}, state, updatedState);
  };

  switch (action.type) {
    case 'RESET_STORE':
      for (const key in state.cachedListeners) {
        if (state.cachedListeners.hasOwnProperty(key)) {
          state.cachedListeners[key]();
        }
      }
      return initialState;

    case 'SET_TOP_LEVEL_ORGANIZATION':
      return updateStoreWith({
        topLevelOrganization: action.topLevelOrganization,
      });

    case 'SET_TLO_ORGS':
      const topLevelOrganization = Object.assign({}, state.topLevelOrganization);
      topLevelOrganization.organizations = action.tloOrgs;
      return updateStoreWith({
        topLevelOrganization,
      });

    case 'SET_ALL_ORGANIZATIONS':
      return updateStoreWith({
        organizations: action.organizations,
        hasAllTLOOrganizations: true,
      });

    case 'ADD_ORGANIZATION':
      const newOrganizations = {
        ...state.organizations,
      };
      newOrganizations[action.organization.id] = action.organization;
      return updateStoreWith({
        organizations: newOrganizations,
      });

    case 'FETCH_TOP_LEVEL_ORGANIZATION': {
      // we already have a listener for that org
      const listenerId = tloListenerKey(action.topLevelOrganizationId);
      if (state.cachedListeners[listenerId]) {
        return state;
      }
      const listeners = {
        ...state.cachedListeners,
      };
      listeners[listenerId] = action.unsubscriber;
      return updateStoreWith({
        cachedListeners: listeners,
      });
    }

    case 'FETCH_TLO_ORGS': {
      // we already have a listener for that org
      const listenerId = tloOrgsListenerKey(action.topLevelOrganizationId);
      if (state.cachedListeners[listenerId]) {
        return state;
      }
      const listeners = {
        ...state.cachedListeners,
      };
      listeners[listenerId] = action.unsubscriber;
      return updateStoreWith({
        cachedListeners: listeners,
      });
    }

    case 'FETCH_ORGANIZATION': {
      // we already have a listener for that org
      const listenerId = orgListenerKey(action.organizationId);
      if (state.cachedListeners[listenerId]) {
        return state;
      }
      const newListeners = {
        ...state.cachedListeners,
      };
      newListeners[listenerId] = action.unsubscriber;
      return updateStoreWith({
        cachedListeners: newListeners,
      });
    }

    case 'ADD_USER':
      const newUsers = {
        ...state.users,
      };
      newUsers[action.user.email] = action.user;
      return updateStoreWith({
        users: newUsers,
      });

    case 'CACHE_STATS_QUERY':
      const newCache = {
        ...state.cachedStatsQueries,
      };
      newCache[action.key] = action.data;
      return updateStoreWith({
        cachedStatsQueries: newCache,
      });

    default:
      return state;
  }
}

const store = createStore(reducer);

const setupStore = Component => props => {
  return (
    <Provider store={store}>
      <Component {...props} />
    </Provider>
  );
};

export default setupStore;
