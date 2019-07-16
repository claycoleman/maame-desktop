import React from 'react';
import { Link } from 'react-router-dom';
import { MdArrowForward } from 'react-icons/md';
import styles from './ButtonLinks.module.css';
import ButtonLink from '../ButtonLink';

const ButtonLinks = ({ button, buttons, style = {} }) => {
  // each button should be { text, to }
  const formattedButtons = buttons && Array.isArray(buttons) ? buttons : [button];
  return (
    <div className={styles.flexRow} style={style}>
      {formattedButtons.map(buttonItem => (
        <ButtonLink {...buttonItem} />
      ))}
    </div>
  );
};

export default ButtonLinks;
