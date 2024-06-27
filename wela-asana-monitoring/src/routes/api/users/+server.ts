import type { RequestHandler } from './$types';
import axios from 'axios';
import { SECRET_FIRESTORE_KEY } from '$env/static/private';
import { initializeApp, cert, type ServiceAccount, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// import * as serviceAccount from '../../../../accountServiceKey.json';
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

export const GET: RequestHandler = async ({ request, fetch, cookies }) => {
	try {
		// Extract query parameters from the request object
		const queryParams = new URL(request.url).searchParams;

		// Get the value of a specific query parameter
		const owner_id = queryParams.get('owner_id');
		// const requestBody = await request.json();
		let data: any = [];

		const projectsRef = db.collection('users');
		const snapshot = await projectsRef.get();
		if (snapshot.empty) {
			console.log('No matching documents.');
		}

		snapshot.forEach((doc) => {
			let res = {
				id: doc.id,
				...doc.data()
			};
			data = [...data, res];
		});

		return new Response(JSON.stringify({ success: true, data: data }));
	} catch (e) {
		console.log(e);
		return new Response(JSON.stringify({ success: false }));
	}
};

export const POST: RequestHandler = async ({ request, fetch, cookies }) => {
	try {
		const requestBody = await request.json();
		// console.log('hello', requestBody);

		const res = await db.collection('projects').add(requestBody);
		let doc = await res.get();
		let data = { ...doc.data(), id: res.id };
		return new Response(JSON.stringify({ success: true, data }));
	} catch (e) {
		console.log('Authentication Error', e);
		return new Response(JSON.stringify({ success: 'hi' }));
	}
};
