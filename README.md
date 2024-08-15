[Documentation](https://tuono.dev) | [Tutorial](https://github.com/Valerioageno/tuono/blob/main/docs/tutorial.md) |
[✨Contributing](https://tuono.dev/documentation/contributing)

# Tuono

<img align="right" src="https://raw.githubusercontent.com/Valerioageno/tuono/main/assets/logo.png" width="160px">

![](https://github.com/Valerioageno/tuono/actions/workflows/rust.yml/badge.svg)
![](https://github.com/Valerioageno/tuono/actions/workflows/typescript.yml/badge.svg)


**Tuono** is the react/rust fullstack framework.

Tuono (Italian word for "thunder", pronounced /2 Oh No/). 
Why Tuono? Just a badass name.

> Check out the [tutorial](https://github.com/Valerioageno/tuono/blob/main/docs/tutorial.md) to get started.

## Introduction

**NodeJs/Deno/Bun are the only runtimes that allow a React app to be fullstack right? (no)**

Tuono is a fullstack React framework with the server side written in Rust. 
Because of this Tuono is extremely fast and the requests are handled by multithreaded Rust server.
React is still React - it is just superpowered.

**Rust is an hard language then writing server side code is hard as well right? (no again)**

Tuono provides a collection of utilities to handle the server side code seamlessly with the React code.
Each server side route is managed with a separate file alongside the React route. The routing is handled
by Tuono based on the files defined within the `./src/routes` directory.

## Features

- 🟦  Typescript
- 🌐  Routing
- 🔥  Hot Module Reload
- 🍭  CSS modules
- 🧬  Server Side Rendering
- 🧵  Multi thread backend
- ⌨️ MDX support
- ⚙️   Build optimizations
- Custom APIs*
- Image optimization*
- Server streamed content*

> *Development in progress

## Getting started

As already mentioned above I strongly suggest you to take a look at the
[tutorial](https://github.com/Valerioageno/tuono/blob/main/docs/tutorial.md).

Tuono is the CLI that provides all the needed commands to handle the fullstack project. 
To download it is required [cargo](https://doc.rust-lang.org/cargo/) which is the [rust](https://www.rust-lang.org/)
package manager.

Then run `cargo install tuono`.

To list all the available commands run `tuono -h`

To create a new project run `tuono new [NAME]` (optionally you can pass the `--template` (or `-t`) flag - check the 
[examples](https://github.com/Valerioageno/tuono/tree/main/examples) folder).

Then to run the local development environment run inside the project folder `tuono dev`

Finally when the project will be ready to be deployed just run `tuono build` to create the final React assets
and to set the server project in the `production` mode.

Now to execute it just run `cargo run --release`.

## Requirements

- rust
- cargo
- node
- npm/pnpm/yarn*

> yarn [pnp](https://yarnpkg.com/features/pnp) is not supported yet

## Folder structure

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

## Contributing
Any help or suggestion will be appreciated and encouraged.

## License

This project is licensed under the MIT License.
