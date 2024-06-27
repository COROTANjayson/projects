import { logoutUser } from './hooks_event';
import { redirect, type Handle } from '@sveltejs/kit';
// import * as db from '$lib/firebase/firebase'
export const handle = (async ({ event, resolve }) => {
	const logout = event.url.searchParams.get('logout');
	if (Boolean(logout)) {
		logoutUser(event);
		throw redirect(302, '/login');
	}

	if (event.url.pathname != '/login' && !event.cookies.get('access_token')) {
		throw redirect(303, '/login');
	}

	const response = await resolve(event);
	return response;
}) satisfies Handle;
