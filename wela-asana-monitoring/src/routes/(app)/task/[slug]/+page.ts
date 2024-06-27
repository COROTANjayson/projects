import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		let chart: any = {};
		const data = await fetch(`/api/charts/${params.slug}`);
		let res = await data.json();
		if (res.success) {
			chart = res.data;
		}
		return {
			chart: chart
		};
	} catch (error) {
		console.log(error);
	}
};
