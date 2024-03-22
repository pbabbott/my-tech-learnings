# Getting Started

## Required Software 
To work with this project, here's what you'll need available on your computer.

- VS Code
- Node.js version 18
- NPM version 9
- Locally running docker daemon
- Access to kubernetes cluster (I used `microk8s`)

## Node.js Commands:

### Packages

Install packages with:

```sh
npm install
```

### Entrypoints

There is one entrypoint into this API: `src/index.ts` - this is meant to start the API and stay running as a service on a particular port.

### Commands

`npm run start:dev` - This starts the API in development mode

`npm run build` - This runs a build and outputs javascript files into a `./dist` folder

`npm run start` - This targets the `./dist/index.js` file and is meant as an entry point for release builds.

`npm run start:debug` - This is the same as `start:dev` but includes the `--inspect` flag for the `node` process.

