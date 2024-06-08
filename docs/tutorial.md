# Tuono tutorial

This tutorial is meant for giving you a sneak peek of the framework and is intended to evolve along the development - be sure to have installed the latest version.

The first part is about the project setup and the base knowledge needed to work with tuono. The actual tutorial starts at [Tutorial introduction](#tutorial-introduction).

> If you prefer to see directly the final outcome check out the [tutorial source](https://github.com/Valerioageno/tuono/tree/main/examples/tutorial).

## Installation

The tuono CLI is hosted on [crates.io](https://crates.io/crates/tuono); to download and install it just run on a terminal:

```bash
$ cargo install tuono
```

To check that is correctly installed run:

```bash
$ tuono --version
```

## Project scaffold

To setup a new project you just need to run the following command:

```bash
$ tuono new tuono-tutorial
```

Get into the project folder and install the dependencies with:

```bash
$ pnpm install
```

Open it with your favourite code editor.

The project will have the following structure:

```bash
| public/ 
- src/
  | routes/
  |	styles/
| package.json
| Cargo.toml
| .gitignore
| tsconfig.json
```

**public/**: put here all the files you want to be public

**src/routes/**: All the files in this folder are considered routes. All the routes are server side rendered out of the box. To add server side capabilities just create a rust file with the same name as the route (i.e. `about.tsx` → `about.rs`).

**src/styles/**: In this folder there is the `global.css` file that stores all the global styles. For the rest of the project you can use CSS modules (⚠️ CSS modules on routes are forbidden). 

## Start the dev environment

To start the development environment you just need to run the following command within the project folder:

```bash
$ tuono dev
```
The first time might take a little bit because it will install all the rust’s dependencies. All the other execution will be pretty quick!

> 💡 The `tuono dev` development script is currently under strong optimization improvements. In case you face any error delete the cache `.tuono` folder and run it again!

Then open [`http://localhost:3000/`](http://localhost:3000/) on the browser.

## The “/” route

All the `index.tsx` files represent the folder root page (i.e. `src/routes/posts/index.tsx` is [`http://localhost:3000/posts`](http://localhost:3000/posts) as well as `src/routes/posts.tsx`).

The file `index.rs` represents the server side capabilities for the index route. On this file you can:

- Passing server side props
- Redirect/Rewrite to a different route (Available soon)
- Changing http status code (Available soon)

## Tutorial introduction

Now that we have some knowledge about the project structure let’s start the real tutorial. 

The goal is to use the [PokeAPI](https://pokeapi.co/docs/v2) to list all the pokemons of the first generation (the best one btw) and then reserve a dynamic page for each one separately.

## Fetch all the pokemons

To start let’s fetch all of them in the root page; since we want to render them on the server side we gonna need to implement the logic in the `index.rs` file.

Clear the `index.rs` file and paste:

```rust
// src/routes/index.rs
use serde::{Deserialize, Serialize};
use tuono_lib::{Request, Response};

const ALL_POKEMON: &str = "https://pokeapi.co/api/v2/pokemon?limit=151";

#[derive(Debug, Serialize, Deserialize)]
struct Pokemons {
    results: Vec<Pokemon>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Pokemon {
    name: String,
    url: String,
}

#[tuono_lib::handler]
async fn get_all_pokemons(_req: Request<'_>, fetch: reqwest::Client) -> Response {

    return match fetch.get(ALL_POKEMON).send().await {
        Ok(res) => {
            let data = res.json::<Pokemons>().await.unwrap();
            Response::Props(Box::new(data))
        }
        Err(_err) => Response::Props(Box::new(Pokemons { results: vec![] })),
    };
    
}
```

Now the pokemons are correctly fetched and hydrated on the client side so we can actually use them. Clear the `index.tsx` file and paste:

```tsx
// src/routes/index.tsx
import type { TuonoProps } from "tuono";

interface Pokemon {
  name: string
}

interface IndexProps {
  results: Pokemon[]
}

export default function IndexPage({
  data,
}: TuonoProps<IndexProps>): JSX.Element {
  if (!data?.results) {
    return <></>;
  }

  return (
    <>
      <header className="header">
        <a href="https://crates.io/crates/tuono" target="_blank">
          Crates
        </a>
        <a href="https://www.npmjs.com/package/tuono" target="_blank">
          Npm
        </a>
      </header>
      <div className="title-wrap">
        <h1 className="title">
          TU<span>O</span>NO
        </h1>
        <div className="logo">
          <img src="rust.svg" className="rust" />
          <img src="react.svg" className="react" />
        </div>
      </div>
      <ul style={{ flexWrap: "wrap", display: "flex", gap: 10 }}>
        {data.results.map((pokemon) => {
          return pokemon.name;
        })}
      </ul>
    </>
  );
}
```

Refresh now the browser! A bit ugly but all the pokemons are finally printed on screen!

## Create a stand-alone component

Let’s then create the button needed for displaying the list of pokemons.

Create the following file `src/components/PokemonLink.tsx` and fill the content with:

```tsx
// src/components/PokemonLink.tsx
import { Link } from "tuono";

interface Pokemon {
  name: string
}

export default function PokemonLink({
  pokemon,
  id,
}: {
  pokemon: Pokemon;
  id: number;
}): JSX.Element {
  return (
    <Link href={`/pokemons/${pokemon.name}`}>
      {pokemon.name}
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
      />
    </Link>
  );
}
```

Now that the link is done let’s import it in the `index.tsx` file

```diff
// src/routes/index.tsx

++  import PokemonLink from '../components/PokemonLink'

// ...
	<ul style={{ flexWrap: "wrap", display: "flex", gap: 10 }}>
--      {pokemons.map((pokemon) => {
--        return pokemon.name;
++      {pokemons.map((pokemon, i) => {
++        return <PokemonLink pokemon={pokemon} id={i + 1} key={i} />;
      })}
	</ul>
// ...
```

Now the links work. Clicking on any of them we get redirected to the 404 page because we haven’t yet implemented the `pokemons/[pokemon]` page. 
As previously said CSS modules are enabled out of the box so let’s make those links a little bit nicer.

Create alongside the `PokemonLink.tsx` component the CSS module `PokemonLink.module.css` and copy the following content into it:

```css
/* src/components/PokemonLink.module.css */

.link {
  width: 100%;
  max-width: 216px;
  position: relative;
  background: white;
  margin-bottom: 10px;
  border: solid #f0f0f0 1px;
  text-decoration: none;
  color: black;
  padding: 5px 5px 5px 15px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  transition: 0.2s;
  align-items: center;
}

.link:hover {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.link img {
  width: 70px;
  background: white;
  border-radius: 50%;
}
```

> 💡 SASS is supported out of the box. Just install the processor in the devDependencies `pnpm i -D sass` and run again `tuono dev`

Then import the styles into the `PokemonLink` component as following:

```diff
// src/components/PokemonLink.tsx
import { Link } from "tuono";
import type { Pokemon } from "./../types/pokemon";
++ import styles from './PokemonLink.module.css'

export default function PokemonLink({
  pokemon,
  id,
}: {
  pokemon: Pokemon;
  id: number;
}): JSX.Element {
  return (
--    <Link href={`/pokemons/${pokemon.name}`}>
++    <Link className={styles.link} href={`/pokemons/${pokemon.name}`}>
      {pokemon.name}
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
      />
    </Link>
  );
}
```

## Create the `/pokemons/[pokemon]` route

The homepage is ready. We have the full list of pokemons and they are all links. Great!

Now we want to make those links actually pointing to a real page. Let’s create the dynamic route.

Create the folder `routes/pokemons` and then create the two files `[pokemon].tsx` and `[pokemon].rs`.

These two will handle every requests that points to `http://localhost:3000/pokemons/bulbasaur..mew`.

Let’s first work on the server side file. Paste into the new `[pokemon].rs` file the following code:

```rust
use serde::{Deserialize, Serialize};
use tuono_lib::{Request, Response};

const POKEMON_API: &str = "https://pokeapi.co/api/v2/pokemon";

#[derive(Debug, Serialize, Deserialize)]
struct Pokemon {
    name: String,
    id: u16,
    weight: u16,
    height: u16,
}

#[tuono_lib::handler]
async fn get_pokemon(req: Request<'_>, fetch: reqwest::Client) -> Response {
	// The param `pokemon` is defined in the route filename [pokemon].rs
    let pokemon = req.params.get("pokemon").unwrap();
    
    return match fetch.get(format!("{POKEMON_API}/{pokemon}")).send().await {
        Ok(res) => {
            let data = res.json::<Pokemon>().await.unwrap();
            Response::Props(Box::new(data))
        }
        Err(_err) => Response::Props(Box::new(Pokemon {
            name: "Nope".to_string(),
            id: 0,
            weight: 0,
            height: 0,
        })),
    };
    
}
```

Then let’s work on the frontend. Paste into the `[pokemon].tsx` file the following code:

```tsx
import { TuonoProps } from "tuono";
import PokemonView from "../../components/PokemonView";

export default function Pokemon({ data }: TuonoProps): JSX.Element {
  return <PokemonView pokemon={data} />;
}
```

The browser should complain that the component `PokemonView` does not exist. Let’s create it then!

```tsx
// components/PokemonView.tsx
import { Link } from "tuono";
import styles from "./PokemonView.module.css";

interface Pokemon {
  name: string
  id: string
  weight: number
  height: number
}

export default function PokemonView({
  pokemon,
}: {
  pokemon?: Pokemon;
}): JSX.Element {
  return (
    <div>
      <Link className={styles["back-btn"]} href="/">
        Back
      </Link>
      {pokemon?.name && (
        <div className={styles.pokemon}>
          <div>
            <h1 className={styles.name}>
              {pokemon.name}
            </h1>
            <dl className={styles.spec}>
              <dt className={styles.label}>Weight:</dt>
              <dd>{pokemon.weight}lbs</dd>
            </dl>
            <dl className={styles.spec}>
              <dt className={styles.label}>Height:</dt>
              <dd>{pokemon.height}ft</dd>
            </dl>
          </div>
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
          />
        </div>
      )}
    </div>
  );
}
```

```css
/* components/PokemonView.module.css */
.back-btn {
  background-color: white;
  border-radius: 10px;
  padding: 7px 15px;
  color: black;
  text-decoration: none;
  border: solid #f0f0f0 1px;
  font-size: 20px;
}

.back-btn:hover {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.pokemon {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.name {
  font-size: 50px;
  font-weight: 700;
}

.pokemon img {
  width: 400px;
}

.spec {
  display: flex;
  font-size: 18px;
  margin-top: 10px;
}

.label {
  font-weight: 700;
}
```

## Conclusion

That’s it! You just created a multi thread full stack application with rust and react. 

The project is still under heavy development and the script for the production build (`tuono build`) is not ready yet but 
I hope you got the taste of what is like working with rust and react in the same stack.
