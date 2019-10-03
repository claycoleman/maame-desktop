import React, { useState, useContext, useRef, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { MdModeEdit } from 'react-icons/md';

import { useOrganizationsFromTLO, FirebaseContext } from '../Firebase';
import { BounceLoader } from 'react-spinners';

import * as ROUTES from '../../constants/routes';
import homeStyles from '../../pages/HomePage/HomePage.module.css';
import { isEmptyObject, useStateWithNullableDefault, to } from '../../modules/helpers';
import ButtonLinks from '../ButtonLinks';

const NewSubdistrictModal = ({
  existingSubdistrict = {},
  show,
  handleClose,
  handleSave,
  handleRemove,
  organization,
  topLevelOrganization,
  error,
}) => {
  const hasExistingSubdistrict = !isEmptyObject(existingSubdistrict);
  const [subdistrictName, setSubdistrictName] = useStateWithNullableDefault(
    existingSubdistrict.name,
  );

  const overlayRef = useRef(null);

  let displayError = error;
  if (displayError.startsWith('The email address is already in use by another account.')) {
    displayError =
      'A community with this name already exists in this district. Please verify that this community does not already exist, and use another name.';
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {hasExistingSubdistrict ? `Edit ${existingSubdistrict.name}` : 'Add new sub-district'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group style={{ textAlign: 'left' }}>
          <Form.Label>Sub-district name</Form.Label>
          <Form.Control
            autoFocus={true}
            name="subdistrictName"
            value={subdistrictName}
            onChange={event => setSubdistrictName(event.target.value)}
            type="text"
          />
        </Form.Group>
        <p>
          <b style={{ marginRight: 6 }}>Country:</b> {topLevelOrganization.country}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={handleClose} style={{ marginRight: '.5rem' }}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                const subdistrict = {
                  name: subdistrictName,
                };
                handleSave(subdistrict);
              }}
              disabled={subdistrictName.trim().length === 0}
            >
              Save sub-district
            </Button>
          </div>
          {error && (
            <p style={{ color: 'red', marginTop: '1rem', marginBottom: 0, textAlign: 'right' }}>
              {displayError}
            </p>
          )}
        </div>
      </Modal.Footer>
      {hasExistingSubdistrict && (
        <Modal.Footer>
          <OverlayTrigger
            trigger="click"
            placement={'left'}
            ref={elem => {
              overlayRef.current = elem;
            }}
            overlay={
              <Popover id={`popover-positioned-left`} title="Really delete?">
                <strong>
                  Are you sure you want to delete this sub-district from {topLevelOrganization.name}
                  ?
                </strong>{' '}
                This can only be undone by reaching out to Maame Support{' '}
                <b>(aob.maame@gmail.com)</b>, and all clients, pregnancies, and communities
                associated with this community will be lost.
                <br />
                <Button
                  style={{ marginTop: 12 }}
                  variant={'danger'}
                  onClick={() => {
                    if (overlayRef.current) {
                      overlayRef.current.hide();
                    }
                    handleRemove();
                  }}
                >
                  Final delete
                </Button>
                <Button
                  style={{ marginTop: 12, marginLeft: 8 }}
                  variant={'secondary'}
                  onClick={() => {
                    if (overlayRef.current) {
                      overlayRef.current.hide();
                    }
                  }}
                >
                  Cancel
                </Button>
              </Popover>
            }
          >
            <Button variant={'outline-danger'}>Delete sub-district from district</Button>
          </OverlayTrigger>
        </Modal.Footer>
      )}
    </Modal>
  );
};

