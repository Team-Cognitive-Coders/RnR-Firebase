const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require("body-parser");
const firebase_util = require("./firebase-utils"); 
const fs = require('fs');
const request = require('request');

const cors = require('cors')({
    origin: true
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/saveTestCase', (req, response) => {
    var payload = req.body;
    var fileName = payload.testCaseName;
    var chats = payload.chats;
    firebase_util.saveTestCase(fileName, chats).then( () => {
        res.status(200).send();
    }).catch((error) => {
        res.status(500).send(error);
    });
});

app.get('/getTestCase', (req, res) => {
    var fileName = req.query.testCaseName;
    firebase_util.getTestCaseUrl(fileName).then( (testUrl) => {
        console.log(testUrl);
        request(testUrl, { json: true }, (err1, res1, body) => {
            if(err1)
                res.status(500).send(err1);
            else
                res.status(200).send(body);
        })
    }).catch((error) => {
        res.status(500).send(error);
    });
})

exports.app = functions.https.onRequest(app);