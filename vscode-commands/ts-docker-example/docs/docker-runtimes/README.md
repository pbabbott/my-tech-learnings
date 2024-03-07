
Auto-generated code:

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
    "label": "docker-run: debug",
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
    "preLaunchTask": "docker-run: debug",
    "platform": "node"
}
```