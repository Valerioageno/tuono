import type { JSX } from 'react'
import { Link } from 'tuono'

import styles from './PokemonLink.module.css'

interface Pokemon {
  name: string
}

export default function PokemonLink({
  pokemon,
  id,
}: {
  pokemon: Pokemon
  id: number
}): JSX.Element {
  return (
    <Link
      className={styles.link}
      href={`/pokemons/${pokemon.name}`}
      id={pokemon.name}
    >
      {pokemon.name}
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
      />
    </Link>
  )
}
