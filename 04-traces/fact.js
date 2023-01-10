//---------------------------------------------
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;
const register = new Registry();
collectDefaultMetrics({ register });

const numberOfRequestsCounter = new client.Counter({
  name: 'number_of_requests',
  help: 'counts the number of requests that the fact endpoint recieved',
  labelNames: ['status'],
});
register.registerMetric(numberOfRequestsCounter)
//-------------------------------------------------

const express = require("express");
const { request } = require('express');
const app = express();
const port = 3500;
//------------------------------------------------

const winston = require('winston');

const rootLogger = winston.createLogger({
  level: 'info',    // Log only if info.level is less than or equal to this level
  transports: [
    new winston.transports.Console(),
  ]
})
//---------------------------------------

function factoriel(n) {
  if (n == 1) return n;
  return n * factoriel(n - 1);
}
const crypto = require('crypto');

function getRequestId() {
  let uuid = crypto.randomUUID();
  return uuid;
}
app.get("/fact", (req, res) => {

  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

  let n;
  n = Number(req.query.n);
  let reqID = getRequestId();
  requestLogger = rootLogger.child({
    userIp: ip,
    n: n,
    request_id: reqID
  })


  ans = {
    response: 0
  };
  if (isNaN(n)) {
    numberOfRequestsCounter.inc({ 'status': 400 });
    ans.response = "Error 400 can't find the number N!"
    res.status(400).send(ans);
  }

  else if (n < 0) {
    numberOfRequestsCounter.inc({ 'status': 400 });
    ans.response = "N should be a positive number"
    requestLogger.log({
      level: 'warn',
      message: `N should be a positive number`
    })
    res.status(400).send(ans);
  }
  else {
    // console.log(n);
    if (n <= 1)
      ans.response = 1;
    else
      ans.response = factoriel(n);
    //console.log(ans.response)
    requestLogger.log({
      level: 'info',
      message: `Calculating fact`,
    })
    numberOfRequestsCounter.inc({ 'status': 200 });
    res.send(ans);
  }


});
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  let metrics = await register.metrics();
  res.send(metrics);
})
app.get("/", (req, res) => {
  res.send("Hello everyone!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
