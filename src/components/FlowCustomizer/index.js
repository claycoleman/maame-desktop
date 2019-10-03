import React, { useState, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast';
import { useTLOVisitFlows, useTLOScreens, FirebaseContext } from '../Firebase';
import { BounceLoader } from 'react-spinners';

import styles from './FlowCustomizer.module.css';


import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../ScreenBuilder/carousel.css';
import { Carousel } from 'react-responsive-carousel';

const ScreenItem = ({ screen, toggleScreenToVisitFlow }) => {
  return (
    <p className={styles.screenItem} onClick={() => toggleScreenToVisitFlow(screen)}>
      {screen.title}
    </p>
  );
};
/*
TODOs

style screens list to make it look like a set of screens
add new screen
open screen in editor
save screen upon close editor
drag and drop order of screens for visitFlow

style visitFlow screen list to look like a list
add text that says "you have no screens for this visit flow"
add new visitFlow

maksure you use the right authorization on the screens that need it

*/
const FlowCustomizer = ({ topLevelOrganization }) => {
  const [currentVisitFlowIndex, setCurrentVisitFlowIndex] = useState(0);
  const [_visitFlowsError, visitFlowsLoading, visitFlows] = useTLOVisitFlows(topLevelOrganization);
  const [_screensError, screensLoading, screens] = useTLOScreens(topLevelOrganization);

  const [saved, setSaved] = useState(false);
  const [toastText, setToastText] = useState('');
  const [_loading, setLoading] = useState(false);

  /*
  {
    title: 'Weight, Height, and BMI',
    components: [
      {
        type: 'number',
        name: 'Weight',
        unit: 'kg',
      },
      {
        type: 'number',
        name: 'Height',
        unit: 'cm',
      },
      {
        type: 'html',
        body:
          '<p>The current weight and height will determine BMI, which provides an estimate of how much weight gain is recommended during pregnancy.</p>',
      },
      {
        type: 'derived',
        name: 'BMI',
        dependencies: {
          formula: 'Weight / ( (Height / 100) ^ 2)',
          fields: ['Weight', 'Height'],
        },
      },
    ],
  }
  */

  const toggleScreenToVisitFlow = screenToToggle => {
    const updateData = {};
    updateData.screens = visitFlows[currentVisitFlowIndex].screens;
    if (updateData.screens.indexOf(screenToToggle.id) >= 0) {
      // removing
      updateData.screens = updateData.screens.filter(screenId => screenId !== screenToToggle.id);
    } else {
      // add
      updateData.screens.push(screenToToggle.id);
    }
    setLoading(true);

    topLevelOrganization.ref
      .collection('visit-flows')
      .doc(visitFlows[currentVisitFlowIndex].id)
      .set(updateData, { merge: true })
      .then(visitFlow => {
        // display saved toast
        setLoading(false);
        setSaved(true);
        setToastText(visitFlows[currentVisitFlowIndex].name);
      })
      .catch(error => {
        // display error;
        setLoading(false);
        setSaved(false);
        setToastText(visitFlows[currentVisitFlowIndex].name);
      });
  };

  return (
    <Row>
      {screensLoading || visitFlowsLoading || !topLevelOrganization ? (
        <div
          style={{
            width: '100%',
            height: 400,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <BounceLoader sizeUnit={'px'} size={135} color={'#c00'} loading={true} />
        </div>
      ) : (
        <>
          <Col xs={8}>
            <h3>Visit Flows</h3>
            <Carousel
              showThumbs={false}
              transitionTime={150}
              onChange={newVisitFlowIndex => setCurrentVisitFlowIndex(newVisitFlowIndex)}
              selectedItem={currentVisitFlowIndex}
            >
              {visitFlows.map((visitFlow, index) => {
                return (
                  <div style={{ background: 'white', height: 40, marginBottom: 16 }}>
                    <h4>{visitFlow.name}</h4>
                    {visitFlow.screens.map(screenId => (
                      <p>{screenId}</p>
                    ))}
                  </div>
                );
              })}
            </Carousel>
          </Col>
          <Col xs={4}>
            <h3>Available Screens</h3>
            <div className={styles.screens}>
              {screens.map(screen => (
                <ScreenItem screen={screen} toggleScreenToVisitFlow={toggleScreenToVisitFlow} />
              ))}
            </div>
          </Col>
        </>
      )}
      <Toast
        style={{
          position: 'fixed',
          top: 68,
          right: 8,
          minWidth: 300,
        }}
        show={!!toastText}
        onClose={() => {
          setToastText(false);
        }}
        delay={3000}
        autohide
      >
        <Toast.Header>
          <strong className="mr-auto">{toastText}</strong>
          <small>Just now</small>
        </Toast.Header>
        <Toast.Body>
          {saved
            ? 'Visit flow saved!'
            : 'There was an error saving your visit flow. Please try again.'}
        </Toast.Body>
      </Toast>
    </Row>
  );
};

export default FlowCustomizer;
