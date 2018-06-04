const firebase = require('firebase-admin');
const functions = require('firebase-functions');
const request = require('request');

// const firebaseApp = firebase.initializeApp(
//     functions.config().firebase
// );
const firebaseApp = firebase.initializeApp({
    credential: firebase.credential.cert({
        "type": "service_account",
        "project_id": "recordandrun-abea2",
        "private_key_id": "f9b2178abd518d837f3d57ede80ffbf0b883e6b7",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDOpx7PZnHjSiAZ\nYwP6xxUazKJsrgV8AWdJjiLYflXHuixaP124Z2Ixv7oDKdFVMVvZfTLe+6GibWzd\nWvTqHRaFCoJMNZXNd9bqlibreFQ8fKnMMr9Cm9IeRLAhaYDGnZuNgMboRyQ7qD6e\nqXtTyJSsk5+dMlwOjz8f0t7xq/AdIRw2U60r/4rDMGEwoRfmUAnS2IrF10I2Hiz5\nlGIlh0BwZU5S9k76+/Z9KTcT1L7VVGJpNueoA/9FzXctdPEKH1Wtka6apJwQDPqJ\nrHyKlmHGj7w5uKhLdb7/qZn3O2r4n2ApYdrcr/LOxldA9+ICd8xVhK5y/TtBw1Cd\nxLisi/MZAgMBAAECggEADQ4dQex+puWErB3nfzULBgel/jgrNAeRqyGt3V/z0tuV\n2Di3FsJ/P1XVrkP6y8dDvnRsnY4niq+fiEdqAA1I4ixFCYP8HAAlZWoJeOg/6BdX\nEcWl9BMMfemId//miQWlcVXQmxV9ekBZfmQGHMen7tQfqgpnqurNSdkkSP+7+lcD\nLZwiUroQ32hsN2sd3EDDdqNNYGUVu6IlfTMjnmXG3gJzoDJJyAujwtEUQqqcv6t+\nKkDyvQ9xHfxKlgg8k/0X8i2dHfMDs60zsRc/a9BUjfZtjgoimqmoeEE4gahPMqoA\nWPxKnOZN0pnMHqtHd2P+KI5GUoZKGU/GR8mxSrYEhQKBgQD/Lp0KMKWObOh7uYex\nD2hXYtqc15t9zo9LPwaiexU37vneTHw2pD9sbHpJt67vM9zIF+F3WwJOrpZTO70H\nWVqQP02E27kuvB0A//S0OIKwMzLSh6on+fVoFKWaKs3fDF7E5YB/tEfQdjM0nDEA\ncziZm2FU2MXuSUxf5djaYbQ3VQKBgQDPUK/S5RFjhVULHYPUCvm1KgcsIwpXDnsq\nTFCTv1H47+TOM6aJx6l91zB9zMBtYK7oAoWXQSOf5ok7wqzagyQ2hSfnLgIYOEIQ\nnTbUwrA6w0S0Xg/CiZkAlyjdqMsLp2vHrUOtqS1VaOAiKqJMkJggASQNm5mu5/6E\nSsoeWzWEtQKBgC6EpdYUtil3iw367VSGtYOwnp+W4l6VyCN0ctYtz9lpdB1lHgOr\n/2/ZepVzqa0rbCUBzXU/nvUO+JJlwnjTfiHrmEsO7vwpCLSE9GviHVjXjH06g/dT\nprv5f5LSGMN/css79yfQioLi+USu8HPfjULbQ2v/NF3S+NxGfziYNQ0dAoGAYyhi\nkGqD4Kf7Py/Ex/zf5qjNeWzhGzaP7nFF8QUHPhvvwjiuJSRcixYL2X+/YhFmVw4t\nu2Sql2Z6qRy59GHZRkJ2DXrSAaeW4b9wZF8iT1jqWaLLwu5xQfkK0MpVI6PWR1E2\nF6/dQQbCfVUK/7gBKv2gsumDnkbUU446Ej7p4CkCgYEA3bN0RDZtZj4gldqEiZQm\nMqKU9i+GdrB1vD2ZS/afwXH1KgwETlgzFyooV+4rI9i4K3Dp116ZleuJQxXvtmhf\nmeFo60TkzH0WH/jBjl4HvUGWRpEg6YCE2huuB4K5xss4VLoyOToIfUqShjyyBm1a\nLG6OTD4EylswkDj+hNzejGA=\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-190hv@recordandrun-abea2.iam.gserviceaccount.com",
        "client_id": "100752614705431220755",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://accounts.google.com/o/oauth2/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-190hv%40recordandrun-abea2.iam.gserviceaccount.com"
    }),
    databaseURL: "https://recordandrun-abea2.firebaseio.com",
    storageBucket: "recordandrun-abea2.appspot.com"
});

