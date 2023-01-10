

## what are logs?
Applications should log actions to provide information to the outside world.
## Logs level:
* info
* error
* debug: meant to be very verbose , and thus very often disabled on production. <br>
Names don't matter as long as consistency is kept (using the same name). <br>
The most known logger for nodejs is [winston](https://www.npmjs.com/package/winston). <br>
Loggers can be configured using `level` parameters to specify which log levels we should log and which ones we should ignore: 
Log only if the level is less than or equal to the level specified in this field.<br>
Log levels in winston nodejs:
```js
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};
```
## Challenges
* Logging senstitive information (passwords) can lead to security issues.
* Logs that are not persisted somewhere are useless. 
* Logs should be searchable at scale (provide a way to search in large logs).
* Logging tons of data can impact performance. 

## Structured logs
Logging using "echo/print" is useless.<br>
At scale, logs should be searchable, thus agreeing on a common log <b>structure</b> is a must. <br>
#### Example of structured logs:
* Key/value: e.g. `error="user password change request failed: database error" username="alice" user_id="v543"`
* Json logs.

## Log management platforms
Modern log management platforms such as `logstash`, `Datadog`, `Loki`,... makes it possible to query logs as if they are a database.

## Log context
Log a context of the error such as User ip, request id, user id, date and time to help investigating the error. <br>
Giving a unique id for each request can help us track the workflow that led to the error.


# Datadog in K8s
Data dog is a log aggregation system.
<img src="https://user-images.githubusercontent.com/53778545/209701384-34ce5ca8-bb19-4e8e-a310-a7a2b8008377.png" style="width:500px">
<img src="https://user-images.githubusercontent.com/53778545/209701489-bfcb798d-cd86-43ca-a33c-09c1854fab7f.png" style="width:700px">

## Installing data dog
The helm charts of datadog: [https://github.com/DataDog/helm-charts](https://github.com/DataDog/helm-charts)
```
helm repo add datadog https://helm.datadoghq.com
helm repo update
helm install datadog --set datadog.apiKey=<MY_API_KEY>  -f datadog-values.yaml datadog/datadog
```
You can generate a datadog public api key [here](https://app.datadoghq.eu/personal-settings/application-keys).

#### Note:
The logs format should be in json so that datadog can parse it.


## Request id in logging:
It's highly recommended to to add to request id in every log message so we can trace the set of actions that led to a certain error.
* If our app receives requests from user directly (user facing service)=> it's our responsiblity to create an ID for the request.
* The request is handled by other services before getting to our service => We get the request id from the service who sent the request to our service. (In general it's injected in the headers)