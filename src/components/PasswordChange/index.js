import React, { Component } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { withFirebase } from '../Firebase';
import IconModal, { ICON_STATES } from '../IconModal';

const INITIAL_STATE = {
  password: '',
  confirmPassword: '',
  error: null,

  showModal: false,
  modalText: '',
  modalIcon: '',
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { password } = this.state;
    this.setState({
      showModal: true,
      modalText: 'Loading...',
      modalIcon: ICON_STATES.LOADING,
    });

    this.props.firebase
      .doPasswordUpdate(password)
      .then(() => {
        this.setState({
          ...INITIAL_STATE,
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
    this.setState({ showModal: false });
  };

  render() {
    const { password, confirmPassword, error, showModal, modalIcon, modalText } = this.state;

    const isInvalid = password !== confirmPassword || password === '';

    return (
      <Form onSubmit={this.onSubmit}>
        <IconModal
          show={showModal}
          text={modalText}
          icon={modalIcon}
          onExit={this.handleModalFinished}
        />
        
        <Form.Group style={{ textAlign: 'left' }}>
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            value={password}
            onChange={this.onChange}
            type="password"
          />
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
          Change Password
        </Button>
        {error && <p>{error.message}</p>}
      </Form>
    );
  }
}

export default withFirebase(PasswordChangeForm);
