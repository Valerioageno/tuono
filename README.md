<p align="center">
  <img src="https://raw.githubusercontent.com/Valerioageno/tuono/main/assets/logo.png" width="200px">
</p>
<h1 align="center">Tuono<br>The react/rust fullstack framework</h1>
<p align="center">
⚠️ This project is under heavy development. API might drastically change ⚠️
</p>


Tuono (Italian word for "thunder", pronounced /2 Oh No/). 
Why Tuono? Just a badass name.

## Introduction

NodeJs/Deno/Bun are the only tools that make a React app fullstack right? (TLDR; no) 

Techically the only thing React needs to do on the backend side is to render the HTML and returns it in the response payload and for it just a JS engine is required. 
Why then we need to bring the entire runtime?

Tuono wants to prove that it's possible creating fully fledged react applications without the need to host them on a JS runtime server leveraging the best of the two worlds: 
super powered server and crazy cool development experience.

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
## Features

- [x]  FS routing
- [x]  Hot Module Reload
- [x]  CSS/SCSS modules
- [x]  Rust based server side rendering
- [x]  Multi thread backend
- [x]  Development environment
- [ ]  Create custom APIs
- [ ]  Image optimization
- [ ]  Build optimization

> 💡 Any suggestion or improvement is strongly appreciated

## Folder structure

```
| public/ 
- src/
  | routes/
  |	styles/
| package.json
| Cargo.toml
| .gitignore
| tsconfig.json
```

## License

This project is licensed under the MIT License.
