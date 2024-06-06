import { TuonoProps } from 'tuono'
import PokemonView from '../../components/PokemonView'

export default function Pokemon({ data }: TuonoProps): JSX.Element {
  return <PokemonView pokemon={data} />
}
