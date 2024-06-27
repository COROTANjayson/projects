import type { RequestHandler } from './$types';
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

export const GET: RequestHandler = async ({ request, fetch, cookies, params }) => {
	try {
		let data: any = {};
		const req = db.collection('reports').doc(params.slug);
		const doc = await req.get();
		if (doc.exists) {
			data = {
				id: doc.id,
				...doc.data()
			};
		}
		return new Response(JSON.stringify({ success: true, data: data }));
	} catch (e) {
		console.log('Authentication Error', e);
		return new Response(JSON.stringify({ success: false }));
	}
};

export const PUT: RequestHandler = async ({ request, fetch, cookies, params }) => {
	try {
		const requestBody = await request.json();
		delete requestBody.id;
		const reportRef = db.collection('reports').doc(params.slug);
		await reportRef.set({
			...requestBody
		});
		return new Response(JSON.stringify({ success: true }));
	} catch (e) {
		console.log('Authentication Error', e);
		return new Response(JSON.stringify({ success: false }));
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const res = await db.collection('reports').doc(params.slug).delete();
		return new Response(JSON.stringify({ success: true }));
	} catch (e) {
		console.log('Authentication Error', e);
		return new Response(JSON.stringify({ success: false }));
	}
};
