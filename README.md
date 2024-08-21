[Documentation](https://tuono.dev) | [Tutorial](https://github.com/Valerioageno/tuono/blob/main/docs/tutorial.md) |
[✨Contributing](https://tuono.dev/documentation/contributing)

# Tuono

<img align="right" src="https://raw.githubusercontent.com/Valerioageno/tuono/main/assets/logo.png" width="160px">

![](https://github.com/Valerioageno/tuono/actions/workflows/rust.yml/badge.svg)
![](https://github.com/Valerioageno/tuono/actions/workflows/typescript.yml/badge.svg)

Adding file to commit history for testing

**Tuono is the fastest React framework out there**

Tuono (Italian word for "thunder", pronounced /2 Oh No/). 
Why Tuono? Just a badass name.

Some of its features are: 

- 🟦  Native Typescript
- 🌐  NextJs like Routing
- 🍭  CSS/SCSS modules
- 🧬  Server Side Rendering
- 🔥  Hot Module Reload

## 📖 Documentation

The [documentation](https://tuono.dev/documentation) is available on
[tuono.dev](https://tuono.dev/).

## Introduction

**NodeJs/Deno/Bun are the only runtimes that allow a React app to be fullstack right? (no)**

Tuono is a fullstack React framework with the server side written in Rust. 
Because of this Tuono is extremely fast and the requests are handled by multithreaded Rust server.
React is still React - it is just superpowered.

**Rust is an hard language then writing server side code is hard as well right? (no again)**

Tuono provides a collection of utilities to handle the server side code seamlessly with the React code.
Each server side route is managed with a separate file alongside the React route. The routing is handled
by Tuono based on the files defined within the `./src/routes` directory.

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

## Contributing
Any help or suggestion will be appreciated and encouraged.
Check the [✨Contributing](https://tuono.dev/documentation/contributing) page

## License

This project is licensed under the MIT License.
