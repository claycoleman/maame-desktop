import React, { Component } from 'react';
import styles from './IconModal.module.css';
import { CSSTransition } from 'react-transition-group';
import { MdClear, MdInfoOutline, MdCheck } from 'react-icons/md';

import { css } from '@emotion/core';
// First way to import
import { BounceLoader } from 'react-spinners';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export const ICON_STATES = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  ALERT: 'alert',
};

export default class IconModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previouslyLoading: false,
      exitTimeoutStarted: false,
    };
  }

  componentDidMount() {}

  startExitTimeout = () => {
    this.setState({ exitTimeoutStarted: true }, () => {
      setTimeout(() => {
        // if hideModal is provided, just hide the modal; else,
        this.props.onExit(this.props.onExitParams);
      }, 1250);
    });
  };

  render() {
    const { previouslyLoading, exitTimeoutStarted } = this.state;
    let icon;
    switch (this.props.icon) {
      case ICON_STATES.LOADING:
        icon = (
          <div style={{ paddingTop: 6 }}>
            <BounceLoader css={override} sizeUnit={'px'} size={84} color={'white'} loading={true} />
          </div>
        );
        break;
      case ICON_STATES.ERROR:
        icon = <MdClear className="icon" color="white" size={90} />;
        break;
      case ICON_STATES.ALERT:
        icon = <MdInfoOutline className="icon" color="white" size={90} />;
        break;
      case ICON_STATES.SUCCESS:
      default:
        icon = <MdCheck className="icon" color="white" size={90} />;
        break;
    }
    if (this.props.icon !== ICON_STATES.LOADING && previouslyLoading && !exitTimeoutStarted) {
      // icon switched away from loading, and we haven't started the timeout yet
      this.startExitTimeout();
    }
    return (
      <CSSTransition
        in={this.props.show}
        timeout={{
          enter: 250,
          exit: 150,
        }}
        classNames={{
          enter: styles.modalEnter,
          enterActive: styles.modalEnterActive,
          exit: styles.modalExit,
          exitActive: styles.modalExitActive,
        }}
        onEntered={() => {
          if (this.props.icon === ICON_STATES.LOADING) {
            // don't exit if loading
            this.setState({ previouslyLoading: true });
          } else {
            this.startExitTimeout();
          }
        }}
        unmountOnExit
      >
        {state => (
          <div className={styles.modal}>
            <CSSTransition
              in={state === 'entered'}
              timeout={{
                enter: 175,
                exit: 150,
              }}
              classNames={{
                enter: styles.iconEnter,
                enterActive: styles.iconEnterActive,
                exit: styles.iconExit,
                exitActive: styles.iconExitActive,
              }}
              unmountOnExit
            >
              <div className={styles.modalIconBox}>
                {icon}
                <span className={styles.modalText}>{this.props.text}</span>
              </div>
            </CSSTransition>
          </div>
        )}
      </CSSTransition>
    );
  }
}
