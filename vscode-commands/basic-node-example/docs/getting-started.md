# Getting Started

## Required Software 
To work with this project, here's what you'll need available on your computer.

- VS Code
- Node.js version 18
- NPM version 9

## Node.js Commands:

### Packages

Install packages with:

```sh
npm install
```

### Entry Points

There are two entrypoints into this API.

The first is `src/consoleEntrypoint.js`  - this is meant to mimic some manual routine that needs to be run like a database migration script.

The second is `src/index.js` - this is meant to start the API and stay running as a service on a particular port.

### Commands

`npm run start:console` - this will run the console program

`npm run start:dev` - this will start the API on port 3000