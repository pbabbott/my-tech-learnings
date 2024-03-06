# Debugging Typescript

This document explains how to integrate the VS Code IDE debugging experience with a Typescript Project.

This documentation shows the highlights of this article on [Debugging Typescript](https://code.visualstudio.com/docs/typescript/typescript-debugging), as well as my reflections as to how it pertains to this project where an Express API is running.

As an aside, I am building off the debugging knowledge I learned in [Basic Node Example](../../../basic-node-example/README.md).

## Basic Setup

In order to get started, it seems VS Code recommends setting a handful of items in the `tsconfig.json` such as enabling source maps, setting an `outDir` and of course targeting some version of JS older than current.

The `tsconfig.json` for this project has been brought up-to-date to have a similar configuration.

```json
{
  "compilerOptions": {
    "target": "ES5",
    "module": "CommonJS",
    "outDir": "out",
    "sourceMap": true
  }
}
```

## Default Debug Configuration

Following the VS Code Documentation, it seems they have an example which uses the `tsc` process.  I have updated it to use my build task as defined in `tasks.json`

```json
{
    "type": "node",
    "request": "launch",
    "name": "Launch Program",
    "program": "${workspaceFolder}/src/index.ts",
    "preLaunchTask": "npm:build",
    "outFiles": ["${workspaceFolder}/dist/**/*.js"]
}
```

Interestingly, the debugger runs `node` directly against the `dist/`.  

## Consolidate to `npm start`

I think I would rather have this run the command as defined in `npm run start`.

Following the guide from the `Basic Node Example` I am hoping to be able to reference the configuration for `npm run start:dev` to make something similar.

And... after a bit of tinkering... I was able to come up with this configuration:

```json
{
    "name": "npm start",
    "type": "node",
    "request": "launch",
    "console": "integratedTerminal",
    "runtimeArgs": [
        "run-script",
        "start"
    ],
    "runtimeExecutable": "npm",
    "skipFiles": [
        "<node_internals>/**"
    ],
    "serverReadyAction": {
        "pattern": "listening on port: ([0-9]+)",
        "uriFormat": "http://localhost:%s",
        "action": "openExternally",
    },
    "preLaunchTask": "npm:build",
    "outFiles": ["${workspaceFolder}/dist/**/*.js"]
}
```

This effectively runs `npm run start`, but firsts runs the VS Code task called `npm:build`.  With the `outFiles` designated and with the source maps present, I am able to use the debugger against `.ts` files.  Wahoo!


## Reflection on: `npm start:dev` and `ts-node`

After building this configuration, I'm left wondering what are the differences between doing it this way and just using `ts-node` via my `npm run start:dev` command from earlier?

Looking at this [Stack Overflow post](https://stackoverflow.com/a/51456915/910678), it seems `ts-node` will target a single file and then step through a chain of `import` dependencies, whereas `tsc` will transpile all files according to the `tsconfig.json`.  

This makes me wonder.. to what extent does `ts-node` respect `tsconfig.json` ? -- A quick google search brought me to the [`ts-node` documentation](https://typestrong.org/ts-node/docs/troubleshooting/#configuration).  And it seems there are some sensible defaults chosen as well as `ts-node` settings used as well.  So its not quite an exact match.  It seems the Stack Overflow person is correct!

Another thing that is missing is `nodemon`!  This means as I update code, I'll have to rebuild every time!  This is less than ideal...


## Reflection on: `tsc --watch`

In my googling around on this subject, I see that `tsc --watch` is a very efficient way to do incremental builds.  My current setup which runs `npm run clean` re-runs a fresh build every time.  This feels a bit slow with just two files, and I'm a little worried it won't scale well when there are lots of files present.

I think it makes sense to try and use `tsc --watch` along with my `tsconfig.json` configuration to see if I can get warm-reloading working with typescript and the VS code debugger.

And... upon googling around, I have discovered the npm package [`tsc-watch`](https://www.npmjs.com/package/tsc-watch) which simply runs `tsc --watch` but adds the ability to respond to compilation status.

With this package, I have set up a new `start:dev` command:

```json
"start:dev": "tsc-watch --onSuccess \"node ./dist/index.js\"",
```

And then.. updating the `.vscode/launch.json` to match results in a fantastic debugging experience with warm reloading.  That is..

- The `preLaunchTask` executes `npm run clean` which clears out the `./dist` folder upon pushing `F5`
- `tsc-watch` watches the project for changes and respects the `tsconfig.json`
- Changes to the project only restart the `node.js` process, and not the `tsc-watch` process, so we can edit code without a full rebuild.
- This allows for a fresh start every time, but while working, just rebuild what is needed!
  - No need for `nodemon` or `ts-node`
  - I did add `tsc-watch` instead.

Here is my final configuration for local typescript debugging:

```json
{
    "name": "npm start:debug",
    "type": "node",
    "request": "launch",
    "console": "integratedTerminal",
    "runtimeArgs": [
        "run-script",
        "start:dev"
    ],
    "runtimeExecutable": "npm",
    "skipFiles": [
        "<node_internals>/**"
    ],
    "serverReadyAction": {
        "pattern": "listening on port: ([0-9]+)",
        "uriFormat": "http://localhost:%s",
        "action": "openExternally",
    },
    "preLaunchTask": "npm:build",
    "outFiles": ["${workspaceFolder}/dist/**/*.js"]
}
```