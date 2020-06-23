# PesDa Cloud Config Client

PesDa Cloud Config Client provide client-side support to get the nodejs server configurations in a distributed system from a service builds with use of Spring Cloud Config Server.


[![GitHub](https://img.shields.io/badge/GitHub-0.1.0-blue)](https://github.com/Effeppi/pesda-cloud-config-client/tree/0.1.0)
![Build](https://github.com/Effeppi/pesda-cloud-config-client/workflows/Build/badge.svg?branch=release/0.1.0)
[![LICENSE](https://img.shields.io/github/license/Effeppi/pesda-cloud-config-client?label=License)](LICENSE)
[![Issue](https://img.shields.io/github/issues/Effeppi/pesda-cloud-config-client?label=Issues)](https://github.com/Effeppi/pesda-cloud-config-client/issues)
[![npm version](https://img.shields.io/badge/npm-0.1.0-red)](https://www.npmjs.com/package/pesda-cloud-config-client/v/0.1.0)

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
// When in your server want to retry configuration from spring cloud config server
const propertySourcesContext = PropertySourcesContext.getInstance()
propertySourcesContext.loadProperties$()
.subscribe(result => ...);

// You can also await execution of load method
const propertySourcesContext = PropertySourcesContext.getInstance()
const result = await propertySourcesContext.loadProperties$()
.toPromise()

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
This property specify the entrypoint of target config server that node js need to call to get properties. ( [Example target config server](#Example%20target%20config%20server) )
* Default: http://localhost:8888
* Type: string


### PCCC_APPLICATION_NAME
This property specify the name of node js server that use this library. *PCCC_APPLICATION_NAME* will be use during get properties from the target config server. ( [Example target config server](#Example%20target%20config%20server) )
* Default: application
* Type: string


### PCCC_PROFILE
This property specify the profile that you decide to use for your node js server. In this way you can start in "develop" or "production" mode. ( [Example target config server](#Example%20target%20config%20server) )
* Default: default
* Type: string



### PCCC_LABEL
This property specify the label for your properties file on config server. ( [Example target config server](#Example%20target%20config%20server) )
* Default: no default provided
* Type: string


### PCCC_FAIL_FAST
This property speficy if you want the node js server immediatelly breackdown (or not) if get properties from config server fails.

In particular, if *PCCC_FAIL_FAST* set to "false", the node js server continue to is up and running despite the get properties from config server fails. Otherwhise if *PCCC_FAIL_FAST* set to "true" it will be applied the retry strategy provided in *PCCC_MAX_RETRY_ATTEMPTS* and *PCCC_SCALING_DURATION_MS*. If the fails continue, your server breack down. ( [Config client retry](#Config%20client%20retry) )
* Default: false
* Type: true
* NB: Only accept true/false. Otherwise automatically set to default.


### PCCC_MAX_RETRY_ATTEMPTS
This property specify how much times the node js server retry to get properties from config server after the first fail. ( [Config client retry](#Config%20client%20retry) )
* Default: 6
* Type: number
* NB: This property is active only if *PCCC_FAIL_FAST* set to true.


### PCCC_SCALING_DURATION_MS
This property specify how much delay beatween two retry.

The delay is expressed in milliseconds.

The duration is calculated by PCCC_SCALING_DURATION_MS multiplied by attempts number. ( [Config client retry](#Config%20client%20retry) )
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
BSD 2-Clause License

Copyright (c) 2020, Effeppi
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
