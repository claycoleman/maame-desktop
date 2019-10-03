import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { RegisterLink } from '../RegisterPage';
import { withFirebase } from '../../components/Firebase';
import * as ROUTES from '../../constants/routes';
import { PasswordForgetLink } from '../PasswordForgetPage';
import IconModal, { ICON_STATES } from '../../components/IconModal';
import BasePage from '..';
import { MODAL_TIMEOUT_LENGTH } from '../../constants/values';

const LoginPage = () =>
  BasePage(
    'Portal Sign In',
    <>
      <LoginForm />
      <hr />
      <PasswordForgetLink />
      <RegisterLink />
    </>,
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

  render() {
    const { email, password, error, showModal, modalText, modalIcon } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <Form style={{ display: 'block' }} onSubmit={this.onSubmit}>
        <IconModal
          show={showModal}
          text={modalText}
          icon={modalIcon}
          onExit={this.handleModalFinished}
        />
        <Form.Group style={{ textAlign: 'left' }}>
          <Form.Label>Email</Form.Label>
          <Form.Control name="email" value={email} onChange={this.onChange} type="text" />
        </Form.Group>
        <Form.Group style={{ textAlign: 'left' }}>
          <Form.Label>Password</Form.Label>
          <Form.Control name="password" value={password} onChange={this.onChange} type="password" />
        </Form.Group>
        <Button disabled={isInvalid || showModal} type="submit">
          Sign in
        </Button>

        {error && (
          <p style={{ color: 'red', marginTop: '1rem', marginBottom: 0 }}>{error.message}</p>
        )}
      </Form>
    );
  }
}

const LoginForm = compose(
  withRouter,
  withFirebase,
)(_LoginForm);

const LoginLink = ({ customText }) =>
  customText ? (
    <p>
      <Link to={ROUTES.LOGIN}>{customText}</Link>
    </p>
  ) : (
    <p>
      Already have an account? <Link to={ROUTES.LOGIN}>Log In</Link>
    </p>
  );

export default LoginPage;

export { LoginForm, LoginLink };
