# Node Spring Cloud Config Client

Node Spring Cloud Config Client provide client-side support to get the nodejs server configurations in a distributed system from a service build with use of Spring Cloud Config Server.


[![GitHub](https://img.shields.io/badge/GitHub-0.1.0-blue)](https://github.com/Effeppi/node-spring-cloud-config-client/tree/0.1.0)
![Build](https://github.com/Effeppi/node-spring-cloud-config-client/workflows/Build/badge.svg?branch=release/0.1.0)
[![LICENSE](https://img.shields.io/github/license/Effeppi/node-spring-cloud-config-client?label=License)](LICENSE)
[![Issue](https://img.shields.io/github/issues/Effeppi/node-spring-cloud-config-client?label=Issues)](https://github.com/Effeppi/node-spring-cloud-config-client/issues)
[![npm version](https://img.shields.io/badge/npm-0.1.0-red)](https://www.npmjs.com/package/node-spring-cloud-config-client/v/0.1.0)

---
## Install

```bash
# Using npm
npm install node-spring-cloud-config-client

# Using yarn
yarn add node-spring-cloud-config-client
```

## Usage


In your application, use init method to start the load of variables in your process.env

```javascript
//typescript
import {PropertySourcesContext} from 'node-spring-cloud-config-client'

//javascript
const {PropertySourcesContext} = require('node-spring-cloud-config-client')

...
...
// When in your server want to retry configuration from spring cloud config server
const propertySourcesContext = PropertySourcesContext.getInstance()
propertySourcesContext.load()
.subscribe(result => ...);

// You can also await execution of load method
const propertySourcesContext = PropertySourcesContext.getInstance()
const result = await propertySourcesContext.load()
.toPromise()

...

```


After load method, you can access environment variables from env with process.env:

```javascript
const database_password = process.env['db.password']
```



## Options

### Target config server

Properties dictionary:

  
| Property name          | Default value         | 
| ----                   | ----                  | 
| NSCCC_BASE_URI         | http://localhost:8888 | 
| NSCCC_APPLICATION_NAME | application           | 
| NSCCC_PROFILE          | <no profile active>   | 
| NSCCC_LABEL            | <no label>            | 
  
With the above properties, node-spring-cloud-config-client can perform the rest call to the correct spring cloud config server.

Based on properties will be create the rest call:

<NSCCC_BASE_URI>/<NSCCC_APPLICATION_NAME>/<NSCCC_PROFILE>/<NSCCC_LABEL>

Example:

| NSCCC_BASE_URI      | NSCCC_APPLICATION_NAME | NSCCC_PROFILE | NSCCC_LABEL | Rest call                                           | 
| ---------           | ---------              | ---------     | ---------   | ---------                                           | 
|                     |                        |               |             | http://localhost:8888/application/default           | 
| http://your.server/ |                        |               |             | http://your.server/application/default              | 
|                     | your-application-name  |               |             | http://localhost:8888/your-application-name/default | 
|                     |                        | dev           |             | http://localhost:8888/application/dev               | 
|                     |                        |               | label       | http://localhost:8888/application/default/label     | 
| http://your.server/ | your-application-name  | prod          |             | http://your.server/your-application-name/prod       | 
| http://your.server/ | your-application-name  | prod          | label       | http://your.server/your-application-name/prod/label | 
  

### fail strategy configuration

Properties dictionary:

| Property name            | Default value | 
| ----                     | ----          | 
| NSCCC_FAIL_FAST          | false         | 
| NSCCC_MAX_RETRY_ATTEMPTS | 6             | 
| NSCCC_SCALING_DURATION   | 1000          | 
  

You can specify what happen when call to propertie server fails.

If you want that when the call fails there are no error, set NSCCC_FAIL_FAST=false.

Otherwise, specify NSCCC_FAIL_FAST=true.

When NSCCC_FAIL_FAST not set 'true' or 'false', is like set NSCCC_FAIL_FAST to 'false'.

If *NSCCC_FAIL_FAST* set to true, is applied a retry that follow the properties *NSCCC_MAX_RETRY_ATTEMPTS* and *NSCCC_SCALING_DURATION*

With NSCCC_MAX_RETRY_ATTEMPTS specify how much times the retry will be performed.

With NSCCC_SCALING_DURATION specify what is scaling duration beetwen two retry.

Example:

``` bash
export NSCCC_MAX_RETRY_ATTEMPTS=4
export NSCCC_SCALING_DURATION=500
```

Suppose that your config server is down and does not respond.

After the first call to config server, node-spring-cloud-config-client perform another call after 500 ms, after 1000 ms, after 1500 ms and after 2000 ms. After that node-spring-cloud-config-client emit error.


### log configuration

Properties dictionary

| Property name        | Default value | accepted value   | if not accepted value | 
| ----                 | ----          | -----            | ----                  | 
| NSCCC_LOGGER_ENABLED | false         | true/false       | set to 'false'        | 
| NSCCC_LOGGER_LEVEL   | error         | debug/info/error | set to 'error'        | 
  

You may turn on/off the log with property NSCCC_LOGGER_ENABLED. 

You can specify level log with property NSCCC_LOGGER_LEVEL.


## More Documentation
For more documentation and information, visit this [guide](https://github.com/Effeppi/node-spring-cloud-config-client/wiki).

## Example usage
You can visit this [repository](https://github.com/Effeppi/node-spring-cloud-config-client-example) for other example of node-spring-cloud-config-client usage.