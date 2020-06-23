# PesDa Cloud Config Client

PesDa Cloud Config Client provide client-side support that connects to a Spring Cloud Config Server to fetch the node js application's configuration.


[![GitHub](https://img.shields.io/badge/GitHub-0.1.0-blue)](https://github.com/Effeppi/pesda-cloud-config-client/tree/0.1.0)
![CI-CD](https://github.com/Effeppi/pesda-cloud-config-client/workflows/CI-CD/badge.svg?branch=0.1.0)
[![LICENSE](https://img.shields.io/github/license/Effeppi/pesda-cloud-config-client?label=License)](LICENSE)
[![Issue](https://img.shields.io/github/issues/effeppi/pesda-cloud-config-client?label=Issues)](https://github.com/Effeppi/pesda-cloud-config-client/issues)
[![npm version](https://img.shields.io/badge/npm-0.1.0-red)](https://www.npmjs.com/package/pesda-cloud-config-client/v/0.1.0)
[![npm latest version](https://img.shields.io/badge/npm-latest-orange)](https://www.npmjs.com/package/pesda-cloud-config-client/)

---
## Install

```bash
# Using npm
npm install pesda-cloud-config-client

# Using yarn
yarn add pesda-cloud-config-client
```

## Usage


In your application, use init method to start the load of variables in your process.env

```javascript
//typescript
import {PropertySourcesContext} from 'pesda-cloud-config-client'

//javascript
const {PropertySourcesContext} = require('pesda-cloud-config-client')

...
...
// When in your nodejs application want to retry configuration from spring cloud config server
const propertySourcesContext = PropertySourcesContext.getInstance()
propertySourcesContext.loadProperties$()
.subscribe(() => ...);

// You can also await execution of load method
const propertySourcesContext = PropertySourcesContext.getInstance()
const result = await propertySourcesContext.loadProperties$().toPromise()

...

```


After `loadProperties$` method, you can access environment variables from env with process.env:

```javascript
const database_password = process.env['db.password']
```


## Options
* [PCCC_BASE_URI](#PCCC_BASE_URI)
* [PCCC_APPLICATION_NAME](#PCCC_APPLICATION_NAME)
* [PCCC_PROFILE](#PCCC_PROFILE)
* [PCCC_LABEL](#PCCC_LABEL)
* [PCCC_FAIL_FAST](#PCCC_FAIL_FAST)
* [PCCC_MAX_RETRY_ATTEMPTS](#PCCC_MAX_RETRY_ATTEMPTS_MS)
* [PCCC_SCALING_DURATION](#PCCC_SCALING_DURATION)
* [PCCC_LOGGER_ENABLED](#PCCC_LOGGER_ENABLED)
* [PCCC_LOGGER_LEVEL](#PCCC_LOGGER_LEVEL)

### PCCC_BASE_URI
This property specify the entrypoint of target config server that node js need to call to get properties. ( [Example target config server](#example-target-config-server) )
* Default: http://localhost:8888
* Type: string


### PCCC_APPLICATION_NAME
This property specify the name of node js server that use this library. *PCCC_APPLICATION_NAME* will be use during get properties from the target config server. ( [Example target config server](#example-target-config-server) )
* Default: application
* Type: string


### PCCC_PROFILE
This property specify the profile that you decide to use for your node js server. In this way you can start in "develop" or "production" mode. ( [Example target config server](#example-target-config-server) )
* Default: default
* Type: string



### PCCC_LABEL
This property specify the label for your properties file on config server. ( [Example target config server](#example-target-config-server) )
* Default: no default provided
* Type: string


### PCCC_FAIL_FAST
This property speficy if you want the node js server immediatelly breackdown (or not) if get properties from config server fails.

In particular, if *PCCC_FAIL_FAST* set to "false", the node js server continue to is up and running despite the get properties from config server fails. Otherwhise if *PCCC_FAIL_FAST* set to "true" it will be applied the retry strategy provided in *PCCC_MAX_RETRY_ATTEMPTS* and *PCCC_SCALING_DURATION_MS*. If the fails continue, your server breack down. ( [Config client retry](#config-client-retry) )
* Default: false
* Type: true
* NB: Only accept true/false. Otherwise automatically set to default.


### PCCC_MAX_RETRY_ATTEMPTS
This property specify how much times the node js server retry to get properties from config server after the first fail. ( [Config client retry](#config-client-retry) )
* Default: 6
* Type: number
* NB: This property is active only if *PCCC_FAIL_FAST* set to true.


### PCCC_SCALING_DURATION_MS
This property specify how much delay beatween two retry.

The delay is expressed in milliseconds.

The duration is calculated by PCCC_SCALING_DURATION_MS multiplied by attempts number. ( [Config client retry](#config-client-retry) )
* Default: 1000
* Type: number
* NB: This property is active only if *PCCC_FAIL_FAST* set to true.


### PCCC_LOGGER_ENABLED
You can turn on/off the log with property PCCC_LOGGER_ENABLED. 
* Default: false
* Type: true
* NB: Only accept true/false. Otherwise automatically set to default.

### PCCC_LOGGER_LEVEL
You can specify level log with property PCCC_LOGGER_LEVEL.
* Default: error
* Type: string
* NB: 
    * Only accept error/info/debug. Otherwise automatically set to default;
    * This property is active only if *PCCC_LOGGER_ENABLED* set to true.




## Example target config server

Based on properties **PCCC_BASE_URI**, **PCCC_APPLICATION_NAME**, **PCCC_PROFILE** and **PCCC_LABEL** will be create the rest call to get properties from config server based on the pattern `<PCCC_BASE_URI>/<PCCC_APPLICATION_NAME>/<PCCC_PROFILE>/<PCCC_LABEL>`

Example:

| PCCC_BASE_URI      | PCCC_APPLICATION_NAME | PCCC_PROFILE | PCCC_LABEL | Rest call                                           | 
| ---------           | ---------              | ---------     | ---------   | ---------                                           | 
|                     |                        |               |             | http://localhost:8888/application/default           | 
| http://your.server/ |                        |               |             | http://your.server/application/default              | 
|                     | your-application-name  |               |             | http://localhost:8888/your-application-name/default | 
|                     |                        | dev           |             | http://localhost:8888/application/dev               | 
|                     |                        |               | label       | http://localhost:8888/application/default/label     | 
| http://your.server/ | your-application-name  | prod          |             | http://your.server/your-application-name/prod       | 
| http://your.server/ | your-application-name  | prod          | label       | http://your.server/your-application-name/prod/label | 
  
Is also possible to ask for multiple profile, just set PCCC_PROFILE=profile1,profile2

## Config client retry
  

You can specify what happen when get to config server fails.

If you want that when the call fails there are no error, set PCCC_FAIL_FAST=false.

Otherwise, specify PCCC_FAIL_FAST=true.

When PCCC_FAIL_FAST not set 'true' or 'false', is like set PCCC_FAIL_FAST to 'false'.

If *PCCC_FAIL_FAST* set to true, is applied a retry that follow the properties *PCCC_MAX_RETRY_ATTEMPTS* and *PCCC_SCALING_DURATION*

With PCCC_MAX_RETRY_ATTEMPTS specify how much times the retry will be performed.

With PCCC_SCALING_DURATION specify what is scaling duration beetwen two retry.

Example:

``` bash
export PCCC_MAX_RETRY_ATTEMPTS=4
export PCCC_SCALING_DURATION=500
```

Suppose that your config server is down and does not respond.

After the first call to config server, pesda-cloud-config-client perform another call after 500 ms, after 1000 ms, after 1500 ms and after 2000 ms. After that pesda-cloud-config-client emit error.



# More Documentation
For more documentation and information, visit this [page](https://github.com/Effeppi/pesda-cloud-config-client/wiki).

# Example usage
You can visit this [repository](https://github.com/Effeppi/pesda-cloud-config-client-example) for other example of pesda-cloud-config-client usage.

# License
MIT License

Copyright (c) 2020 Effeppi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
