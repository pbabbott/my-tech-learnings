
# Overview

This example demonstrates how to use the built-in VS code tools to run various commands against a Typescript express API.

# Problem Statement

I want to know how to use the VS Code IDE better.  In my explorations in [`basic-node-example`](../basic-node-example/README.md) I did a deep dive on the debugger and how it works with Node.js projects.

While this experience was informative, I am left wondering how a debugger might work with Typescript, source maps, docker, docker-compose, and kubernetes.

I am particularly interested to see how remote debugging might work.

# Getting Started

In order to get started with this example, please refer to the [Getting Started Guide](./docs/getting-started.md)

# Solutions / Explorations

Below are some of my learnings and solutions to the problem statement above.

## VS Code and Typescript

- [Typescript Builds](./docs/typescript-builds/README.md) - This shows how to integrate Typescript builds within VS Code
- [Debugging Typscript](./docs/typescript-builds/README.md) - This document demonstrates how to efficiently debug a Typescript project with VS Code
- [Docker Integration](./docs/docker-integration/README.md) - This document shows what happens when you use VS Code code generation tools to automatically integrate with docker.
- [Basic Docker Build](./docs/basic-docker-build/README.md)
  - After sorting through the automatically generated code, I decided to try setting up a pattern to run docker builds via VS Code Tasks.  
  - In this exploration, I also determined how to use the Docker for VS Code extension to manage a build.
- [Docker Runtime](./docs/docker-runtime/README.md) - Next, I set up debugging and hot-reloading with a docker container leveraging the tasks I had just built.
- [Docker Compose Debugging](./docs/docker-compose/README.md) - Creating and destroying containers felt a bit clunky, so my next step was to set up debugging with docker compose.
- [Kubernetes Debugging](./docs/kubernetes-debugging/README.md) - Here I explore how to attach the debugger to a locally running kubernetes environment.

# Reflections

## Cool Shortcuts

- `CTRL+SHIFT+M` - this brings up the Problems window in VS Code. `m` is the last letter of `problem`!
- `CTRL+SHIFT+B` - this pulls up a menu for build tasks, or just runs the default one.
- `CTRL+SHIFT+P`, `task`, `Tasks: Run Task` - This gives the option to run any task.
- `F5` - Starts the most recently selected launch.json configuration.

> Coming soon!