const bucket = firebaseApp.storage().bucket();
var userRef = null, botRef = null, testCaseRef = null;

setUserRef = (uid) => {
    userRef = firebaseApp.database().ref(uid);
};
setBotRef = (botId) => {
    botRef = userRef.child('bots').child(botId);
};
setTestCaseRef = (testCaseId) => {
    testCaseRef = botRef.child('testCase').child(testCaseId);
};

saveTestCase = (sTestName, oTestCase) => {
    return new Promise((resolve, reject) => {
        bucket.file('convo/' + sTestName + '.json').save(oTestCase, (error) => {
            if (!error)
                resolve();
            else
                reject(error);
        });
    });
};

getTestCaseUrl = (sTestName) => {
    return new Promise((resolve, reject) => {
        bucket.file('convo/' + sTestName + '.json').getSignedUrl({
            action: 'read',
            expires: '01-01-2050'
        }).then(signedUrls => {
            resolve(signedUrls[0]);
        }).catch((error) => {
            reject(error);
        });
    });
};

saveBot = (botDetails) => {
    var botId = 'B_' + new Date().getTime();
    setBotRef(botId);
    return new Promise((resolve, reject) => {
        botRef.child('botDetails').set(botDetails).then(() => {
            resolve(botId);
        }, (err) => {
            reject(err);
        });
    });
}

saveTestCaseDetails = (testCaseDetails, testCaseId) => {
    setTestCaseRef(testCaseId);
    return new Promise((resolve, reject) => {
        testCaseRef.set(testCaseDetails).then(() => {
            resolve();
        }, () => {
            reject();
        });
    });
}

getAllBots = () => {
    return new Promise((resolve, reject) => {
        userRef.child('bots').once('value').then(snapshot => {
            var payload = snapshot.val();
            resolve(payload);
        }, () => {
            reject();
        });
    });
}

deleteBot = (botId) => {
    return new Promise((resolve, reject) => {
        setBotRef(botId);
        botRef.remove().then(() => {
            resolve();
        }, () => {
            reject();
        });;
    });
}

deleteTestCaseDetails = (testCaseId) => {
    return new Promise((resolve, reject) => {
        setTestCaseRef(testCaseId);
        testCaseRef.remove().then(() => {
            resolve();
        }, () => {
            reject();
        });
    });
}

deleteTestCase = (sTestName) => {
    return new Promise((resolve, reject) => {
        bucket.file('convo/' + sTestName + '.json').delete().then( () => {
            resolve();
        }).catch( err => {
            reject(err);
        });
    });
}

getTestCaseFromUrl = url => {
    return new Promise((resolve, reject) => {
        request(url, { json: true }, (err, res, body) => {
            if (err)
                reject(err);
            else
                resolve(body);
        })
    });
}

module.exports = {
    saveTestCase, getTestCaseUrl, saveBot, saveTestCaseDetails, setBotRef,
    setUserRef, setTestCaseRef, getAllBots, deleteBot, deleteTestCaseDetails, 
    deleteTestCase, getTestCaseFromUrl
};