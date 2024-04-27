# Repository structure doc

## Monorepo tool
- [Turborepo](https://turbo.build/repo)

## Packages
> Highly inspired by [@tanstack/router](https://tanstack.com/router/latest)

- vite-fs-router
    - vite plugin interface
    - router generator
- react-router
- react-router-server
- tuono-runtime (entry point)

### JS Public interface
- tuono-runtime (all in one js framework package)

## Crates
- tuono (cli interface)
- tuono-axum-builder (axum project builder)
- tuono-watch (folder watch reload)

### Rust Public interface
- tuono (cli, dev and prod environment)
