const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require("body-parser");

const firebase_util = require("./utils/firebase-utils");
const pl = require('./utils/payload-util');
const ms = require('./utils/messaging');

const cors = require('cors')({
    origin: true
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/saveTestCase', (req, res) => {
    var testCaseId = 'T_' + new Date().getTime();
    var payload = req.body;
    var chats = payload.chats;
    var testCaseDetails = pl.getTestCaseDetailsPayload();
    testCaseDetails.name = payload.testCaseName;
    firebase_util.setUserRef(payload.uid);
    firebase_util.setBotRef(payload.botId);
    chats = JSON.stringify(chats);
    firebase_util.saveTestCase(testCaseId, chats).then(() => {
        testCaseDetails.testCaseId = testCaseId;
        firebase_util.getTestCaseUrl(testCaseId).then((testCaseUrl) => {
            testCaseDetails.url = testCaseUrl;
            firebase_util.saveTestCaseDetails(testCaseDetails, testCaseId).then(() => {
                res.status(200).send(testCaseDetails);
            }).catch((error) => {
                res.status(500).send(error);
            });
        }).catch((error) => {
            res.status(500).send(error);
        });
    }).catch((error) => {
        res.status(500).send(error);
    });
});

app.post('/saveBot', (req, res) => {
    var payload = req.body;
    var botDetails = pl.getBotDetailsPayload();
    botDetails.name = payload.name;
    botDetails.type = payload.type;
    botDetails.token = payload.token;
    firebase_util.setUserRef(payload.uid);
    firebase_util.saveBot(botDetails).then( botId => {
        botDetails.botId = botId;
        res.status(200).send(botDetails);
    }).catch((error) => {
        res.status(500).send(error);
    });
});

app.get('/getTestCase', (req, res) => {
    var testCaseId = req.query.testCaseId;
    firebase_util.getTestCaseUrl(testCaseId).then((testUrl) => {
        firebase_util.getTestCaseFromUrl(testUrl).then( body => {
            res.status(200).send(body);
        }, err => {
            res.status(500).send(err);
        });
    }).catch((error) => {
        res.status(500).send(error);
    });
});

app.get('/getBots', (req, res) => {
    var uid = req.query.uid;
    firebase_util.setUserRef(uid);
    firebase_util.getAllBots().then((payload) => {
        res.status(200).send(payload);
    }).catch((error) => {
        res.status(500).send(error);
    });
});

app.get('/sendMessage', (req, res) => {
    var payload = req.body;
    var messaging = pl.getMessagePayload();
    messaging.token = payload.token;
    messaging.query = payload.query;
    messaging.sessionId = payload.sessionId;
    messaging.type = payload.type;
    ms.sendMessage(messaging).then((reply) => {
        res.status(200).send(reply);
    }, (error) => {
        res.status(500).send(error);
    })
});

app.delete('/deleteTestCase', (req, res) => {
    var payload = req.query;
    var uid = payload.uid;
    var botId = payload.botId;
    var testCaseId = payload.testCaseId;
    firebase_util.setUserRef(uid);
    firebase_util.setBotRef(botId);
    firebase_util.deleteTestCase(testCaseId).then(() => {
        firebase_util.deleteTestCaseDetails(testCaseId).then(() => {
            res.status(200).send(payload);
        }, () => {
            res.status(500).send(error);
        });
    }, () => {
        res.status(500).send(error);
    });
});

app.delete('/deleteBot', (req, res) => {
    var payload = req.query;
    var uid = payload.uid;
    var botId = payload.botId;
    firebase_util.setUserRef(uid);
    firebase_util.deleteBot(botId).then(() => {
        res.status(200).send(payload);
    }, () => {
        res.status(500).send(error);
    });
});

app.get('/runAllTest', (req, res) => {
    var uid = req.query.uid;
    var botId = req.query.botId;
    firebase_util.setUserRef(uid);
    res.status(200).send();
});

app.get('/runTest', (req, res) => {
    var testCaseId = req.query.testCaseId;
    firebase_util.getTestCaseUrl(testCaseId).then((testUrl) => {
        firebase_util.getTestCaseFromUrl(testUrl).then( body => {
            messaging.runTestCase(body).then( reply => {
                res.status(200).send(reply);
            }, err => {
                res.status(500).send(err);
            });
        }, err => {
            res.status(500).send(err);
        });
    }).catch((error) => {
        res.status(500).send(error);
    });
});

exports.app = functions.https.onRequest(app);