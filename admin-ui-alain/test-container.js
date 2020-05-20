const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const fs = require('fs');
const request = require('request');
const url = require('url');

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/newit', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

micropaasForward(app);
server.timeout = 1000 * 5;
server.listen(3000, () => {
  console.log('server start listening on 3000!');
});

/**
 * This method is to simulate proxy.conf.json in angular
 * @param app express app
 */
function micropaasForward(app) {
  const proxyF = fs.readFileSync(__dirname + '/proxy.config.json', {encoding: 'utf-8'});
  const proxyObj = JSON.parse(proxyF.trim().replace(/\r?\n|\r/g, ''));

  Object.keys(proxyObj).forEach(path => {
    const proxy = proxyObj[path];
    const target = proxy.target;

    console.log('redirect:' + path);
    app.use(path, function (req, res, next) {
      const req2 = {...req};
      const _url = url.parse(`${target}${req2.originalUrl}`);

      const body = req2.body;
      // body.step = 90;

      const options = {
        uri: _url,
        method: req2.method,
        body: body,
        json: true,
        timeout: 60 * 1000,
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJSdEtVbzJrNmhQQ2c1THg1a1d0cnluRXduMUZlY2xhUHMxSTF3RFFtdVJJIn0.eyJqdGkiOiI0YWQzYmRkZC00YzAxLTRiMDgtOGZiYS1jYmZiM2YzYzRlZTMiLCJleHAiOjE1NzIwNzE5MDgsIm5iZiI6MCwiaWF0IjoxNTcxOTg1NTA5LCJpc3MiOiJodHRwOi8vc3NvLm1pY3JvcGFhcy5uZXdpdC9hdXRoL3JlYWxtcy9uZXdpdCIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI5YjVkODIyNC0wNDViLTQ4ZWEtOTUyMy1lYThhZjZjM2UzN2YiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJtaWNyb3BhYXMiLCJhdXRoX3RpbWUiOjE1NzE5ODU1MDgsInNlc3Npb25fc3RhdGUiOiJkMjAzMjQzNC1hNTFkLTRmNTEtODA0NS01MGY4NmQ4NWY2YzEiLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBhZGRyZXNzIGVtYWlsIHBob25lIHByb2ZpbGUiLCJhZGRyZXNzIjp7fSwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoi5rGk5aeGIOWFi-mygeaWryIsInBob25lX251bWJlciI6IjE1OTQwODMzMzIxIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYWRtaW4iLCJnaXZlbl9uYW1lIjoi5rGk5aeGIiwiZmFtaWx5X25hbWUiOiLlhYvpsoHmlq8iLCJlbWFpbCI6InhpYTkyOTI4QDE2My5jb20ifQ.VAd8ki5UG6YTDd79YmoYckishq71k1T0IREhz6TMYUf7_VZ7Dd9bCtdWIAGD57O4nye1axZxZ3tS8M5dR3MzuW9QV8cOGtkRGoPcrdlG0Onome-3cV9xjTN1CrkWF8P0-YbLF0bEH6Xj1VJZ-LkIpm6fG6tRDVqdzK7w8TJBIiteanqupIjpW4MwHkHmzcBSf-uC1HYsUz3rVVuNVk5Ymak322pX1Rv9MiPZql_xDgKLC3cUQZIEJKo4m3rsocUKB_ar8cHXLvvnhHkqs3PnSHJ995YmClHsz_58s-pArChy1uXh1152XnUymrv2vvdjuhVzfB5H1ItKQ2cpJl62qQ'
        }
      };

      const time1 = new Date();
      request(options, function (error, response, body) {
        const time2 = new Date();
        console.log('TIME:' + (time2 - time1));

        if (response && response.statusCode) {
          res.status(response.statusCode);
        }
        res.send(body);
      });
    })
  });
}
