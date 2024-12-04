import type { ReactNode } from 'react'

interface SidebarElementType<T> {
	type: T
}

interface SidebarLink extends SidebarElementType<'element'> {
	label: string
	href: string
	children?: SidebarLink[]
	leftIcon?: ReactNode
}

interface SidebarTitle extends SidebarElementType<'title'> {
	label: string
}

type SidebarElements =
	| SidebarElementType<'divider'>
	| SidebarLink
	| SidebarTitle

export const sidebarElements: SidebarElements[] = [
	{
		type: 'element',
		label: 'Home',
		href: '/',
	},
	{
		type: 'element',
		label: 'Getting started',
		href: '#focus',
		children: [
			{
				type: 'element',
				label: 'Installation',
				href: '/documentation/installation',
			},
			{
				type: 'element',
				label: 'Development setup',
				href: '/documentation/tutorial/development-setup',
			},
			{
				type: 'element',
				label: 'CLI',
				href: '/documentation/cli',
			},
		],
	},
	{
		type: 'element',
		label: 'Tutorial',
		href: '#focus',
		children: [
			{
				type: 'element',
				href: '/documentation/tutorial',
				label: 'Tutorial',
			},
			{
				type: 'element',
				href: '/documentation/tutorial/development-setup',
				label: 'Development setup',
			},
			{
				type: 'element',
				href: '/documentation/tutorial/api-fetching',
				label: 'API fetching',
			},
			{
				type: 'element',
				href: '/documentation/tutorial/components',
				label: 'Components',
			},
			{
				type: 'element',
				href: '/documentation/tutorial/dynamic-routes',
				label: 'Dynamic routes',
			},
			{
				type: 'element',
				href: '/documentation/tutorial/error-handling',
				label: 'Error handling',
			},
			{
				type: 'element',
				href: '/documentation/tutorial/seo',
				label: 'SEO and meta tags',
			},
			{
				type: 'element',
				href: '/documentation/tutorial/redirections',
				label: 'Redirections',
			},
			{
				type: 'element',
				href: '/documentation/tutorial/production',
				label: 'Production build',
			},
			{
				type: 'element',
				href: '/documentation/tutorial/conclusion',
				label: 'Conclusion',
			},
		],
	},
	{ type: 'divider' },
	{ type: 'title', label: 'Overview' },
	{
		type: 'element',
		label: 'Routing',
		href: '#focus',
		children: [
			{
				type: 'element',
				label: 'Project structure',
				href: '/documentation/routing/intro',
			},
			{
				type: 'element',
				label: 'Application state',
				href: '/documentation/application-state',
			},
		],
	},
	{
		type: 'element',
		label: 'Rendering',
		href: '#focus',
		children: [
			{
				type: 'element',
				label: 'Server side rendering',
				href: '/documentation/routing/intro',
			},
			{
				type: 'element',
				label: 'Static side rendering',
				href: '/documentation/application-state',
			},
		],
	},
	{
		type: 'element',
		label: 'Styles',
		href: '#focus',
		children: [
			{
				type: 'element',
				label: 'CSS modules',
				href: '/documentation/routing/intro',
			},
		],
	},
	{
		type: 'element',
		label: 'Integrations',
		href: '#focus',
		children: [
			{
				type: 'element',
				label: 'MDX',
				href: '/documentation/routing/intro',
			},
		],
	},
	{
		type: 'element',
		label: 'Core concepts',
		href: '#focus',
		children: [
			{
				type: 'element',
				label: 'Multithreading',
				href: '/documentation/routing/intro',
			},
		],
	},
	{ type: 'divider' },
	{ type: 'title', label: 'API reference' },
	{
		type: 'element',
		label: 'Components',
		href: '#focus',
		children: [
			{
				type: 'element',
				label: 'Head',
				href: '/documentation/routing/intro',
			},
			{
				type: 'element',
				label: 'Link',
				href: '/documentation/routing/intro',
			},
		],
	},
	{
		type: 'element',
		label: 'Hooks',
		href: '#focus',
		children: [
			{
				type: 'element',
				label: 'useRouter',
				href: '/documentation/routing/intro',
			},
		],
	},
	{
		type: 'element',
		label: 'tuono.config.ts',
		href: '/documentation/routing/intro',
	},
	{ type: 'divider' },
	{
		type: 'element',
		label: 'Contributing',
		href: '#focus',
		leftIcon: '✨',
		children: [
			{
				type: 'element',
				label: 'Guildelines',
				href: '/documentation/contributing',
			},
			{
				type: 'element',
				label: 'Local development',
				href: '/documentation/contributing/local-development',
			},
		],
	},
]
