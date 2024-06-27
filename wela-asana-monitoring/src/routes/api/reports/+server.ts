import type { RequestHandler } from './$types';
import axios from 'axios';
import { SECRET_FIRESTORE_KEY } from '$env/static/private';
import { initializeApp, cert, type ServiceAccount, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { mergeArraywithID } from '$lib/utils/queryUtils';

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
// },'wela-asana-1');

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

		if (owner_id) {
			const reportsRef = db.collection('reports');
			// const snapshot = await reportsRef
			// 	.orderBy('viewed_at', 'desc')
			// 	.where('owner', '==', parseInt(owner_id))
			// 	.get();
			// if (snapshot.empty) {
			// 	console.log('No matching documents.');
			// }

			// snapshot.forEach((doc) => {
			// 	let res = {
			// 		id: doc.id,
			// 		...doc.data()
			// 	};
			// 	data = [...data, res];
			// });

			// 			const westCoastCities = citiesRef.where('regions', 'array-contains',
			//   'west_coast').get();
			const snapshot2 = await reportsRef
				.orderBy('viewed_at', 'desc')
				.where('members_ids', 'array-contains', owner_id)
				.get();
			if (snapshot2.empty) {
				console.log('No matching documents.');
			}

			snapshot2.forEach((doc) => {
				let res = {
					id: doc.id,
					...doc.data()
				};
				data = [...data, res];
			});

			// data = (mergeArraywithID(data))
		}

		return new Response(JSON.stringify({ success: true, data: data }));
	} catch (e) {
		console.log(e);
		return new Response(JSON.stringify({ success: false }));
	}
};

export const POST: RequestHandler = async ({ request, fetch, cookies }) => {
	try {
		const requestBody = await request.json();

		const res = await db.collection('reports').add(requestBody);
		let doc = await res.get();
		let data = { ...doc.data(), id: res.id };
		console.log(data);
		return new Response(JSON.stringify({ success: true, data }));
	} catch (e) {
		console.log('Authentication Error', e);
		return new Response(JSON.stringify({ success: false }));
	}
};
