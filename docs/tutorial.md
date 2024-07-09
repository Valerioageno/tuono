# Tuono tutorial

This tutorial is meant for giving you a sneak peek of the framework and is intended to evolve along the development - be sure to have installed the latest version.

The first part is about the project setup and the base knowledge needed to work with tuono. The actual tutorial starts at [Tutorial introduction](#tutorial-introduction).

> I'd love to hear your thoughts about the framework and the tutorial - feel free to reach me 
at [valerioageno@yahoo.it](mailto:valerioageno@yahoo.it) or on Twitter (X) DMs 
[@valerioageno](https://twitter.com/valerioageno)

This tutorial is **not meant** for people that don't know React - in that case I suggest you to first read the [React doc](https://react.dev/);

Typescript and Rust knowledge is not a requirement though!

## Table of Content

* [CLI Installation](#cli-installation)
* [Project scaffold](#project-scaffold)
* [Start the dev environment](#start-the-dev-environment)
* [The “/” route](#the--route)
* [Tutorial introduction](#tutorial-introduction)
* [Fetch all the pokemons](#fetch-all-the-pokemons)
* [Create a stand-alone component](#create-a-stand-alone-component)
* [Create the /pokemons/[pokemon] route](#create-the-pokemonspokemon-route)
* [Error handling](#error-handling)
* [Handle redirections](#handle-redirections)
* [Building for production](#building-for-production)
* [Conclusion](#conclusion)

## CLI Installation

The tuono CLI is hosted on [crates.io](https://crates.io/crates/tuono); to download and install it just run on a terminal:

```bash
$ cargo install tuono
```

To check that is correctly installed run:

```bash
$ tuono --version
```

Run `tuono -h` to see all the available commands.

## Project scaffold

To setup a new fresh project you just need to run the following command:

```bash
$ tuono new tuono-tutorial
```

Get into the project folder and install the dependencies with:

```bash
$ npm install
```

Open it with your favourite code editor.

The project will have the following structure:

```
├── package.json
├── public
├── src
│   ├── routes
│   └── styles
├── Cargo.toml
├── README.md
└── tsconfig.json
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
- Changing http status code
- Redirecting to a different route

## Tutorial introduction

Now that we have some knowledge about the project structure let’s start the real tutorial. 

The goal is to use the [PokeAPI](https://pokeapi.co/docs/v2) to list all the pokemons of the first generation (the best one btw) and then reserve a dynamic page for each one separately.

> If you have already installed the tuono CLI and you prefer read the code instead of writing it yourself 
you can download the tutorial source with `tuono new tuono-tutorial --template tutorial`

## Fetch all the pokemons

To start let’s fetch all of them in the root page; since we want to render them on the server side we gonna need to implement the logic in the `index.rs` file.

Clear the `index.rs` file and paste:

```rust
// src/routes/index.rs
use serde::{Deserialize, Serialize};
use tuono_lib::reqwest::Client;
use tuono_lib::{Props, Request, Response};

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
async fn get_all_pokemons(_req: Request, fetch: Client) -> Response {
    return match fetch.get(ALL_POKEMON).send().await {
        Ok(res) => {
            let data = res.json::<Pokemons>().await.unwrap();
            Response::Props(Props::new(data))
        }
        Err(_err) => Response::Props(Props::new("{}")),
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

> 💡 SASS is supported out of the box. Just install the processor in the devDependencies `npm i -D sass` and run again `tuono dev`

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
// src/routes/pokemons/[pokemon].rs
use serde::{Deserialize, Serialize};
use tuono_lib::reqwest::Client;
use tuono_lib::{Props, Request, Response};

const POKEMON_API: &str = "https://pokeapi.co/api/v2/pokemon";

#[derive(Debug, Serialize, Deserialize)]
struct Pokemon {
    name: String,
    id: u16,
    weight: u16,
    height: u16,
}

#[tuono_lib::handler]
async fn get_pokemon(req: Request, fetch: Client) -> Response {
    // The param `pokemon` is defined in the route filename [pokemon].rs
    let pokemon = req.params.get("pokemon").unwrap();

    return match fetch.get(format!("{POKEMON_API}/{pokemon}")).send().await {
        Ok(res) => {
            let data = res.json::<Pokemon>().await.unwrap();
            Response::Props(Props::new(data))
        }
        Err(_err) => Response::Props(Props::new("{}"))
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

## Error handling

With the current setup all the routes always return a `200 Success` http status no matter the response type.

In order to return a more meaningful status code to the browser the `Props` struct can be initialized with also the
`Props::new_with_status()` method.

Let's see how it works!

```diff
// src/routes/pokemons/[pokemon].rs
use serde::{Deserialize, Serialize};
-- use tuono_lib::reqwest::Client;
++ use tuono_lib::reqwest::{Client, StatusCode};
use tuono_lib::{Props, Request, Response};

const POKEMON_API: &str = "https://pokeapi.co/api/v2/pokemon";

#[derive(Debug, Serialize, Deserialize)]
struct Pokemon {
    name: String,
    id: u16,
    weight: u16,
    height: u16,
}

#[tuono_lib::handler]
async fn get_pokemon(req: Request, fetch: Client) -> Response {
    // The param `pokemon` is defined in the route filename [pokemon].rs
    let pokemon = req.params.get("pokemon").unwrap();

    return match fetch.get(format!("{POKEMON_API}/{pokemon}")).send().await {
        Ok(res) => {
++            if res.status() == StatusCode::NOT_FOUND {
++                return Response::Props(Props::new_with_status("{}", StatusCode::NOT_FOUND));
++             }

            let data = res.json::<Pokemon>().await.unwrap();
            Response::Props(Props::new(data))
        }
--        Err(_err) => Response::Props(Props::new(
++        Err(_err) => Response::Props(Props::new_with_status(
++            "{}",
++            StatusCode::INTERNAL_SERVER_ERROR,
        )),
    };
}
```

```diff
// src/routes/index.rs
use serde::{Deserialize, Serialize};
-- use tuono_lib::reqwest::Client;
++ use tuono_lib::reqwest::{Client, StatusCode};
use tuono_lib::{Props, Request, Response};

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
async fn get_all_pokemons(_req: Request, fetch: Client) -> Response {
    return match fetch.get(ALL_POKEMON).send().await {
        Ok(res) => {
            let data = res.json::<Pokemons>().await.unwrap();
            Response::Props(Props::new(data))
        }
--        Err(_err) => Response::Props(Props::new(
++        Err(_err) => Response::Props(Props::new_with_status(
++            "{}", // Return empty JSON
++            StatusCode::INTERNAL_SERVER_ERROR,
        )),
    };
}
```

If you now try to load a not existing pokemon (`http://localhost:3000/pokemons/tuono-pokemon`) you will 
correctly receive a 404 status code in the console.

## Handle redirections

What if there is a pokemon among all of them that should be considered the GOAT? What
we are going to do right now is creating a new route `/pokemons/GOAT` that points to the best
pokemon of the first generation.

First let's create a new route by just creating an new file `/pokemons/GOAT.rs` and pasting the following code:

```rs
// src/routes/pokemons/GOAT.rs
use tuono_lib::{reqwest::Client, Request, Response};

#[tuono_lib::handler]
async fn redirect_to_goat(_: Request, _: Client) -> Response {
    // Of course the GOAT is mewtwo - feel free to select your favourite 😉
    Response::Redirect("/pokemons/mewtwo".to_string()) 
}
```

Now let's create the button in the home page to actually point to it!

```diff
// src/routes/index.tsx

<ul style={{ flexWrap: 'wrap', display: 'flex', gap: 10 }}>
++      <PokemonLink pokemon={{ name: 'GOAT' }} id={0} />
        {data.results.map((pokemon, i) => {
          return <PokemonLink pokemon={pokemon} id={i + 1} key={i} />
        })}
</ul>
```

Now at [http://localhost:3000/](http:/localhost:3000/) you will find a new link at the beginning of the list.
Click on it and see the application automatically redirecting you to your favourite pokemon's route!

## Building for production

The source now is ready to be released. Both server and client have been managed in a unoptimized way
to easy the development experience. To build the project to the production state just run:

```shell
$ tuono build
```

This command just created the final assets within the `out` directory. To run then the prodiction server
run:

```shell
$ cargo run --release
```

Check again [`http://localhost:3000/`](http://localhost:3000/) - This environment now has all the
optimizations ready to unleash the power of a rust server that seamessly renders a React application!🚀

> Note: The `out` directory is not standalone. You can't rely just on it to run the production server.

## Conclusion

That’s it! You just created a multi thread full stack application with rust and react. 

The project is still under heavy development and many features are not ready yet but 
I hope you got the taste of what is like working with rust and react in the same stack.

As I mentioned in the introduction I'd love to hear what you thought about the framework and the tutorial - feel free to reach me 
at [valerioageno@yahoo.it](mailto:valerioageno@yahoo.it) or in Twitter (X) DMs [@valerioageno](https://twitter.com/valerioageno).
