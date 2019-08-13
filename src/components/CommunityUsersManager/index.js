import React, { useState, useContext, useRef, useEffect } from 'react';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import Toast from 'react-bootstrap/Toast';
import { useOrganizationsFromTLO, useTopLevelOrganization, FirebaseContext } from '../Firebase';
import { BounceLoader } from 'react-spinners';

import * as ROUTES from '../../constants/routes';
import homeStyles from '../../pages/HomePage/HomePage.module.css';
import ButtonLinks from '../ButtonLinks';

import {
  isEmptyObject,
  copyArray,
  to,
  useStateWithNullableDefault,
  validateEmail,
  deepCopyObject,
} from '../../modules/helpers';

const NewCommunityModal = ({
  existingCommunity = {},
  show,
  handleClose,
  handleSave,
  handleRemove,
  organization,
  topLevelOrganization,
  error,
  setError,
  isAdminOrg,
}) => {
  const hasExistingCommunity = !isEmptyObject(existingCommunity);
  const [communityName, setCommunityName] = useStateWithNullableDefault(
    existingCommunity.firstName,
  );
  const [communityType, setCommunityType] = useStateWithNullableDefault(existingCommunity.lastName);
  const [isOrgAdmin, setIsOrgAdmin] = useStateWithNullableDefault(
    existingCommunity.isOrgAdmin,
    false,
  );
  const [displayPassword, setDisplayPassword] = useState(false);
  const [saveStarted, setSaveStarted] = useState(false);

  const preppedName = communityName.replace(/\W/g, '').toLowerCase();
  const communityEmail = `${preppedName}.${topLevelOrganization.district.toLowerCase()}@maame.org`;

  const overlayRef = useRef(null);
  const existingCommunityName =
    existingCommunity.firstName != null
      ? `${existingCommunity.firstName || ''} ${existingCommunity.lastName || ''}`
      : existingCommunity.email;

  let displayError = error;
  if (displayError.startsWith('The email address is already in use by another account.')) {
    displayError =
      'A community with this name already exists. Please verify that you entered the community name correctly, or use another name. If you need to restore an existing community to a sub-district, please contact Maame support via email or WhatsApp.';
  }

  if (isAdminOrg) {
    // communityType is email
    // communityName is adminName
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
            {hasExistingCommunity ? `Edit admin user` : 'Add new admin user'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group style={{ textAlign: 'left' }}>
            <Form.Label>Admin Name</Form.Label>
            <Form.Control
              name="communityName"
              value={communityName}
              onChange={event => setCommunityName(event.target.value)}
              type="text"
            />
          </Form.Group>
          <Form.Group style={{ textAlign: 'left' }}>
            <Form.Label>Admin Email</Form.Label>
            <Form.Control
              autoFocus={true}
              name="communityType"
              value={communityType}
              onChange={event => setCommunityType(event.target.value)}
              type="text"
            />
          </Form.Group>
          <Form.Group style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 14, fontStyle: 'italic', marginBottom: 0 }}>
              Adding a district admin allows them to:
            </p>
            <ul style={{ fontSize: 14, fontStyle: 'italic' }}>
              <li>login to the Maame web portal</li>
              <li>add new sub-districts to the district</li>
              <li>manage district admins</li>
              <li>add new communities / users to sub-districts</li>
              <li>edit or remove existing communities from sub-districts</li>
              <li>view analytics for the entire district or a specific sub-district</li>
            </ul>
          </Form.Group>
          <p style={{ marginRight: 12 }}>
            <b style={{ marginRight: 6 }}>Password:</b> Each admin user will manage their own
            password through the Maame app or web portal.
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
                  const adminName = communityName; // communityName is adminName
                  const email = communityType; // communityType is email
                  if (!validateEmail(email)) {
                    setError('Please enter a valid email.');
                    return;
                  }
                  setSaveStarted(true);
                  const communityData = {
                    email,
                    adminName,
                    index: existingCommunity ? existingCommunity.index : '',
                  };
                  handleSave(communityData);
                }}
                disabled={
                  communityName.trim().length === 0 ||
                  communityType.trim().length === 0 ||
                  saveStarted
                }
              >
                Save admin user
              </Button>
            </div>
            {error && (
              <p style={{ color: 'red', marginTop: '1rem', marginBottom: 0, textAlign: 'right' }}>
                {displayError}
              </p>
            )}
          </div>
        </Modal.Footer>
        {hasExistingCommunity && (
          <Modal.Footer>
            <OverlayTrigger
              trigger="click"
              placement={'left'}
              ref={elem => {
                overlayRef.current = elem;
              }}
              overlay={
                <Popover id={`popover-positioned-left`} title="Really delete?">
                  <strong>Are you sure you want to remove this admin user?</strong> The user can be
                  added again later below.
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
              <Button variant={'outline-danger'}>Delete admin user</Button>
            </OverlayTrigger>
          </Modal.Footer>
        )}
      </Modal>
    );
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
          {hasExistingCommunity ? `Edit ${existingCommunityName}` : 'Add new community and user'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group style={{ textAlign: 'left' }}>
          <Form.Label>Community name</Form.Label>
          <Form.Control
            autoFocus={true}
            name="communityName"
            value={communityName}
            onChange={event => setCommunityName(event.target.value)}
            type="text"
          />
        </Form.Group>
        <Form.Group style={{ textAlign: 'left' }}>
          <Form.Label>Community type (health centre, hospital, community clinic, CHPS)</Form.Label>
          <Form.Control
            name="communityType"
            value={communityType}
            onChange={event => setCommunityType(event.target.value)}
            type="text"
          />
        </Form.Group>
        <Form.Group style={{ textAlign: 'left' }}>
          <div key={`custom-checkbox`} className="mb-3" style={{ marginBottom: '4px !important' }}>
            <Form.Check
              custom
              type="checkbox"
              id={`custom-checkbox`}
              label={`Sub-District Admin`}
              checked={isOrgAdmin}
              onChange={event => {
                setIsOrgAdmin(!!event.target.checked);
              }}
            />
          </div>

          <p style={{ fontSize: 14, fontStyle: 'italic', marginBottom: 0 }}>
            Making a community / user a sub-district admin allows them to:
          </p>
          <ul style={{ fontSize: 14, fontStyle: 'italic' }}>
            <li>login to the Maame web portal</li>
            <li>add new communities / users to the sub-district</li>
            <li>edit or remove existing communities from the sub-district</li>
            <li>view analytics for the entire sub-district</li>
          </ul>
        </Form.Group>
        <p>
          <b style={{ marginRight: 6 }}>Full community name:</b> {communityName} {communityType}
        </p>
        <p>
          <b style={{ marginRight: 6 }}>Username:</b> {communityEmail}
        </p>
        <p style={{ marginRight: 12 }}>
          <b style={{ marginRight: 6 }}>Password:</b>{' '}
          {displayPassword ? topLevelOrganization.rup : '********'} {/* rup => raw user password */}
        </p>
        <Button size="sm" variant="secondary" onClick={() => setDisplayPassword(!displayPassword)}>
          {displayPassword ? 'Hide' : 'Show'} password
        </Button>
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
                const communityData = {
                  firstName: communityName,
                  lastName: communityType,
                  email: communityEmail,
                  isOrgAdmin,
                };
                setSaveStarted(true);
                handleSave(communityData);
              }}
              disabled={
                preppedName.trim().length === 0 || communityType.trim().length === 0 || saveStarted
              }
            >
              Save community
            </Button>
          </div>
          {error && (
            <p style={{ color: 'red', marginTop: '1rem', marginBottom: 0, textAlign: 'right' }}>
              {displayError}
            </p>
          )}
        </div>
      </Modal.Footer>
      {hasExistingCommunity && (
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
                  Are you sure you want to delete this community from {organization.name}?
                </strong>{' '}
                This cannot be undone, and any clients or pregnancies associated with this community
                will be lost.
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
            <Button variant={'outline-danger'}>Delete community from sub-district</Button>
          </OverlayTrigger>
        </Modal.Footer>
      )}
    </Modal>
  );
};

