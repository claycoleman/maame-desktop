import React from 'react';
import { MdArrowForward } from 'react-icons/md';

import styles from './LandingPage.module.css';

import twoMothers from '../../assets/images/two_mothers.jpg';
import ballardLogo from '../../assets/images/ballard_logo.png';
import ghanaHealth from '../../assets/images/ghana_health_service.png';
import allianceMedicine from '../../assets/images/alliance_medicine.png';

import clay from '../../assets/images/clay.png';
import heather from '../../assets/images/heather.png';
import naomi from '../../assets/images/naomi.png';
import olivia from '../../assets/images/olivia.png';

const LandingPage = () => (
  <div className={styles.landingContainer}>
    <span className={styles.bannerImg}>
      <h1 className={styles.newLocationText}>Maternal health tools for&nbsp;developing nations</h1>
    </span>
    <span className={styles.textBlock}>
      <h2>Maame aims to reduce maternal mortality in rural communities</h2>
      <p>
        Our maternal health app allows community health workers to better monitor and follow up with
        patients, ensuring mothers get the proper prenatal and postnatal care during their
        pregnancies.
      </p>
    </span>
    <img className={styles.middleImg} src={twoMothers} />
    <span className={[styles.textBlock, styles.textBlockDark].join(' ')}>
      <h2>The Maame app</h2>
      <p>
        Architected from the ground up to have full offline capabilities, our cross-platform app
        offers patient management, automatic visit scheduling, guided visit flows, and information
        around key warning signs and symptoms.
      </p>
      <div className={styles.buttonsContainer}>
        <a
          className={styles.button}
          target="_blank"
          rel="noopener noreferrer"
          href="https://play.google.com/store/apps/details?id=com.maame.nurses"
        >
          View on Google&nbsp;Play
          <MdArrowForward className={styles.icon} color="white" size={20} />
        </a>
        <a
          className={styles.button}
          target="_blank"
          rel="noopener noreferrer"
          href="https://apps.apple.com/us/app/maame/id1464122939"
        >
          View on App&nbsp;Store
          <MdArrowForward className={styles.icon} color="white" size={20} />
        </a>
      </div>
    </span>
    <span className={styles.textBlock}>
      <h2>Our partners</h2>
      <section className={styles.links}>
        <a target="_blank" href="https://marriottschool.byu.edu/ballard/" rel="noopener noreferrer">
          <img src={ballardLogo} />
          Ballard Center for Economic Self-Reliance
        </a>
        <a target="_blank" href="http://www.ghanahealthservice.org" rel="noopener noreferrer">
          <img src={ghanaHealth} />
          Ghana Health Services
        </a>
        <a target="_blank" href="http://www.allianceinmedicine.org" rel="noopener noreferrer">
          <img src={allianceMedicine} />
          Alliance for International Medicine
        </a>
      </section>
    </span>
    <span className={[styles.textBlock, styles.textBlockDark].join(' ')}>
      <h2>Our team</h2>
      <section className={styles.team}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.linkedin.com/in/jclaytoncoleman/"
        >
          <img src={clay} />
          Clay Coleman
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.linkedin.com/in/heather-lehnardt/"
        >
          <img src={heather} />
          Heather Lehnardt
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.linkedin.com/in/naomi-rhondeau-0b5231162/"
        >
          <img src={naomi} />
          Naomi Rhondeau
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.linkedin.com/in/olivia-tuttle-7563aa109/"
        >
          <img src={olivia} />
          Olivia Tuttle
        </a>
      </section>
    </span>
    <span className={styles.textBlock}>
      <h2>Interested?</h2>
      <p>
        Our solutions are currently being deployed in Ghana and Uganda. We're looking for other
        organizations to pilot and implement the Maame app in other regions of the developing world.
        Reach out if you'd like to get more information about how Maame can help you make an impact
        in your area.
      </p>
      <div className={styles.buttonsContainer}>
        <a
          className={styles.button}
          target="_blank"
          rel="noopener noreferrer"
          href="mailto:aob.maame@gmail.com"
        >
          Contact us
          <MdArrowForward className={styles.icon} color="white" size={20} />
        </a>
      </div>
    </span>
  </div>
);

export default LandingPage;
