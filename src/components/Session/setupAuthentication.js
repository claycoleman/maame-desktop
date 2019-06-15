import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const setupAuthentication = Component => {
  // TODO figure out how to convert this class component into a useState
  // and useEffect functional component. don't know how to mimic componentDidMount
  // with hooks
  class SetupAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        authUser ? this.setState({ authUser }) : this.setState({ authUser: null });
      });
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(SetupAuthentication);
};

export default setupAuthentication;
