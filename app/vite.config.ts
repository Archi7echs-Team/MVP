import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	ssr: {
		noExternal: ['camera-controls']
	  },

	test: {
		workspace: [
			{
				extends: './vite.config.ts',
				plugins: [svelteTesting()],

				test: {
					globals: true, 
					name: 'client',
					environment: 'jsdom',
					clearMocks: true,
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',

				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}','**/+page.svelte', '**/+layout.svelte']
				}
			}
		],
		coverage: {
			include: ['src/**/*.{js,ts,svelte}'],
			exclude: ['**/+page.svelte', '**/+layout.svelte', '**/app.d.ts', '**/app.html', '**/app.ts'],
			reporter: ['text', 'html', 'lcov'],
			reportsDirectory: './coverage',
			provider: 'v8',
		  }
	}
});

