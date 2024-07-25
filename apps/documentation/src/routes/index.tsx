import { Head } from 'tuono'
import Hero from '../components/hero'

export default function IndexPage(): JSX.Element {
  return (
    <>
      <Head>
        <title>Tuono - The react/rust fullstack framework</title>
      </Head>
      <Hero />
    </>
  )
}
