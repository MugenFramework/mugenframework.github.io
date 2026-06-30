// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://mugenframework.github.io',
	integrations: [
		starlight({
			components: {
				Header: './src/components/Header.astro',
			},
			title: '無限 Mugen',
			logo: {
				src: './src/assets/logomugen.png',
				replacesTitle: false,
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/MugenFramework/Mugen' },
			],
			customCss: ['./src/styles/custom.css'],
			defaultLocale: 'en',
			favicon: '/favicon.svg',
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Installation', slug: 'getting-started/installation' },
						{ label: 'Quick Start', slug: 'getting-started/quickstart' },
						{ label: 'Troubleshooting', slug: 'getting-started/troubleshooting' },
					],
				},
				{
					label: 'Teamserver',
					items: [
						{ label: 'Profiles', slug: 'teamserver/profiles' },
						{ label: 'Listeners', slug: 'teamserver/listeners' },
					],
				},
				{
					label: 'Operator Manual',
					items: [
						{ label: 'Sessions', slug: 'operator/sessions' },
						{ label: 'Loot Manager', slug: 'operator/loot' },
						{ label: 'Script Manager', slug: 'operator/scripts' },
						{ label: 'Pivoting', slug: 'operator/pivoting' },
						{ label: 'SOCKS5 Proxy', slug: 'operator/socks5' },
					],
				},
				{
					label: 'Agents',
					items: [
						{ label: 'Demon (Windows)', slug: 'agents/demon' },
						{ label: 'Tengu (Linux)', slug: 'agents/tengu' },
						{ label: 'Working Hours & Kill Date', slug: 'agents/working-hours' },
					],
				},
				{
					label: 'Python API',
					items: [
						{ label: 'Overview', slug: 'python-api/overview' },
						{ label: 'Command Registration', slug: 'python-api/commands' },
						{ label: 'Credentials API', slug: 'python-api/credentials' },
						{ label: 'Writing Modules', slug: 'python-api/modules' },
					],
				},
				{
					label: 'Advanced',
					items: [
						{ label: 'External C2', slug: 'advanced/external-c2' },
						{ label: 'Custom Agent API', slug: 'advanced/custom-agent' },
					],
				},
				{ label: 'Roadmap', slug: 'roadmap' },
			],
		}),
	],
});
