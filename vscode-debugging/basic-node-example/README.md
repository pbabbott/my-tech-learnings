
# Overview

This example demonstrates how to use the built-in VS code tools to run various commands against a basic Node.js project.

# Problem statement

I want to know how to use the VS Code IDE better.  I know there are sections on the side-bar for running tests, debugging, and starting / stopping an API, though I typically only use the terminal.

While I do love running commands in the terminal, I wonder if using some of the built-in VS code features, perhaps I might be able to work a little more effectively.

I am particularly interested in the debugger and making sure that I can use it with both Node.js and Express.

# Getting Started

In order to get started with this example, please refer to the [Getting Started Guide](./docs/getting-started.md)

# Solutions / Explorations

Below are some of my learnings and solutions to the problem statement above.


## VS Code Debugging deep-dive

I read through all of the VS Code Debugging documentation and captured my notes and various screenshots across these articles.  I tried to focus on just the most useful bits rather than just copy-pasting the whole documentation.

- [Basic Debugging](./docs/basic-debugging/README.md) - This shows how to set up basic debugging configurations with Node.js.
- [Using the Debugger](./docs/using-the-debugger/README.md) - This doc explains how to use the debugger with the most important hot-keys. 
- [Advanced Setup](./docs/advanced-setup/README.md) - Here are some advanced setup features which can make life even easier
- [Node.js Debugging](./docs/nodejs-debugging/README.md) - Here are the most useful bits of the VS Code guide to debugging Node.js applications specifically.

# Reflection

After reading through the debugger documentation, practicing setting up the debugger, creating documentation, and ultimately getting things working here are some of my key take-aways.

- The auto attach feature with `integratedTerminal` is very cool! It basically allows you to work in the VS Code Terminal and with the debugger in a very flexible way.  That is, you can keep the integrated terminal experience, but it doesn't matter how you start the app, the debugger will always be there.
- Typescript, Docker, & Remote Debugging requires extra set up with source maps and more configuration.  I want to explore this in a separate effort.
- Testing and test execution seems like its a fully separate context.  I bet with auto-attach, I could probably figure out how to get tests to work, but I think I want to handle test runs within the IDE in a separate effort too.
- I now feel very confident working with `.vscode/launch.json` and how it is supposed to work.

