import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { withFirebase } from '../../components/Firebase';
import * as ROUTES from '../../constants/routes';
import { validateEmail } from '../../modules/helpers';
import { LoginLink } from '../LoginPage';
import IconModal, { ICON_STATES } from '../../components/IconModal';
import BasePage from '..';
import { MODAL_TIMEOUT_LENGTH } from '../../constants/values';

const RegisterPage = () =>
  BasePage(
    'Portal Sign Up',
    <>
      <RegisterForm />
      <hr />
      <LoginLink />
    </>,
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
        console.log(authUser);
        console.log(authUser.user);
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set(
          {
            id: authUser.user.uid,
            userId: authUser.user.uid,
            firstName,
            lastName,
            email,
            organizationId: null,
            isOrgAdmin: false, // manually add admins in the Firebase console
            isTLOAdmin: false, // manually add admins in the Firebase console
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
    const wasSucccessful = this.state.modalIcon === ICON_STATES.SUCCESS;
    this.setState({
      ...(wasSucccessful ? INITIAL_STATE : {}),
      showModal: false,
    });
    setTimeout(() => {
      if (wasSucccessful) {
        // redirect home
        this.props.history.push(ROUTES.HOME);
      }
    }, MODAL_TIMEOUT_LENGTH);
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
      <Form onSubmit={this.onSubmit}>
        <IconModal
          show={showModal}
          text={modalText}
          icon={modalIcon}
          onExit={this.handleModalFinished}
        />
        <Form.Group style={{ textAlign: 'left' }}>
          <Form.Label>First Name</Form.Label>
          <Form.Control name="firstName" value={firstName} onChange={this.onChange} type="text" />
        </Form.Group>
        <Form.Group style={{ textAlign: 'left' }}>
          <Form.Label>Last Name</Form.Label>
          <Form.Control name="lastName" value={lastName} onChange={this.onChange} type="text" />
        </Form.Group>
        <Form.Group style={{ textAlign: 'left' }}>
          <Form.Label>Email Address</Form.Label>
          <Form.Control name="email" value={email} onChange={this.onChange} type="text" />
        </Form.Group>
        <Form.Group style={{ textAlign: 'left' }}>
          <Form.Label>Password</Form.Label>
          <Form.Control name="password" value={password} onChange={this.onChange} type="password" />
        </Form.Group>
        <Form.Group style={{ textAlign: 'left' }}>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            name="confirmPassword"
            value={confirmPassword}
            onChange={this.onChange}
            type="password"
          />
        </Form.Group>
        <Button disabled={isInvalid || showModal} type="submit">
          Sign up
        </Button>

        {error && (
          <p style={{ color: 'red', marginTop: '1rem', marginBottom: 0 }}>{error.message}</p>
        )}
      </Form>
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
