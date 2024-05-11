import { useRouter } from '../hooks/useRouter'
import Link from './Link'

export default function NotFound(): JSX.Element {
  const router = useRouter()

  // Check if exists a custom 404 error page
  if (router.routesById['/404']) {
    return router.routesById['/404'].options.component()
  }

  return (
    <>
      <h1>404 Not found</h1>
      <Link href="/">Return home</Link>
    </>
  )
}
