import { createRoute, lazyLoadComponent as dynamic } from 'tuono';
const IndexImport = dynamic(() => import('./../src/routes/index'));
const PokemonspokemonImport = dynamic(() => import('./../src/routes/pokemons/[pokemon]'));
