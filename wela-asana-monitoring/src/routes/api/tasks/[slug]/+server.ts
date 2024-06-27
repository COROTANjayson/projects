import type { RequestHandler } from './$types';
import axios from 'axios';
import { SECRET_FIRESTORE_KEY } from '$env/static/private';
import { initializeApp, cert, type ServiceAccount, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// import * as serviceAccount from '../../../../../accountServiceKey.json';
// const serviceAccountKey = serviceAccount as ServiceAccount;
const serviceAccountKey = JSON.parse(SECRET_FIRESTORE_KEY);

const firebaseApp =
	getApps().length === 0
		? initializeApp({
				credential: cert(serviceAccountKey)
			})
		: getApps();

// initializeApp({
// 	credential: cert(serviceAccountKey)
// }, 'wela-asana');
const db = getFirestore();

// export const GET: RequestHandler = async ({ params }) => {
// 	try {
// 		let data: any = {};
// 		const req = db.collection('tasks').doc(params.slug);
// 		const doc = await req.get();
// 		if (doc.exists) {
// 			data = {
// 				id: doc.id,
// 				...doc.data()
// 			};
// 		}

// 		return new Response(JSON.stringify({ success: true, data: data }));
// 	} catch (e) {
// 		console.log('Authentication Error', e);
// 		return new Response(JSON.stringify({ success: 'error' }));
// 	}
// };

export const POST: RequestHandler = async ({ request, fetch, cookies, params }) => {
	try {
		const requestBody = await request.json();

		// delete requestBody.id;
		const reportRef = db.collection('tasks').doc(params.slug);
		await reportRef.set({
			...requestBody
		});

		return new Response(JSON.stringify({ success: true }));
	} catch (e) {
		console.log('Authentication Error', e);
		return new Response(JSON.stringify({ success: 'hi' }));
	}
};
const getUser = async (res: any) => {
	const { data, access_token } = res;
	// let config = {
	// 	method: 'get',
	// 	maxBodyLength: Infinity,
	// 	url: `https://app.asana.com/api/1.0/users/${data.gid}`,
	// 	headers: {
	// 		accept: 'application/json',
	// 		authorization: 'Bearer ' + access_token
	// 	}
	// };
	// const response:any = await fetch(`https://app.asana.com/api/1.0/users/${data.gid}`, {
	// 	method: 'GET',
	// 	headers: {
	// 		Accept: 'application/json',
	// 		Authorization: 'Bearer ' + access_token
	// 	}
	// });
	let response = await axios(`https://app.asana.com/api/1.0/users/${data.gid}`, {
		method: 'get',
		maxBodyLength: Infinity,
		headers: {
			accept: 'application/json',
			authorization: 'Bearer ' + access_token
		}
	});

	let result = response.data;
	return result;
};
