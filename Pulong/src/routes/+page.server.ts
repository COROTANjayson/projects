import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	let user = null;
	if (event.locals.user) {
		user = event.locals.user;
	}
	return {
		user
	};
};
