import React from 'react';
import styles from './LandingPage.module.css';

const LandingPage = () => (
  <div className={styles.landingContainer}>
    <span className={styles.bannerImg}>
      <h1 className={styles.newLocationText}>Maternal health tools for&nbsp;developing nations</h1>
    </span>
    <span className={styles.textBlock}>
      <h2>Maame aims to reduce maternal mortality in rural communities</h2>
      <p>
        Our maternal health app for both the iOS and Android platforms allows community health
        workers in rural regions to keep track of patients and ensure they get the proper prenatal
        and postnatal visits during their pregnancies.
      </p>
    </span>
    <span className={styles.textBlock}>
      <h2>Our Team</h2>
      <p>Add team info and photos darker background</p>
    </span>
    <span className={styles.textBlock}>
      <h2>Our Partners</h2>
      <p>Pics Asia made with those partners</p>
    </span>
  </div>
);

export default LandingPage;
