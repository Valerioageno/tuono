import { Head } from 'tuono'
import Hero from '../components/hero'

export default function IndexPage(): JSX.Element {
  return (
    <>
      <Head>
        <title>Tuono - The react/rust fullstack framework</title>
        <meta
          name="description"
          content="The technologies we love seamessly working together to unleash the highest web performance ever met on react"
        />
      </Head>
      <Hero />
    </>
  )
}
