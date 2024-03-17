# Overview
- [Overview](#overview)
- [Docker Runtime](#docker-runtime)
  - [Initial configuration](#initial-configuration)
  - [Analysis of Default Task Configuration](#analysis-of-default-task-configuration)
  - [Debug \& Release Runtime](#debug--release-runtime)
    - [Task Configuration](#task-configuration)
    - [Reflections on Task Configuration](#reflections-on-task-configuration)
      - [Notes on Setup](#notes-on-setup)
      - [Ideas to make it better](#ideas-to-make-it-better)
  - [Optimize the Experience](#optimize-the-experience)
    - [Debugging \& Hot Reloading](#debugging--hot-reloading)
    - [Cleanup](#cleanup)
- [Reflections](#reflections)


# Docker Runtime

Now that I have set up a way to build docker images with VS Code (see: [Basic Docker Build](../basic-docker-build/README.md)), I am interested to now run containers using these images with VS Code.

## Initial configuration

When I used the Docker for VS Code extension to automatically set up docker with this typescript project (see: [Docker Integration](../docker-integration/README.md)).  It generated a few tasks, a launch configuration, and a few docker-compose files.

I would like to re-work these files to my preference and work with them to foster a better understanding of how to run this project in multiple ways, as I already have a way to debug this project with TS using my host machine (see: [Debugging Typescript](../debugging-typescript/README.md))

For starters, here is the auto-generated code:

```json
// tasks.json configuration
{
    "type": "docker-run",
    "label": "docker-run: release",
    "dependsOn": [
        "docker-build"
    ],
    "platform": "node"
},
{
    "type": "docker-run",
    "label": "docker-run:debug",
    "dependsOn": [
        "docker-build"
    ],
    "dockerRun": {
        "env": {
            "DEBUG": "*",
            "NODE_ENV": "development"
        }
    },
    "node": {
        "enableDebugging": true
    }
}
```

```json
// launch.json configuration
{
    "name": "Docker Node.js Launch",
    "type": "docker",
    "request": "launch",
    "preLaunchTask": "docker-run:debug",
    "platform": "node"
}
```

## Analysis of Default Task Configuration

I found the documentation for the `docker-run` task

https://code.visualstudio.com/docs/containers/reference#_docker-run-task

From the documentation:

> The `dockerRun` object specifies parameters for the Docker run command. Values specified by this object are applied directly to Docker run CLI invocation.
> 
> The `platform` property is a hint that changes how the docker-run task determines Docker run defaults.
> 
> - `dockerRun.command` - Generated from the npm start script in the package.json (if it exists), else generated from the main property in the package.json.
> - `dockerRun.containerName` - Derived from the application package name.
> - `dockerRun.image` - The tag from a dependent docker-build task (if one exists) or derived from the application package name, itself derived from the name property within package.json or the base name of the folder in which it resides.

Looking at the auto-generated code, I'm noticing a few things:
- `"platform": "node"` - This makes good sense as we're dealing with a node application within docker.
- `"type": "docker-run"` - this appears to be the type of command to run - easy, we want a `docker run ___` command
- `dependsOn` - Since there is no `containerName` or `imageName` specified, it seems the dependent build is indeed the one used for the docker run.


## Debug & Release Runtime

I should be able to form a task to run both a debug and release runtime, given that I have builds: `docker:build:dev` and `docker:build:release`

### Task Configuration

And... after a bit of tinkering I was able to form two run tasks that enables hot reloading for dev runs via a volume mount 


```json
// Dev Run Task
{
    "type": "docker-run",
    "label": "docker:run:dev",
    "dependsOn": [
        "docker:build:dev"
    ],
    "dockerRun": {
        "command": "npm run start:debug",
        "ports": [
            {
                "containerPort": 3000,
                "hostPort": 3000
            }
        ],
        "volumes": [
            {
                "localPath": "${workspaceFolder}/src",
                "containerPath": "/app/src"
            }
        ],
        "env": {
            "NODE_ENV": "development"
        }
    },
    "node": {
        "enableDebugging": true
    }
},
// Release Run Task
{
    "type": "docker-run",
    "label": "docker:run:release",
    "dependsOn": [
        "docker:build:release"
    ],
    "dockerRun": {
        "command": "npm run start",
        "ports": [
            {
                "containerPort": 3000,
                "hostPort": 3000
            }
        ],
        "env": {
            "NODE_ENV": "production"
        }
    }
}
```

### Reflections on Task Configuration

#### Notes on Setup
After working to come up with this configuration there are a few things that stood out to me.
- These run configurations are awfully close to a `docker-compose` spec.  Specifying ports, volumes, commands, etc.. is basically what exists in a `docker-compose.yml` file.  I'm not sure that I want to keep this configuration long term.
- The lifecycle of running each of these tasks is a bit tedious.  
  - `CTRL+SHIFT+P` for command palette 
  - Type `task`
  - Run the desired task
  - If the container crashes, it needs to be manually removed. (ie right click, delete container)
  - Viewing logs requires right-clicking on the container to view logs.
- The Default launch configuration is above in the first section and seems weirdly simple.  The launch task simply runs a preLaunchTask to perform the docker run task.
  - This paired with the type `launch` feels weird, as I would have expected an `attach` to an existing thing.

#### Ideas to make it better
- Since `"console": "integratedTerminal",` is an aspect of the launch configuration, I should press onward to the launch config to see if I can get the debugger working and ease the lifecycle of working with the container.
- When using the `launch.json` configuration, hot-reloading no longer works, as it kills the container.  
  - I would guess that losing the connection on port `9229` might kill the debug experience and subsequently the container
- Running a launch task is not quite what I want. Instead, I want to be able to hit `F5` and have any debug item start
- It would also be nice to get the "auto attach" feature working just as i have it configured with Node.js run-times

## Optimize the Experience

### Debugging & Hot Reloading

While I am able to launch the app with `F5`, i'm not able to hit any breakpoints.  

I've also noticed that hot-reloading only works if you run a task, but not if you run the launch configuration.  I want to figure out how to solve this.

...

After a bit of tinkering, I was able to come up with a launch configuration that addresses these issues:

```json
{
    "name": "docker:attach:dev",
    "type":"node",
    "request": "attach",
    "restart": true,
    "port": 9229,
    "address": "localhost",
    "localRoot": "${workspaceFolder}",
    "remoteRoot": "/app",
    "preLaunchTask": "docker:run:dev",
}
```

Mapping the `localRoot` and `remoteRoot` solved the hot-reloading issue.  And attaching allows me to keep using `tsc-watch`.

### Cleanup

Now that I have a working config, the tricky part is stopping and possibly removing the docker container.

Given that I have set up a `preLaunchTask` to start the container, now I have to figure out a way to stop the container.

Ideally I could use `postDebugTask` to perform some sort of docker cleanup routine.

... 

And after googling around and tinkering, I was able to arrive at this solution:

```json
// in tasks.json
{
    "type": "shell",
    "label": "docker:stop:dev",
    "command": "docker",
    "args": [
        "stop",
        "ts-docker-example",
        "&&",
        "docker",
        "rm",
        "ts-docker-example"
    ],
    "problemMatcher": []
},
```

```json
// in launch.json
{
    "name": "docker debug:dev",
    "type":"node",
    "request": "attach",
    "restart": true,
    "port": 9229,
    "address": "localhost",
    "localRoot": "${workspaceFolder}",
    "remoteRoot": "/app",
    "preLaunchTask": "docker:run:dev",
    "postDebugTask": "docker:stop:dev"
}
```

# Reflections

I feel awesome that I was able to get all the same debugging and development features working with docker compose as I did with just regular Typescript!

While working through all of these issues, I realized that much of the VS Code configuration is highly similar to `docker-compose` configuration.  There was a lot of extra work to do in order to make sure that containers were created and destroyed, which felt un-necessary when `docker compose up` and `docker compose down` exist.

The one thing I don't really like is that I have to go to the container and right-click to get logs. This does not feel highly scalable to me, as I may need to work with multiple containers.

I think I want to redo this exercise and next break down [Debugging with Docker-Compose](../docker-compose/README.md)