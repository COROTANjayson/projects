import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/app-check";

import firebase from "firebase/compat/app";

import { firebaseAdd, firebaseUpdate } from "./common";
import { ReCaptchaV3Provider, initializeAppCheck } from "firebase/app-check";

const config = {
  apiKey: process.env.FB_APIKEY,
  authDomain: process.env.FB_AUTHDOMAIN,
  projectId: process.env.FB_PROJECTID,
  storageBucket: process.env.FB_STORAGEBUCKET,
  messagingSenderId: process.env.FB_MESSENGINGSENDERID,
  appId: process.env.FB_APPID,
};

let db: firebase.firestore.Firestore,
  auth: firebase.auth.Auth,
  fieldValue: typeof firebase.firestore.FieldValue,
  storages: any;

if (!firebase.apps.length) {
  const app = firebase.initializeApp(config);

  if (typeof window !== "undefined") {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(
        process.env.FB_RECAPCHAV3_SITE as string
      ),
      isTokenAutoRefreshEnabled: true,
    });

    db = firebase.firestore();
    auth = firebase.auth();
    storages = firebase.storage();
    fieldValue = firebase.firestore.FieldValue;
    db.settings({ ignoreUndefinedProperties: true, merge: true });
  }
}

export {
  db,
  auth,
  firebaseAdd,
  firebaseUpdate,
  firebase,
  fieldValue,
  storages as storage,
};
