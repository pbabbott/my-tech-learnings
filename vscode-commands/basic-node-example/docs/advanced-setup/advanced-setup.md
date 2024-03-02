# Advanced Setup

## Launch.json attributes

- `type` - this is the language (`php`, `go`, `node`, etc..)
- `request` - just `launch` or `attach`
- `name` - dropdown display

*optional:*
- `presentation` - using the `order`, `group`, and `hidden` attributes in the `presentation` object, you can sort, group, and hide configurations and compounds in the Debug configuration dropdown and in the Debug quick pick.
- `preLaunchTask` / `postDebugTask` - launch a task before/after a debug session as defined in `.vscode/tasks.json`
  - `${defaultBuildTask}` 
- `internalConsoleOptions` - visibility of debug panel
- `serverReadyAction` - if you want to open a URL in a web browser whenever the program under debugging outputs a specific message to the debug console or integrated terminal. 

*other:*
- `program` - executable or file to run when launching the debugger
- `args` - arguments passed to the program to debug
- `env` - environment variables (the value null can be used to "undefine" a variable)
- `envFile` - path to dotenv file with environment variables
- `cwd` - current working directory for finding dependencies and other files
- `port` - port when attaching to a running process
- `stopOnEntry` - break immediately when the program launches
- `console` - what kind of console to use, for example, internalConsole, integratedTerminal, or externalTerminal

## Variable Substitution

Its possible to use system environment variables within a launch.json configuration.  For example, getting the `username`
 
```json
 "args": ["${env:USERNAME}"]
```

## Multi-platform

We can make all the slashes go backwards with the following.  Valid options are `windows`, `linux` and `osx`
```json
 "windows": {
    "args": ["myFolder\\path\\app.js"]
 }
```


## Global Launch

Its possible to use the `launch` option in user settings.  Allowing a single configuration across workspaces.

```json
// user settings
"launch": {
    "version": "0.2.0",
    "configurations": [{
        "type": "node",
        "request": "launch",
        "name": "Launch Program",
        "program": "${file}"
    }]
}
```

## Compound (client + server)

Here's an example of how to start both a client and server file
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Server",
      "program": "${workspaceFolder}/server.js"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Client",
      "program": "${workspaceFolder}/client.js"
    }
  ],
  "compounds": [
    {
      "name": "Server/Client",
      "configurations": ["Server", "Client"],
      "preLaunchTask": "${defaultBuildTask}",
      "stopAll": true
    }
  ]
}
```

## Automatically open a URI when debugging a server program

This bit of code will scrape the logs and then string replace the port number to launch a web browser with the proper URI! Neat!

```json
"serverReadyAction": {
    "pattern": "listening on port: ([0-9]+)",
    "uriFormat": "http://localhost:%s",
    "action": "openExternally"
    }
}
```