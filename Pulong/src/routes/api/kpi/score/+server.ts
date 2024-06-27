import { upsertKpiScore } from '$lib/queries/kpiQueires';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const requestBody = await request.json();
		await upsertKpiScore(requestBody);

		return new Response(JSON.stringify({ success: true, requestBody }));
	} catch (e) {
		console.log('Post Charts Error', e);
		return new Response(JSON.stringify({ success: false }));
	}
};
