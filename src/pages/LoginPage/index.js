import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';

import { RegisterLink } from '../RegisterPage';
import { withFirebase } from '../../components/Firebase';
import * as ROUTES from '../../constants/routes';
import { PasswordForgetLink } from '../PasswordForgetPage';
import IconModal, { ICON_STATES } from '../../components/IconModal';

const LoginPage = () => (
  <div>
    <h1>Log In</h1>
    <LoginForm />
    <PasswordForgetLink />
    <RegisterLink />
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class _LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;
    this.setState({
      showModal: true,
      modalText: 'Loading...',
      modalIcon: ICON_STATES.LOADING,
    });

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({
          modalText: 'Logged in!',
          modalIcon: ICON_STATES.SUCCESS,
        });
      })
      .catch(error => {
        this.setState({ error, modalText: 'Uh oh...', modalIcon: ICON_STATES.ERROR });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleModalFinished = () => {
    // we should hide the modal after it's done
    this.setState({
      ...INITIAL_STATE,
      showModal: false,
    });
    setTimeout(() => {
      if (this.state.modalIcon === ICON_STATES.SUCCESS) {
        // redirect home
        this.props.history.push(ROUTES.HOME);
      }
    }, 350);
  };

  render() {
    const { email, password, error, showModal, modalText, modalIcon } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <IconModal
          show={showModal}
          text={modalText}
          icon={modalIcon}
          onExit={this.handleModalFinished}
        />
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <input
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <button disabled={isInvalid || showModal} type="submit">
          Sign In
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const LoginForm = compose(
  withRouter,
  withFirebase,
)(_LoginForm);

const LoginLink = () => (
  <p>
    Already have an account? <Link to={ROUTES.LOGIN}>Log In</Link>
  </p>
);

export default LoginPage;

export { LoginForm, LoginLink };
