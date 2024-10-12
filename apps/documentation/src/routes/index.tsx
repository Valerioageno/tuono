import { Head } from 'tuono'
import Hero from '../components/hero'

export default function IndexPage(): JSX.Element {
  return (
    <>
      <Head>
        <title>Tuono - The React/Rust full-stack framework</title>
        <meta
          name="description"
          content="The technologies we love seamlessly working together to unleash the highest web performance ever met on React"
        />
      </Head>
      <Hero />
    </>
  )
}
