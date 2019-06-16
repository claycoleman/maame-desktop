import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../../components/Firebase';
import * as ROUTES from '../../constants/routes';
import { validateEmail } from '../../modules/helpers';
import { LoginLink } from '../LoginPage';
import IconModal, { ICON_STATES } from '../../components/IconModal';

const RegisterPage = () => (
  <div>
    <h1>Sign Up</h1>
    <RegisterForm />
    <LoginLink />
  </div>
);

const INITIAL_STATE = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  error: null,
};

class _RegisterForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { firstName, lastName, email, password } = this.state;
    this.setState({
      showModal: true,
      modalText: 'Loading...',
      modalIcon: ICON_STATES.LOADING,
    });

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set(
          {
            id: authUser.uid,
            userId: authUser.uid,
            firstName,
            lastName,
            email,
            isAdmin: false, // manually add admins in the Firebase console
          },
          { merge: true },
        );
      })
      .then(authUser => {
        this.setState({
          modalText: 'Registered!',
          modalIcon: ICON_STATES.SUCCESS,
        });
      })
      .catch(error => {
        this.setState({ error, modalText: 'Uh oh...', modalIcon: ICON_STATES.ERROR });
      });

    event.preventDefault();
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

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      error,
      showModal,
      modalText,
      modalIcon,
    } = this.state;

    const isInvalid =
      password !== confirmPassword ||
      password === '' ||
      email === '' ||
      !validateEmail(email) ||
      firstName === '';
    return (
      <form onSubmit={this.onSubmit}>
        <IconModal
          show={showModal}
          text={modalText}
          icon={modalIcon}
          onExit={this.handleModalFinished}
        />
        <input
          name="firstName"
          value={firstName}
          onChange={this.onChange}
          type="text"
          placeholder="First Name"
        />
        <input
          name="lastName"
          value={lastName}
          onChange={this.onChange}
          type="text"
          placeholder="Last Name"
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
        <input
          name="confirmPassword"
          value={confirmPassword}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm Password"
        />
        <button disabled={isInvalid || showModal} type="submit">
          Sign Up
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const RegisterForm = compose(
  withRouter,
  withFirebase,
)(_RegisterForm);

const RegisterLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.REGISTER}>Sign Up</Link>
  </p>
);

export default RegisterPage;

export { RegisterForm, RegisterLink };
