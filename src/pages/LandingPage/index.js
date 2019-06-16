import React from 'react';
import styles from './LandingPage.module.css';

const LandingPage = () => (
  <div>
    <span className={styles.bannerImg}>
      <div className={styles.centerInfo}>
        <h1>MAAME</h1>
        <h3>Maternal Health Management for Developing Nations</h3>
      </div>
    </span>
    <span className={styles.textBlock}>
      <p>
        Maame is a tech organization dedicated to improved health outcomes for mothers in rural
        areas of developing nations, such as Ghana and Uganda. We develop a maternal health app for
        both the iOS and Android platforms which allows community health workers in rural regions to
        keep track of patients and ensure they get the proper prenatal and postnatal visits during
        their pregnancies.
      </p>
      {/* TODO add more things here, like links to app and donations */}
    </span>
  </div>
);

export default LandingPage;
