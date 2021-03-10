# Serverless Cors Plugin

A Serverless plugin that injects the common cors configuration for wellbeing Node.js APIs.

### Purpose

When you enable cors inside the serverless.yml file, you're allowing those headers to be passed though Api Gateway, it does not set them.

Our custom GraphQL handlers set the values of these headers, via the build in Apollo property. However, if the GraphQL handler is unable to set the headers (for example, in the event of an authentication error), then these headers are not set, and the client will receive a cors error instead of the auth error.  

This package monkey-patches the Default Api Gateway Response for 4xx and 5xx errors to the serverless resources. 

### Requirements
- Node.js v14
- Access to the wellbeing npm account

### Usage:
Install the package as a dev dependency
```shell
$ npm install -D @lifeworks/serverless-cors-plugin
```
Include the plugin in your serverless.yml
```yaml
plugins:
  - '@lifeworks/serverless-cors-plugin'
```

### Installation
```shell
$ git clone git@github.com:workivate/serverless-cors-plugin.git
$ cd serverless-cors-plugin
$ npm install
```

### Running the tests
```shell
$ npm test 
```

### Generating a build
```shell
$ npm run build
```
