import React from 'react';
import Firebase from './firebase';

const FirebaseContext = React.createContext(null);

export const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);

export const setupFirebase = Component => (
  <FirebaseContext.Provider value={new Firebase()}>
    <Component {...this.props} />
  </FirebaseContext.Provider>
);

export default FirebaseContext;
