(function(){
    getAllBotsFormattedPayload = function () {
        return payload = {
            name: "",
            token: "",
            type: "",
            botId: "",
            testCases: [],
            active: false
        }
    };

    getSaveBotPayload = function () {
        return payload = {
            name: "",
            token: "",
            type: "",
            uid: "U1234",
        }
    };

    getSaveTestCasePayload = function () {
        return payload = {
            chats: {},
            testCaseName: "",
            botId: "",
            uid: "U1234",
        }
    };

    getTestCaseFormattedPayload = function () {
        return payload = {
            name: "",
            testCaseId: "",
            url: "",
            testCaseId: "",
            active: false
        }
    };
    
    initializeMainPayload = function() {
        return payloadModel = {
            bots : [],
            testCasePayload : {
                testCaseName: "",
                testCaseId: "",
                chats: {}
            },
            mode : "",
            botName : "",
            uid: "U1234",
            botId: "",
        };
    }
})();