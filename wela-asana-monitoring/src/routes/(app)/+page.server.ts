import { redirect } from '@sveltejs/kit';
import axios from 'axios';

import type { PageServerLoad } from './$types';
export const load = (async ({ cookies }) => {

}) satisfies PageServerLoad;



import type { Actions } from './$types';

export const actions = {
	logout: async ({ cookies }) => {
		cookies.delete('refresh_token', {
			path: '/'
		});
		cookies.delete('access_token', {
			path: '/'
		});
		cookies.delete('user_data', {
			path: '/'
		});

		redirect(302, '/login');
		// TODO log the user in
	}
} satisfies Actions;
