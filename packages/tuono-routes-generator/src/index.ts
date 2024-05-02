/**
 * Overview:
 *
 * src/routes							=	Routes entry point
 * src/routes/layout.tsx				=	Shared layout
 * src/routes/index.tsx					=	xyz.com
 * src/routes/about.tsx					=	xyz.com/about
 * src/routes/about-loading.tsx			=	xyz.com/about - while loading data
 * src/routes/about/index.tsx			=	xyz.com/about
 * src/routes/posts/[slug].tsx			=	xyz.com/posts/my-lovely-post
 * src/routes/posts/[...params].tsx		=	xyz.com/posts/my-lovely-post/commend-id-304
 * src/routes/404.tsx					=	Not found
 *
 * public/								=	Public files
 *
 * All the routes are lazy loaded!
 */

import { routeGenerator } from './generator'

export { routeGenerator }
