import type { JSX } from 'react'

import Hero from '@/components/hero'
import MetaTags from '@/components/meta-tags'

export default function IndexPage(): JSX.Element {
  return (
    <>
      <MetaTags
        title="Tuono - The React/Rust full-stack framework"
        canonical="https://tuono.dev"
        description="The technologies we love seamlessly working together to unleash the highest web performance ever met on React"
      />
      <Hero />
    </>
  )
}
