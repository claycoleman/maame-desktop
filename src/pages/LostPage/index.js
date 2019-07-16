import React, { useState, useRef, useContext } from 'react';
import { MdArrowForward } from 'react-icons/md';

import styles from '../LandingPage/LandingPage.module.css';
import { AuthUserContext } from '../../components/Session';
import * as ROUTES from '../../constants/routes';

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

const LostPage = () => {
  const potentialSongs = useRef(null);
  if (!potentialSongs.current) {
    potentialSongs.current = [
      'https://open.spotify.com/track/3fifIvoXVoY0l51vAcQAHw?si=4JavVacQQbelyJDiW7PRGQ',
      'https://open.spotify.com/track/1STAWoWHYJh2UVUx41pYMD?si=UwiUYovHSWGfbPNgkB7GqA',
      'https://open.spotify.com/track/7lFdAhKhZs5lpjAVX8OzIj?si=jz-OT0NwS12FwBOwErfHTg',
      'https://open.spotify.com/track/1RNtm45kw0hPMBz7gKiIYu?si=Z693dTKJTESDm3YCHeHq2w',
      'https://open.spotify.com/track/5u4mGGNNVOZFJ9SmS4GYzG?si=Zn-Pfv86Q2yMEo6bdmQ-_Q',
      'https://open.spotify.com/track/4t8bZ8dxZtatpjOpBrAnUW?si=8tO4cQhlQEyT9e0heN_pLA',
    ];
    shuffle(potentialSongs.current);
  }

  const [songIndex, setSongIndex] = useState(0);
  const authUser = useContext(AuthUserContext);

  return (
    <div className={[styles.landingContainer].join(' ')}>
      <div className={styles.centerInfo}>
        <span className={styles.textBlock}>
          <h2>You're lost.</h2>
          <div className={[styles.center].join(' ')}>
            <a
              className={styles.button}
              style={{ marginLeft: 16 }}
              href={authUser ? ROUTES.HOME : ROUTES.LANDING}
            >
              Back to home
              <MdArrowForward className={styles.icon} color="white" size={20} />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setSongIndex((songIndex + 1) % potentialSongs.current.length);
                return true;
              }}
              className={[styles.button, styles.hiddenButton].join(' ')}
              style={{ marginLeft: 16 }}
              href={potentialSongs.current[songIndex]}
            >
              A song for your troubles
              <MdArrowForward className={styles.icon} color="white" size={20} />
            </a>
          </div>
        </span>
      </div>
    </div>
  );
};

export default LostPage;
