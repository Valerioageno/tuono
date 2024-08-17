export const dynamic = 'force-dynamic'

const mockServerSideAPI = async (): Promise<{ data: number }> => {
  return {
    data: Math.floor(Math.random() * 10),
  }
}

export default async function Home(): Promise<JSX.Element> {
  const { data } = await mockServerSideAPI()
  return <h1>The random number is: {data}</h1>
}
