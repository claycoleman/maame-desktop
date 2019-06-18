import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { useTLOVisitFlows } from '../Firebase';

import { BounceLoader, PulseLoader } from 'react-spinners';

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const visitCodeNameMapping = code => {
  const [start, number] = code.split('-');
  return `${capitalizeFirstLetter(start)}natal Visit ${number}`;
};

const FlowVisitAssignerItem = ({ visitCode, availableFlows, topLevelOrganization }) => {
  const [saved, setSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const visitName = visitCodeNameMapping(visitCode);

  return (
    <>
      <h3 style={{ marginTop: 16 }}>{visitName}</h3>
      {loading ? (
        <div style={{ marginTop: 17, marginBottom: 20 }}>
          <PulseLoader sizeUnit={'px'} size={16} margin={'6px'} color={'#c00'} loading={true} />
        </div>
      ) : (
        <>
          <Dropdown
            options={availableFlows.map(visitFlow => {
              return { value: visitFlow.id, label: visitFlow.name };
            })}
            onChange={newComponentTypeTuple => {
              // show loading
              setLoading(true);
              // update the setting on the TopLevelOrganization
              const updateData = {};
              updateData.visitsToFlows = topLevelOrganization.data().visitsToFlows;
              updateData.visitsToFlows[visitCode] = newComponentTypeTuple.value; // value is the visitFlow.id

              topLevelOrganization.ref
                .set(updateData, { merge: true })
                .then(savedTopLevelOrganization => {
                  // display saved toast
                  setLoading(false);
                  setSaved(true);
                  setShowToast(true);
                })
                .catch(error => {
                  // display error;
                  setLoading(false);
                  setSaved(false);
                  setShowToast(true);
                });
            }}
            value={topLevelOrganization.data().visitsToFlows[visitCode]}
          />
          <Toast
            style={{
              position: 'fixed',
              top: 68,
              right: 8,
              minWidth: 300,
            }}
            show={showToast}
            onClose={() => {
              setShowToast(false);
            }}
            delay={3000}
            autohide
          >
            <Toast.Header>
              <strong className="mr-auto">{visitName}</strong>
              <small>Just now</small>
            </Toast.Header>
            <Toast.Body>
              {saved
                ? 'Flow saved to visit!'
                : 'There was an error saving your visit. Please try again.'}
            </Toast.Body>
          </Toast>
        </>
      )}
    </>
  );
};

const FlowVisitAssigner = ({ topLevelOrganization }) => {
  const [error, loading, visitFlows] = useTLOVisitFlows(topLevelOrganization);

  return (
    <Row>
      <Col xs={3} />
      <Col xs={6}>
        <h3>Assigning Flows to Visits</h3>
        <p>
          The WHO recommends that each pregnant patient should receive 8 prenatal visits and 4
          postnatal visits. After you build flows on the Build Flows tab, you can assign each a flow
          to each of the scheduled visits.
        </p>
      </Col>
      <Col xs={3} />

      {loading || !topLevelOrganization ? (
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
          <Col xs={4}>
            <FlowVisitAssignerItem
              topLevelOrganization={topLevelOrganization}
              availableFlows={visitFlows}
              visitCode={'pre-1'}
            />
            <FlowVisitAssignerItem
              topLevelOrganization={topLevelOrganization}
              availableFlows={visitFlows}
              visitCode={'pre-2'}
            />
            <FlowVisitAssignerItem
              topLevelOrganization={topLevelOrganization}
              availableFlows={visitFlows}
              visitCode={'pre-3'}
            />
            <FlowVisitAssignerItem
              topLevelOrganization={topLevelOrganization}
              availableFlows={visitFlows}
              visitCode={'pre-4'}
            />
          </Col>
          <Col xs={4}>
            <FlowVisitAssignerItem
              topLevelOrganization={topLevelOrganization}
              availableFlows={visitFlows}
              visitCode={'pre-5'}
            />
            <FlowVisitAssignerItem
              topLevelOrganization={topLevelOrganization}
              availableFlows={visitFlows}
              visitCode={'pre-6'}
            />
            <FlowVisitAssignerItem
              topLevelOrganization={topLevelOrganization}
              availableFlows={visitFlows}
              visitCode={'pre-7'}
            />
            <FlowVisitAssignerItem
              topLevelOrganization={topLevelOrganization}
              availableFlows={visitFlows}
              visitCode={'pre-8'}
            />
          </Col>
          <Col xs={4}>
            <FlowVisitAssignerItem
              topLevelOrganization={topLevelOrganization}
              availableFlows={visitFlows}
              visitCode={'post-1'}
            />
            <FlowVisitAssignerItem
              topLevelOrganization={topLevelOrganization}
              availableFlows={visitFlows}
              visitCode={'post-2'}
            />
            <FlowVisitAssignerItem
              topLevelOrganization={topLevelOrganization}
              availableFlows={visitFlows}
              visitCode={'post-3'}
            />
            <FlowVisitAssignerItem
              topLevelOrganization={topLevelOrganization}
              availableFlows={visitFlows}
              visitCode={'post-4'}
            />
          </Col>
        </>
      )}
    </Row>
  );
};

export default FlowVisitAssigner;
