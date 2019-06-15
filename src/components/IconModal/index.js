import React from 'react';
import styles from './styles.css';
import { CSSTransition } from 'react-transition-group';
import { MdClear, MdInfoOutline, MdCheck } from 'react-icons/lib/md';

export default class IconModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    let icon;
    switch (this.props.icon) {
      case 'loading':
        // TODO add loading spinner
        icon = <MdClear className="icon" color="white" size={90} />;
        break;
      case 'error':
        icon = <MdClear className="icon" color="white" size={90} />;
        break;
      case 'alert':
        icon = <MdInfoOutline className="icon" color="white" size={90} />;
        break;
      case 'success':
      default:
        icon = <MdCheck className="icon" color="white" size={90} />;
        break;
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
          setTimeout(() => {
            // if hideModal is provided, just hide the modal; else, 
            this.props.onExit(this.props.onExitParams);
          }, 1250);
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
