import type { PageLoad } from './$types';
import { PUBLIC_CLIENT_ID, PUBLIC_REDIRECT_URI } from '$env/static/public';

export const _authLoginAsana = async () => {
	const _url = `https://app.asana.com/-/oauth_authorize?response_type=code&client_id=${PUBLIC_CLIENT_ID}&redirect_uri=${PUBLIC_REDIRECT_URI}&state=<STATE_PARAM>`;
	window.location.href = _url;
};
