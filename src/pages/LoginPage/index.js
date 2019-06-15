import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { RegisterLink } from '../RegisterPage';
import { withFirebase } from '../../components/Firebase';
import * as ROUTES from '../../constants/routes';
import { PasswordForgetLink } from '../PasswordForgetPage';

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

    this.props.firebase
      .doLoginWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <form onSubmit={this.onSubmit}>
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
        <button disabled={isInvalid} type="submit">
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
