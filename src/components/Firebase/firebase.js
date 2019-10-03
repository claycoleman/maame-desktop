import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { to } from '../../modules/helpers';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.firestore();

    this.userCollectionRef = this.db.collection('users');
    this.organizationCollectionRef = this.db.collection('organizations');
    this.topLevelOrganizationCollectionRef = this.db.collection('top-level-organizations');
    this.pregnancyCollectionRef = this.db.collection('pregnancies');
    this.patientCollectionRef = this.db.collection('patients');
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doCreateUserAsAdminWithEmailAndPassword = async (email, password) => {
    const tempFirebase = require('firebase/app');
    require('firebase/auth');
    var secondaryApp = tempFirebase.initializeApp(config, 'Secondary');

    const [error, authUser] = await to(
      secondaryApp
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(firebaseUser => {
          firebaseUser.secondaryLogout = async () => {
            await secondaryApp.auth().signOut();
            return secondaryApp.delete();
          };
          return firebaseUser;
        }),
    );

    if (error) {
      await secondaryApp.delete();
      throw error;
    }
    return authUser;
  };

  doUpdateUserEmailAsAdmin = (oldEmail, newEmail, password) => {
    const tempFirebase = require('firebase/app');
    require('firebase/auth');
    var secondaryApp = tempFirebase.initializeApp(config, 'Secondary');

    return secondaryApp
      .auth()
      .signInWithEmailAndPassword(oldEmail, password)
      .then(async userCredential => {
        await userCredential.user.updateEmail(newEmail);
        await secondaryApp.auth().signOut();
        return secondaryApp.delete();
      });
  };

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  onAuthUserListener = (next, fallback) =>
    // TODO find a way to kick users out after they lose auth privileges
    // by listening to a snapshot of the db user
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .get()
          .then(snapshot => {
            const dbUser = snapshot.data();
            if (dbUser) {
              // default empty roles
              if (!dbUser.roles) {
                dbUser.roles = {};
              }

              // merge auth and db user
              authUser = {
                uid: authUser.uid,
                email: authUser.email,
                emailVerified: authUser.emailVerified,
                providerData: authUser.providerData,
                ...dbUser,
              };
            }

            next(authUser);
          });
      } else {
        fallback();
      }
    });

  user = uid => this.userCollectionRef.doc(uid);
  // example: this.props.firebase.user(uid).get().then(snapshot => snapshot.data())

  users = () => this.userCollectionRef;
  /*
  example:
  this.props.firebase.users().onSnapshot(snapshot => {
        let users = [];

        snapshot.forEach(doc =>
          users.push({ ...doc.data(), uid: doc.id }),
        );

        this.setState({
          users,
          loading: false,
        });
      });

  */
  organization = id => this.organizationCollectionRef.doc(id);
  organizations = () => this.organizationCollectionRef;

  topLevelOrganization = id => this.topLevelOrganizationCollectionRef.doc(id);
  topLevelOrganizations = () => this.topLevelOrganizationCollectionRef;

  pregnancy = id => this.pregnancyCollectionRef.doc(id);
  pregnancies = () => this.pregnancyCollectionRef;

  patient = id => this.patientCollectionRef.doc(id);
  patients = () => this.patientCollectionRef;
}

export default Firebase;
