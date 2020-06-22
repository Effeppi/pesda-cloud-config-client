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
* [NSCCC_BASE_URI](#NSCCC_BASE_URI)
* [NSCCC_APPLICATION_NAME](#NSCCC_APPLICATION_NAME)
* [NSCCC_PROFILE](#NSCCC_PROFILE)
* [NSCCC_LABEL](#NSCCC_LABEL)
* [NSCCC_FAIL_FAST](#NSCCC_FAIL_FAST)
* [NSCCC_MAX_RETRY_ATTEMPTS](#NSCCC_MAX_RETRY_ATTEMPTS_MS)
* [NSCCC_SCALING_DURATION](#NSCCC_SCALING_DURATION)
* [NSCCC_LOGGER_ENABLED](#NSCCC_LOGGER_ENABLED)
* [NSCCC_LOGGER_LEVEL](#NSCCC_LOGGER_LEVEL)

### NSCCC_BASE_URI
This property specify the entrypoint of target config server that node js need to call to get properties. ( [Example target config server](#Example%20target%20config%20server) )
* Default: http://localhost:8888
* Type: string


### NSCCC_APPLICATION_NAME
This property specify the name of node js server that use this library. *NSCCC_APPLICATION_NAME* will be use during get properties from the target config server. ( [Example target config server](#Example%20target%20config%20server) )
* Default: application
* Type: string


### NSCCC_PROFILE
This property specify the profile that you decide to use for your node js server. In this way you can start in "develop" or "production" mode. ( [Example target config server](#Example%20target%20config%20server) )
* Default: default
* Type: string



### NSCCC_LABEL
This property specify the label for your properties file on config server. ( [Example target config server](#Example%20target%20config%20server) )
* Default: no default provided
* Type: string


### NSCCC_FAIL_FAST
This property speficy if you want the node js server immediatelly breackdown (or not) if get properties from config server fails.

In particular, if *NSCCC_FAIL_FAST* set to "false", the node js server continue to is up and running despite the get properties from config server fails. Otherwhise if *NSCCC_FAIL_FAST* set to "true" it will be applied the retry strategy provided in *NSCCC_MAX_RETRY_ATTEMPTS* and *NSCCC_SCALING_DURATION_MS*. If the fails continue, your server breack down. ( [Config client retry](#Config%20client%20retry) )
* Default: false
* Type: true
* NB: Only accept true/false. Otherwise automatically set to default.


### NSCCC_MAX_RETRY_ATTEMPTS
This property specify how much times the node js server retry to get properties from config server after the first fail. ( [Config client retry](#Config%20client%20retry) )
* Default: 6
* Type: number
* NB: This property is active only if *NSCCC_FAIL_FAST* set to true.


### NSCCC_SCALING_DURATION_MS
This property specify how much delay beatween two retry.

The duration is calculated by NSCCC_SCALING_DURATION_MS multiplied by attempts number. ( [Config client retry](#Config%20client%20retry) )
* Default: 1000
* Type: number
* NB: This property is active only if *NSCCC_FAIL_FAST* set to true.


### NSCCC_LOGGER_ENABLED
You can turn on/off the log with property NSCCC_LOGGER_ENABLED. 
* Default: false
* Type: true
* NB: Only accept true/false. Otherwise automatically set to default.

### NSCCC_LOGGER_LEVEL
You can specify level log with property NSCCC_LOGGER_LEVEL.
* Default: error
* Type: string
* NB: 
    * Only accept error/info/debug. Otherwise automatically set to default;
    * This property is active only if *NSCCC_LOGGER_ENABLED* set to true.




## Example target config server

Based on properties **NSCCC_BASE_URI**, **NSCCC_APPLICATION_NAME**, **NSCCC_PROFILE** and **NSCCC_LABEL** will be create the rest call to get properties from config server based on the pattern `<NSCCC_BASE_URI>/<NSCCC_APPLICATION_NAME>/<NSCCC_PROFILE>/<NSCCC_LABEL>`

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
  
Is also possible to ask for multiple profile, just set NSCCC_PROFILE=profile1,profile2

## Config client retry
  

You can specify what happen when get to config server fails.

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



## More Documentation
For more documentation and information, visit this [page](https://github.com/Effeppi/node-spring-cloud-config-client/wiki).

## Example usage
You can visit this [repository](https://github.com/Effeppi/node-spring-cloud-config-client-example) for other example of node-spring-cloud-config-client usage.