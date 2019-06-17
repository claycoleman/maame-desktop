import React from "react";
import styles from "./AboutPage.module.css";
import motherBaby from "../../assets/images/mother_baby.JPG";
import twoMothers from "../../assets/images/two_mothers.jpg";
import ballardLogo from "../../assets/images/ballard_logo.png";
import ghanaHealth from "../../assets/images/ghana_health_service.png";
import allianceMedicine from "../../assets/images/alliance_medicine.png";

const AboutPage = () => (
  <div>
    <span className={styles.bannerImg}></span>
    <section className={styles.mainSection}>
      <span className={styles.textBlock}>
        <p>
          Maame is a tech organization dedicated to improved health outcomes for
          mothers in rural areas of developing nations, such as Ghana and
          Uganda. We develop a maternal health app for both the iOS and Android
          platforms which allows community health workers in rural regions to
          keep track of patients and ensure they get the proper prenatal and
          postnatal visits during their pregnancies.
        </p>
</span>
      <img src={motherBaby} className={styles.left}/>
      <span className={styles.right}>
      <br /><h2>Our Product</h2>
        <p>
          We developed a mobile application to connect CHWs with expectant mothers in rural areas. 
          Our mobile application provides software for CHWs to register pregnancies, 
          facilitate prenatal and postnatal care, and educate providers on potential complications during and after pregnancy. 
        </p><br />
        <a className={styles.button} href="">Learn More</a> 
      </span>
      <div className={styles.clear}></div><br /><br />
      <img src={twoMothers} className={styles.right}/>
      <span className={styles.left}>
      <br /><h2>Our Mission</h2>
        <p>
          Our mission is to improve access to prenatal and postnatal care through
          a mobile application.
        </p><br />
        <a className={styles.button} href="https://www.who.int/news-room/fact-sheets/detail/maternal-mortality">Learn More</a> 
      </span>
    </section><br />
    <div style={{margin: "65px 0"}} className={styles.clear}></div><br /><br />
    <section className={styles.links}>
        <a><img src={ballardLogo}/>Ballard Center for Economic Self-Reliance</a>
        <a><img src={ghanaHealth}/>Ghana Health Services</a>
        <a><img src={allianceMedicine}/>Alliance for International Medicine</a>
    </section>
  </div>
);

export default AboutPage;
