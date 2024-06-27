import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess()],
	onwarn: (warning, handler) => {
		if (warning.code === 'a11y-no-onchange') return;
		handler(warning);
	},
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			maxDuration: 60,
		}),
		alias: {
			$assets: "./src/assets",
			$lib: "./src/lib",
			$component: "./src/component",
		}
	},
	runtime: 'nodejs18.x'
};

export default config;