<p align="center">
  <img src="https://raw.githubusercontent.com/Valerioageno/tuono/main/assets/logo.png">
</p>
<h1 align="center">Tuono<br>The react/rust fullstack framework</h1>
<p align="center">
⚠️ This project is under heavy development. API might drastically change ⚠️
</p>


Tuono (Italian word for "thunder", pronounced /2 Oh No/). 
Why Tuono? Just a badass name.

## Installation

```
cargo install tuono
```

## Development

```
tuono dev
```

## Features
- Rust based server side rendering
- FS routing
- CSS modules
- Hot Module Reload
- Multi thread backend

## Folder structure

```
- .tuono
- public/
- src/
| - routes/
| | - api/
```

```tsx
// Data is passed by the loading function
const IndexPage = ({data, isLoading, isError}) => <h1>Index Page</h1>

export const Route = createFileRoute({
    loader: (params) => fetchApi(params),
    component: IndexPage
})
```
