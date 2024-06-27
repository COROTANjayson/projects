import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";

import * as serviceAccount from "../../../accountServiceKey.json";

const serviceAccountKey = serviceAccount as ServiceAccount;

initializeApp({
	credential: cert(serviceAccountKey),
  });