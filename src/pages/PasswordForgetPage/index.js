import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../../components/Firebase';
import * as ROUTES from '../../constants/routes';
import { validateEmail } from '../../modules/helpers';
import IconModal, { ICON_STATES } from '../../components/IconModal';

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
      modalIcon: ICON_STATES.LOADING,
    });

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({
          modalText: 'Reset password sent!',
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
    // we should just hide the modal after it's done
    this.setState({
      ...INITIAL_STATE,
      showModal: false,
    });
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
        <button disabled={isInvalid || showModal} type="submit">
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