const OrganizationsManager = ({ topLevelOrganization }) => {
  // topLevelOrganization is coming from useTLO => redux
  // OFFLINE TESTING
  // topLevelOrganization = {
  //   country: 'USA',
  //   name: 'Test District',
  //   id: 'tloID',
  // };
  const firebase = useContext(FirebaseContext);
  const storeOrganizations = useSelector(state => state.organizations);
  const organizationsLoading = useOrganizationsFromTLO(topLevelOrganization, true);

  const [saved, setSaved] = useState(false);
  const [toastText, setToastText] = useState('');
  const [loading, setLoading] = useState(false);

  const [showSubdistrictModal, setShowSubdistrictModal] = useState(false);
  const [subdistrictModalError, setSubdistrictModalError] = useState('');
  const [existingSubdistrict, setExistingSubdistrict] = useState({});

  const updateSubdistrict = async (firebase, subdistrictData, existingSubdistrictId) => {
    let error, _response;
    [error, _response] = await to(
      firebase.organization(existingSubdistrictId).set(subdistrictData, { merge: true }),
    );
    if (error) {
      setSubdistrictModalError(error.message);
      return false;
    }
    // success
    return true;
  };

  const addSubdistrict = async (firebase, newSubdistrictData) => {
    const finalNewSubdistrictData = {
      ...newSubdistrictData,
      country: topLevelOrganization.country,
      topLevelOrganizationId: topLevelOrganization.id,
      approvedUsers: [],
    };
    let error, _newSubdistrict;

    // Create a new subdistrict
    [error, _newSubdistrict] = await to(firebase.organizations().add(finalNewSubdistrictData));

    if (error) {
      setSubdistrictModalError(error.message);
      return false;
    }

    return true;
  };

  const removeSubdistrict = async (firebase, organizationToDelete, topLevelOrganization) => {
    const existingCommunities = await firebase
      .users()
      .where('organizationId', '==', organizationToDelete.id)
      .get()
      .then(snapshot => {
        if (snapshot && snapshot.docs && snapshot.docs.length > 0) {
          return snapshot.docs;
        }
        return [];
      });

    console.log(existingCommunities);
    if (existingCommunities.length > 0) {
      // we've got communities – don't think we actually want to delete
      setSubdistrictModalError(
        'This sub-district still has communities associated with it. As a safety precaution, you cannot delete a sub-district until all its communities have first been removed.',
      );
      return;
    }

    // go ahead and delete it
    await firebase.organization(organizationToDelete.id).delete();
    setShowSubdistrictModal(false);
  };

  // if (organizationsError) {
  //   return (
  //     <Row>
  //       <h3>Uh oh...</h3>
  //       <p>We encountered an error: {organizationsError}</p>
  //     </Row>
  //   );
  // }
  return (
    <Row>
      {organizationsLoading ||
      !topLevelOrganization ||
      topLevelOrganization.organizations === undefined ? (
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
          <Col xs={12}>
            <div className={homeStyles.sections}>
              {topLevelOrganization.organizations.map((organizationId, index) => {
                const organization = storeOrganizations[organizationId];
                return (
                  <Link
                    className={[homeStyles.sectionLink, homeStyles.withIcon].join(' ')}
                    to={{
                      pathname: ROUTES.MANAGE_USERS_BASE + organization.id,
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}
                  >
                    <h4 style={{ marginBottom: 0 }}>{organization.name}</h4>
                    <MdModeEdit
                      className={homeStyles.sectionLinkIcon}
                      color="black"
                      size={28}
                      onClick={event => {
                        event.preventDefault();
                        event.stopPropagation();

                        setExistingSubdistrict(organization);
                        setShowSubdistrictModal(true);
                      }}
                    />
                  </Link>
                );
              })}
            </div>
            {topLevelOrganization.organizations.length === 0 && (
              <p>There are no sub-districts for this district yet! Add some below.</p>
            )}
            <ButtonLinks
              style={{ justifyContent: 'center' }}
              button={{
                text: 'Add subdistrict',
                onClick: () => {
                  setExistingSubdistrict({});
                  setShowSubdistrictModal(true);
                },
                noArrow: true,
              }}
            />
          </Col>
          {showSubdistrictModal && (
            <NewSubdistrictModal
              show={true}
              error={subdistrictModalError}
              handleSave={async subdistrictData => {
                if (existingSubdistrict.id) {
                  // updating
                  const success = await updateSubdistrict(
                    firebase,
                    subdistrictData,
                    existingSubdistrict.id,
                  );
                  if (success) {
                    setShowSubdistrictModal(false);
                  }
                } else {
                  // creating new
                  const success = await addSubdistrict(firebase, subdistrictData);
                  if (success) {
                    setShowSubdistrictModal(false);
                  }
                }
              }}
              handleClose={() => {
                setShowSubdistrictModal(false);
                setExistingSubdistrict({});
              }}
              handleRemove={() => {
                removeSubdistrict(firebase, existingSubdistrict, topLevelOrganization);
              }}
              topLevelOrganization={topLevelOrganization}
              existingSubdistrict={existingSubdistrict}
            />
          )}
        </>
      )}
      {/* <Toast
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
      </Toast> */}
    </Row>
  );
};

export default OrganizationsManager;
