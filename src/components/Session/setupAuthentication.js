import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const setupAuthentication = Component => {
  class SetupAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        authUser => this.setState({ authUser }),
        () => this.setState({ authUser: null }),
      );
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
