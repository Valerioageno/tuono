<p align="center">
  <img src="https://raw.githubusercontent.com/Valerioageno/tuono/main/assets/logo.png" width="200px">
</p>
<h1 align="center">Tuono<br>The react/rust fullstack framework</h1>
<p align="center">
⚠️ This project is under heavy development. API might drastically change ⚠️
</p>
<div align="center">
    <img src="https://github.com/Valerioageno/tuono/actions/workflows/rust.yml/badge.svg" />
    <img src="https://github.com/Valerioageno/tuono/actions/workflows/typescript.yml/badge.svg" />
</div>

<br>
<br>


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
Each server side route is managed with a separate file alongside the React route (the client/server 
logic matching is handled by Tuono itself).

## Features

- 🟦  Typescript
- 🌐  Routing
- 🔥  Hot Module Reload
- 🍭  CSS modules
- 📨  Server Side Rendering
- 🌐  Multi thread backend
- Create custom APIs*
- Image optimization*
- Build optimization*
- Server streamed content*

> *Development in progress

## Getting started

As already mentioned above I strongly suggest to take a look to the
[tutorial](https://github.com/Valerioageno/tuono/blob/main/docs/tutorial.md).

Tuono is basically a CLI that provides all the commands to handle the fullstack project. 
To download it you need [cargo](https://doc.rust-lang.org/cargo/) which is the [rust](https://www.rust-lang.org/)
package manager.

To download and install it you just need to run `cargo install tuono`.

To create a new project run `tuono new [NAME]` (optionally you can pass the `--template` flag - check the 
[examples](https://github.com/Valerioageno/tuono/tree/main/examples) folder).

Then to run the local development environment run inside the project folder `tuono dev`

> 💡 The `tuono build` command is not ready yet - I'm working on it right now.

## Requirements

- rust
- cargo
- node
- pnpm (other package managers support will be added soon)

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
Any help or suggestion will be appreciated.

## License

This project is licensed under the MIT License.
