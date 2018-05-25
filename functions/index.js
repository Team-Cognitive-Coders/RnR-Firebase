const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require("body-parser");
const firebase_util = require("./firebase-utils"); 
const fs = require('fs');

const cors = require('cors')({
    origin: true
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/saveTestCase', (request, response) => {
    var payload = request.body;
    var fileName = payload.testCaseName;
    var chats = payload.chats;
    firebase_util.saveTestCase(fileName, chats).then(function(){
        console.log("Success");
        response.status(200).send();
    }).catch((error) => {
        response.status(500).send(error);
    });
});

app.get('/getTestCase', (request, response) => {
    var fileName = request.query.testCaseName;
    firebase_util.getTestCaseUrl(fileName).then(function(testUrl){
        fs.readFile(testUrl, (error, data) => {
            if(error)
                response.status(500).send(error);
            else
                response.status(200).send(data);
        })
    }).catch((error) => {
        response.status(500).send(error);
    });
})

exports.app = functions.https.onRequest(app);