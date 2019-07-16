import React from 'react';
import { Link } from 'react-router-dom';
import { MdArrowForward, MdArrowBack } from 'react-icons/md';
import styles from './ButtonLink.module.scss';

const ButtonLink = ({ text, to, href, onClick, back = false, noArrow = false }) => {
  const body = [text];
  const linkClasses = [styles.button];

  if (!noArrow) {
    if (back) {
      body.unshift(<MdArrowBack className={styles.icon} color="white" size={20} />);
      linkClasses.push(styles.back);
    } else {
      body.push(<MdArrowForward className={styles.icon} color="white" size={20} />);
      linkClasses.push(styles.forward);
    }
  }

  const linkClassName = linkClasses.join(' ');
  if (to) {
    return (
      <Link className={linkClassName} to={to}>
        {body}
      </Link>
    );
  } else if (href) {
    return (
      <a className={linkClassName} target="_blank" rel="noopener noreferrer" href={href}>
        {body}
      </a>
    );
  } else if (onClick) {
    return (
      <a
        className={linkClassName}
        target="_blank"
        rel="noopener noreferrer"
        href="#"
        onClick={e => {
          e.preventDefault();
          onClick();
        }}
      >
        {body}
      </a>
    );
  }
};

export default ButtonLink;
