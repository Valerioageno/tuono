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

> If you want to see how this project actually works check the [tutorial](https://github.com/Valerioageno/tuono/blob/main/docs/tutorial.md) page.

## Introduction

NodeJs/Deno/Bun are the only tools that make a React app fullstack right? (no) 

Tuono wants to prove that it's possible creating fully fledged react applications without the need to host them on a JS runtime server leveraging the best of the two worlds: 
super powered server and amazing development experience.

## Features

- [x]  Typescript
- [x]  FS routing
- [x]  Hot Module Reload
- [x]  CSS modules
- [x]  Rust based SSR
- [x]  Multi thread backend
- [x]  Development environment
- [ ]  Create custom APIs
- [ ]  Image optimization
- [ ]  Build optimization
- [ ]  Server streamed content

## Requirements

- rust
- cargo
- node
- pnpm (other package managers support will be added soon)

## Installation

```
cargo install tuono
```

## Create a new project

```
tuono new [NAME]
```

## Development

```
tuono dev
```

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
