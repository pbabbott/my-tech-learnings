# Kubernetes Debugging

Now that I have set up [debugging with docker compose](../docker-compose/README.md), I want to take on one more container runtime: Kubernetes.

I want to know how I can attach a debugger to a Typescript project running in a remote, optimized environment.  I imagine I'll need to consider my previous learnings with regard to source maps, ports, and attaching to an already running service.

## Approach

### Set up Kubernetes
I first need to set up a working Kubernetes Cluster.  The machine I am using to author this project is WSL 2, so I'll need to use something light weight and compatible.

After a little googling, it seems I can use `microk8s` to accomplish this.  I will try following [this guide](https://microk8s.io/docs/install-wsl2).

I had to enable `systemd` as per this guide: https://github.com/microsoft/WSL/issues/5126

### Setup VS Code Kubernetes Extension

In the spirit of learning more about VS Code, I am going to start by installing the Kubernetes VS Code extension: `ms-kubernetes-tools.vscode-kubernetes-tools`


https://code.visualstudio.com/docs/azure/kubernetes#_containerize-and-publish-the-application

https://learn.microsoft.com/en-us/visualstudio/bridge/bridge-to-kubernetes-vs-code