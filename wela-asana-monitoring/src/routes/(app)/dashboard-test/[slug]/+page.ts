import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		let dashboard_details: any = {};
		const data = await fetch(`/api/reports/${params.slug}`);
		let res = await data.json();
		if (res.success) {
			dashboard_details = res.data;
		}
		return {
			dashboard_details: dashboard_details
		};
	} catch (error) {
		console.log(error);
		return {
			dashboard_details: {}
		};
	}
};
