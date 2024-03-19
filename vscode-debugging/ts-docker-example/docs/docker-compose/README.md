# Docker Compose Debugging

Now that I have set up [debugging with docker containers](../docker-runtime/README.md), I now want to set up debugging with docker compose.  My hope is that I can simplify the VS Code configuration as it felt highly duplicated with docker compose configuration.

## Approach

In previous attempts to set up docker, I wound up getting a few docker compose files.  I think I will start by setting up `docker-compose` to just support a development runtime, as a release configuration isn't much different from development.  Moreover, I want to try debugging with Kubernetes after I finish this docker compose integration.

## `docker-compose` Configuration

After a bit of tinkering, I was able to craft a simple `docker-compose.yml` file that spins up the API

```yml
version: '3.4'

services:
  tsdockerexample:
    image: tsdockerexample
    build:
      context: .
      dockerfile: ./Dockerfile
      target: development
    environment:
      NODE_ENV: development
    volumes:
      - ./src:/app/src
    ports:
      - 3000:3000
      - 9229:9229
    command: "npm run start:debug"
```

## VS Code Orchestration

Next, I want to use VS Code to run `docker compose up` and then attach the to container. I should be able to reference this [vs code documentation](https://code.visualstudio.com/docs/containers/docker-compose) to accomplish this.

...

So, after some tinkering, I was able to make a little progress. 

```json
// launch.json
{
    "name": "docker-compose debug:dev",
    "type":"node",
    "request": "attach",
    "port": 9229,
    "address": "localhost",
    "localRoot": "${workspaceFolder}",
    "remoteRoot": "/app",
},
```

This configuration does attach to the already-running `docker compose` stack.  I did try to leverage the `preLaunchTask` as I did with the plain docker container approach; however, I could not get the debugger to attach.

I need more information as to why it did not connect.

## Debugging the debug configuration

After some digging, I found that there is a more native way to run docker-compose commands.

https://code.visualstudio.com/docs/containers/reference#_docker-compose-task

This newly formed task will properly attach the debugger.

```json
{
    "type": "docker-compose",
    "label": "compose:up",
    "dockerCompose": {
      "up": {
        "detached": true,
        "build": true
      },
      "files": [
        "${workspaceFolder}/docker-compose.yml"
      ]
    }
  }
```

# Reflection

It seems when working with docker-compose, that the experience is very similar to the docker configuration I created earlier.  I did find the advantage I was looking for in that the configuration for docker code is largely managed by `docker-compose.yml` rather than by VS Code's similar configuration.  I am glad I was able to get something working that feels more native.

In order to get the debugger working, I had to set `deatched: true` which did not stream logs to the console.  This means to get logs I either need to run `docker compose logs -f [service-name]` or I need to use the UI to right-click and get logs.  This is the same experience I got when working with the docker configuration.

I think I've changed my stance of being annoyed by having to right click to get logs.  That is, I'm imagining having tons of logs coming through via a SQL Server database, and that just doesn't feel desireable. Perhaps having the developer manually select logs is actually desirable.  Though, there might be a way to automate this process.

## Final Attempt at streaming logs

After some thought, I tried to set up a vs code task called `compose:up:logs` to first run `docker compose up` then to run `docker compose logs -f` - See below.

```json
	{
    "type": "shell",
    "label": "compose:up:logs",
    "dependsOn": [
      "compose:up"
    ],
    "command": "docker compose logs -f",
    "isBackground": true,
    "presentation": {
        "reveal": "always",
        "panel": "new"
    }
}
```

Unfortunately, streaming logs causes VS Code to hang and ultimately the debugger does not attach.  Setting `isBackground` to `true` seems to have no effect.

I have realized that running `docker compose up` is the launch activity, and streaming logs is just something that needs to happen separately.