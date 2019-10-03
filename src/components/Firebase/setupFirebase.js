import React from 'react';

import FirebaseContext from './context';
import Firebase from '.';

const setupFirebase = Component => props => {
  return (
    <FirebaseContext.Provider value={new Firebase()}>
      <Component {...props} />
    </FirebaseContext.Provider>
  );
};

export default setupFirebase;
