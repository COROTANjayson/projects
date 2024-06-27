import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	let user_data: any = cookies.get('user_data');
	let user_serialized = user_data ? JSON.parse(user_data) : '';
	return { user: user_serialized };
}) satisfies PageServerLoad;
