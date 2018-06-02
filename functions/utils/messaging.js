const apiai = require('apiai');
const pl = require('./payload-util');

sendMessage = (payload) => {
    return new Promise((resolve, reject) => {
        if (payload.type = "DF") {
            sendMessageDialogFlow(payload, resolve, reject);
        }
    });
};

sendMessageDialogFlow = (payload, resolve, reject) => {
    var token = payload.token;
    var query = payload.query;
    var sessionId = payload.sessionId
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

module.exports = {sendMessage};

