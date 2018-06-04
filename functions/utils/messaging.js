const apiai = require('apiai');

const pl = require('./payload-util');

runTestCase = (body) => {
    
};

sendMessage = (payload) => {
    return new Promise((resolve, reject) => {
        if (payload.type = "DF") {
            sendMessageDialogFlow(payload, resolve, reject);
        }
    });
};

sendMessageApiAi = (payload, resolve, reject) => {
    var token = payload.token;
    var query = payload.query;
    var sessionId = payload.sessionId;
    var app = apiai(token);

    var request = app.textRequest(query, {
        sessionId: 'sessionId'
    });
    request.on('response', function (response) {
        console.log(response);
        var responsePayload = pl.getResponseMessagePayload();
        responsePayload.message = response.result.fulfillment.speech;
        responsePayload.intent = response.result.action;
        responsePayload.query = query;
        resolve(responsePayload)
    });
    request.on('error', function (error) {
        console.log(error);
        reject(error);
    });
    request.end();
};

sendMessageDialogFlow = (payload, resolve, reject) => {
    const projectId = payload.token
    const sessionId = payload.sessionId
    const query = payload.query;
    const languageCode = 'en-US';

    // Instantiate a DialogFlow client.
    const dialogflow = require('dialogflow');
    const sessionClient = new dialogflow.SessionsClient();

    // Define session path
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: query,
                languageCode: languageCode,
            },
        },
    };
    // Send request and log result
    sessionClient
        .detectIntent(request)
        .then(responses => {
            console.log('Detected intent');
            const result = responses[0].queryResult;
            console.log(`  Query: ${result.queryText}`);
            console.log(`  Response: ${result.fulfillmentText}`);
            if (result.intent) {
                console.log(`  Intent: ${result.intent.displayName}`);
            } else {
                console.log(`  No intent matched.`);
            }
            resolve(responses);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
};

module.exports = { sendMessage, runTestCase };

