import type { TuonoProps } from 'tuono'

type IndexProps = {
  description: string
}
export default function IndexPage({
  data,
  isLoading,
}: TuonoProps<IndexProps>): JSX.Element {
  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <>
      <h1>Index Page</h1>
      <p>{data?.description}</p>
    </>
  )
}
