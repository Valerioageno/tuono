import type { TuonoProps } from 'tuono'

interface IndexProps {
  data: number
}

export default function IndexPage({
  data,
  isLoading,
}: TuonoProps<IndexProps>): JSX.Element {
  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return <h1>The random number is: {data?.data}</h1>
}
