# Default API Gateway Cors Response

A Serverless plugin that injects default cors headers

### Purpose

When you enable cors inside the serverless.yml file, you're allowing those headers to be passed though Api Gateway, it does not set them.

Generally your application will return the cors related headers. However, in the event that the application can't set the headers (for example, when an authorisation lambda rejects), then the headers won't be set.

This package monkey-patches the Default Api Gateway Response for 4xx and 5xx errors to the serverless resources. 

### Requirements
- Node.js v14

### Usage
Install the package as a dev dependency
```shell
$ npm install -D serverless-plugin-default-api-gateway-cors-response
```
Include the plugin in your serverless.yml
```yaml
plugins:
  - 'serverless-plugin-default-api-gateway-cors-response'
```
Configure the options (optional)
```yaml
custom:
  default-api-gateway-cors-response:
    origin: '*'
    headers:
      - 'Accept'
      - 'Authorization'
    statusCodeRanges:
      - '4XX'
      - '5XX'
```

### Installation
```shell
$ git clone git@github.com:lemonJS/serverless-plugin-default-api-gateway-cors-response.git
$ cd serverless-plugin-default-api-gateway-cors-response
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