const CommunityUsersManager = ({ loading, organization, isAdminOrg }) => {
  const firebase = useContext(FirebaseContext);

  const [usersLoading, setUsersLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toastText, setToastText] = useState('');

  const [existingCommunity, setExistingCommunity] = useState({});

  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [communityModalError, setCommunityModalError] = useState('');

  const userList = organization ? organization.approvedUsers : null;
  const userMappingRef = useRef({});

  const updateUserMapping = (forceRefresh = false) => {
    if (!isAdminOrg) {
      setUsersLoading(true);

      const newMapping = {};

      // TODO we need to fix this to work if the userList is empty
      if (userList === null) {
        return;
      }

      if (userList.length === 0) {
        // we have received an userList, and it's empty
        setUsersLoading(false);
        return;
      }

      userList.forEach(userEmail => {
        if (
          !forceRefresh &&
          userMappingRef.current[userEmail] &&
          !userMappingRef.current[userEmail].noUserDoc
        ) {
          newMapping[userEmail] = userMappingRef.current[userEmail];

          if (Object.keys(newMapping).length === userList.length) {
            // we've gotten all of our new users
            userMappingRef.current = newMapping;
            setUsersLoading(false);
          }
        } else {
          firebase
            .users()
            .where('email', '==', userEmail)
            .get()
            .then(snapshot => {
              if (snapshot && snapshot.docs && snapshot.docs.length > 0) {
                const userData = snapshot.docs[0].data();
                userData.id = snapshot.docs[0].id;
                newMapping[userEmail] = userData;
              } else {
                // no user for that email, this shouldn't happen in the future
                // after users are only created here
                newMapping[userEmail] = { email: userEmail, noUserDoc: true };
              }

              if (Object.keys(newMapping).length === userList.length) {
                // we've gotten all of our new users
                userMappingRef.current = newMapping;
                setUsersLoading(false);
              }
            });
        }
      });
    }
  };
  useEffect(updateUserMapping, [userList]);

  useEffect(() => {
    if (!showCommunityModal) {
      setTimeout(() => {
        setExistingCommunity({});
        setCommunityModalError('');
      }, 100);
    }
  }, [showCommunityModal]);

  const startAddingCommunity = () => {
    setShowCommunityModal(true);
  };

  const addCommunityAndUser = async (firebase, communityData, password, organization) => {
    let error, authUser;

    [error, authUser] = await to(
      firebase.doCreateUserAsAdminWithEmailAndPassword(communityData.email, password),
    );

    if (error) {
      setCommunityModalError(error.message);
      return false;
    }

    // Create a user in your Firebase realtime database
    await firebase.user(authUser.user.uid).set(
      {
        id: authUser.user.uid,
        userId: authUser.user.uid,
        ...communityData,
        organizationId: organization.id,
        isTLOAdmin: false, // manually add admins in the Firebase console
      },
      { merge: true },
    );
    await authUser.secondaryLogout();
    return true;
  };

  const updateCommunityAndUser = async (firebase, newCommunityData, oldEmail, password) => {
    const newEmail = newCommunityData.email;
    if (newEmail === oldEmail) {
      return true;
    }
    // changing email
    let error, _response;
    [error, _response] = await to(firebase.doUpdateUserEmailAsAdmin(oldEmail, newEmail, password));
    if (error) {
      setCommunityModalError(error.message);
      return false;
    }
    // success
    return true;
  };

  const removeEmailFromApprovedUsers = async (communityData, organization) => {
    let approvedUsers = copyArray(organization.approvedUsers);
    approvedUsers = approvedUsers.filter(userEmail => userEmail !== communityData.email);

    if (approvedUsers.length === 0) {
      setCommunityModalError(
        'You cannot remove this admin user, as your district must have at least one admin user.',
      );
      return;
    }

    let updatedUserData = { organizationId: '', topLevelOrganizationId: '' };
    if (isAdminOrg) {
      // take away isTLOAdmin status
      updatedUserData.isTLOAdmin = false;
    }
    firebase
      .users()
      .where('email', '==', communityData.email)
      .get()
      .then(snapshot => {
        if (snapshot && snapshot.docs && snapshot.docs.length > 0) {
          const userRef = snapshot.docs[0].ref;
          userRef.set(updatedUserData, { merge: true });
        }
      });

    await firebase.organization(organization.id).set({ approvedUsers }, { merge: true });

    setShowCommunityModal(false);
  };

  const addEmailToApprovedUsers = async (communityData, organization) => {
    const { email, adminName } = communityData;
    let approvedUsers = copyArray(organization.approvedUsers);
    if (approvedUsers.indexOf(email) >= 0) {
      setCommunityModalError(
        isAdminOrg
          ? 'An admin user with this email already exists in this district. Please use another email.'
          : 'A community with this name already exists. Please verify that you entered the community name correctly, or use another name. If you need to restore an existing community to a sub-district, please contact Maame support via email or WhatsApp.',
      );
      return;
    }
    approvedUsers.push(email);
    let updatedOrganizationData = { approvedUsers };
    let updatedUserData = {
      organizationId: organization.id,
      topLevelOrganizationId: topLevelOrganization.id,
    };

    if (isAdminOrg) {
      let adminEmailsToNames = deepCopyObject(organization.adminEmailsToNames);
      adminEmailsToNames[email] = adminName;
      updatedOrganizationData.adminEmailsToNames = adminEmailsToNames;
      // add isTLOAdmin status
      updatedUserData.isTLOAdmin = true;
    }

    await firebase.organization(organization.id).set(updatedOrganizationData, { merge: true });

    await firebase
      .users()
      .where('email', '==', communityData.email)
      .get()
      .then(snapshot => {
        if (snapshot && snapshot.docs && snapshot.docs.length > 0) {
          const userRef = snapshot.docs[0].ref;
          userRef.set(updatedUserData, { merge: true });
        }
      });

    setShowCommunityModal(false);
  };

  const updateEmailInApprovedUsers = async (
    existingCommunityData,
    newCommunityData,
    organization,
  ) => {
    let approvedUsers = copyArray(organization.approvedUsers);

    if (
      approvedUsers.indexOf(newCommunityData.email) >= 0 &&
      existingCommunityData.email !== newCommunityData.email
    ) {
      // this email is already in the approved users and we're not editing the same approvedUser - we are definitely overlapping
      setCommunityModalError(
        isAdminOrg
          ? 'An admin user with this email already exists in this district. Please use another email.'
          : 'A community with this name already exists. Please verify that you entered the community name correctly, or use another name. If you need to restore an existing community to a sub-district, please contact Maame support via email or WhatsApp.',
      );
      return;
    }

    const index = approvedUsers.indexOf(existingCommunityData.email);
    approvedUsers[index] = newCommunityData.email;

    let updatedOrganizationData = { approvedUsers };
    let updatedUserData = {
      organizationId: organization.id,
      topLevelOrganizationId: topLevelOrganization.id,
    };

    if (isAdminOrg) {
      let adminEmailsToNames = deepCopyObject(organization.adminEmailsToNames);
      delete adminEmailsToNames[existingCommunityData.email];
      adminEmailsToNames[newCommunityData.email] = newCommunityData.adminName;
      updatedOrganizationData.adminEmailsToNames = adminEmailsToNames;
      // add isTLOAdmin status
      updatedUserData.isTLOAdmin = true;
    }

    await firebase.organization(organization.id).set(updatedOrganizationData, { merge: true });

    await firebase
      .users()
      .where('email', '==', newCommunityData.email)
      .get()
      .then(snapshot => {
        if (snapshot && snapshot.docs && snapshot.docs.length > 0) {
          const userRef = snapshot.docs[0].ref;
          userRef.set(updatedUserData, { merge: true });
        }
      });

    setShowCommunityModal(false);
  };

  // const toggleScreenToVisitFlow = screenToToggle => {
  //   const updateData = {};
  //   updateData.screens = visitFlows[currentVisitFlowIndex].screens;
  //   if (updateData.screens.indexOf(screenToToggle.id) >= 0) {
  //     // removing
  //     updateData.screens = updateData.screens.filter(screenId => screenId !== screenToToggle.id);
  //   } else {
  //     // add
  //     updateData.screens.push(screenToToggle.id);
  //   }
  //   setLoading(true);

  //   topLevelOrganization.ref
  //     .collection('visit-flows')
  //     .doc(visitFlows[currentVisitFlowIndex].id)
  //     .set(updateData, { merge: true })
  //     .then(visitFlow => {
  //       // display saved toast
  //       setLoading(false);
  //       setSaved(true);
  //       setToastText(visitFlows[currentVisitFlowIndex].name);
  //     })
  //     .catch(error => {
  //       // display error;
  //       setLoading(false);
  //       setSaved(false);
  //       setToastText(visitFlows[currentVisitFlowIndex].name);
  //     });
  // };

  // if (organizationsError) {
  //   return (
  //     <Row>
  //       <h3>Uh oh...</h3>
  //       <p>We encountered an error: {organizationsError}</p>
  //     </Row>
  //   );
  // }
  const [tloError, tloLoading, topLevelOrganization] = useTopLevelOrganization(
    organization ? organization.topLevelOrganizationId : null,
  );

  return (
    <Row>
      {usersLoading || !organization || !topLevelOrganization ? (
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
              {userList.map((userEmail, index) => {
                if (isAdminOrg) {
                  const adminName = organization.adminEmailsToNames[userEmail];
                  return (
                    <div
                      className={homeStyles.sectionLink}
                      onClick={() => {
                        // find user, then do something with it
                        // first name is adminName bc communityName is adminName
                        // last name is email bc communityType is email

                        setExistingCommunity({
                          firstName: adminName,
                          adminName,
                          lastName: userEmail,
                          email: userEmail,
                          index,
                        });
                        setShowCommunityModal(true);
                      }}
                    >
                      <h4 style={{ marginBottom: 0 }}>{adminName}</h4>
                    </div>
                  );
                }
                const communityObj = userMappingRef.current[userEmail];
                if (!communityObj) {
                  return;
                }
                if (communityObj.noUserDoc) {
                  return (
                    <div
                      className={homeStyles.sectionLink}
                      onClick={async () => {
                        // create the user...
                        let communityName = userEmail.split('.', 1)[0];
                        communityName = communityName[0].toUpperCase() + communityName.slice(1);
                        await addCommunityAndUser(
                          firebase,
                          {
                            firstName: communityName,
                            lastName: '',
                            email: userEmail,
                            isOrgAdmin: false,
                          },
                          topLevelOrganization.rup,
                          organization,
                        );
                      }}
                    >
                      <h4 style={{ marginBottom: 0 }}>{communityObj.email}</h4>
                    </div>
                  );
                }
                return (
                  <div
                    className={homeStyles.sectionLink}
                    onClick={() => {
                      // find user, then do something with it
                      setExistingCommunity(communityObj);
                      setShowCommunityModal(true);
                    }}
                  >
                    <h4 style={{ marginBottom: 0 }}>
                      {communityObj.firstName} {communityObj.lastName}
                    </h4>
                    {communityObj.isOrgAdmin && (
                      <p style={{ marginBottom: 0, fontStyle: 'italic', fontSize: 16 }}>
                        Sub-district admin
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            {userList.length === 0 &&
              (isAdminOrg ? (
                <p>There are no admin users for this district yet! Add some below.</p>
              ) : (
                <p>There are no communities / users for this sub-district yet! Add some below.</p>
              ))}
            <ButtonLinks
              style={{ justifyContent: 'center' }}
              button={{
                text: isAdminOrg ? 'Add admin user' : 'Add community and user',
                onClick: startAddingCommunity,
                noArrow: true,
              }}
            />
          </Col>
          {showCommunityModal && (
            <NewCommunityModal
              show={true}
              error={communityModalError}
              setError={setCommunityModalError}
              handleSave={async communityData => {
                if (isAdminOrg) {
                  // we are updating users in the admin organization
                  if (existingCommunity.index) {
                    updateEmailInApprovedUsers(
                      existingCommunity, // existing data
                      communityData, // new data
                      organization,
                    );
                  } else {
                    // they need to separately register for an account, so we won't create here
                    addEmailToApprovedUsers(communityData, organization);
                  }
                } else {
                  if (existingCommunity.id) {
                    // updating
                    const success = await updateCommunityAndUser(
                      firebase,
                      communityData,
                      existingCommunity.email,
                      topLevelOrganization.rup,
                    );
                    if (success) {
                      await firebase.user(existingCommunity.id).set(communityData, { merge: true });
                      await updateEmailInApprovedUsers(
                        existingCommunity, // existing data
                        communityData,
                        organization,
                      );
                      setShowCommunityModal(false);
                    }
                  } else {
                    // creating new
                    const success = await addCommunityAndUser(
                      firebase,
                      communityData,
                      topLevelOrganization.rup,
                      organization,
                    );
                    if (success) {
                      addEmailToApprovedUsers(communityData, organization);
                    }
                  }
                }
              }}
              handleClose={() => {
                setShowCommunityModal(false);
              }}
              handleRemove={() => {
                removeEmailFromApprovedUsers(existingCommunity, organization);
              }}
              organization={organization}
              topLevelOrganization={topLevelOrganization}
              existingCommunity={existingCommunity}
              isAdminOrg={isAdminOrg}
            />
          )}
        </>
      )}
    </Row>
  );
};

export default CommunityUsersManager;
