import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

export default function Home({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  return <h1>The random number is: {data}</h1>
}

export const getServerSideProps = (async () => {
  const data = Math.floor(Math.random() * 10)
  return { props: { data } }
}) satisfies GetServerSideProps<{ data: number }>
