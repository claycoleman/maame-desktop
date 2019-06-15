import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../../components/Firebase';
import * as ROUTES from '../../constants/routes';
import { validateEmail } from '../../modules/helpers';

const PasswordForgetPage = () => (
  <div>
    <h1>PasswordForget</h1>
    <PasswordForgetForm />
  </div>
);

const INITIAL_STATE = {
  email: '',
  error: null,

  showModal: false,
  modalText: '',
  modalIcon: '',
};

class _PasswordForgetForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.shouldExecuteCallback = false;
  }

  onSubmit = event => {
    const { email } = this.state;
    this.setState({
      showModal: true,
      modalText: 'Loading...',
      modalIcon: 'loading',
    });

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({
          ...INITIAL_STATE,
          modalText: 'Password Changed!',
          modalIcon: 'success',
        });
      })
      .catch(error => {
        this.setState({ error, modalText: 'Password Change Failed...', modalIcon: 'error' });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleModalFinished = () => {
    // we should just hide the modal after it's done
    this.setState({ showModal: false });
  };

  render() {
    const { email, error, showModal, modalIcon, modalText } = this.state;

    const isInvalid = email === '' || !validateEmail(email);

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
          value={this.state.email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <button disabled={isInvalid} type="submit">
          Reset My Password
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(_PasswordForgetForm);

export { PasswordForgetForm, PasswordForgetLink };
