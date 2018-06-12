(function () {

    var client, payloadModel;
    payloadModel = initializeMainPayload();
    fetchAllBots();

    function fetchAllBots() {
        $.ajax({
            url: "/getBots",
            data: { uid: payloadModel.uid },
            type: "GET",
            dataType: "json",
            success: function (response) {
                formatAllBots(response);
                addAllBots();
            },
            error: function (response) {

            }
        });
    }

    addAllBots = function () {
        var tHtml = Handlebars.templates.botlist(payloadModel);
        $('#allBots').html(tHtml);
        var t1Html = Handlebars.templates.headerbuttons(payloadModel);
        $('#headerButtons').html(t1Html);
        var t2Html = Handlebars.templates.input(payloadModel);
        $('#input').html(t2Html);
    };

    setActiveBot = function (botId, no) {
        jQuery.each(payloadModel.bots, function (index, obj) {
            if (obj.botId == botId) {
                obj.active = true;
                payloadModel.botName = obj.name;
                payloadModel.botId = obj.botId
                setAccessToken(obj.token);
            }
            else {
                obj.active = false;
            }
        });
        addAllBots();
    }

    setActiveTestCase = function (testCaseId, botId) {
        jQuery.each(payloadModel.bots, function (index, obj) {
            if (obj.botId == botId) {
                jQuery.each(obj.testCases, function (index, obj1) {
                    if(obj1.testCaseId == testCaseId){
                        obj1.active = true;
                        payloadModel.testCasePayload.testCaseName = obj1.name;
                    }
                    else{
                        obj1.active = false;
                    }
                });
            }
        });
    }

    setTestCaseName = function (testCaseName) {
        payloadModel.testCasePayload.testCaseName = testCaseName;
    }

    setAccessToken = function (token) {
        client = new ApiAi.ApiAiClient({ accessToken: token });
    }

    saveTestCase = function () {
        var payload = getSaveTestCasePayload();
        payload.chats = payloadModel.testCasePayload.chats;
        payload.testCaseName = payloadModel.testCasePayload.testCaseName,
        payload.botId = payloadModel.botId,
        $.ajax({
            url: "/saveTestCase",
            data: payload,
            type: "POST",
            dataType: "json",
            success: function (response) {
                debugger;
            },
            error: function (response) {

            }
        });
    }

    //setAccessToken("377422fb9dcb4abf98242fb14afa8311");

    sendUserMessage = function(message) {
        client.textRequest(message).then(function (response) {
            var result;
            try {
                result = response.result.fulfillment.speech
            } catch (error) {
                result = "";
            }
            addBotMessageToUI(result);
            addBotMessageToPayload(result);
        }).catch(function () {

        });
    }

    formatAllBots = function (response) {
        jQuery.each(response, function (index, obj) {
            var botPayload = getAllBotsFormattedPayload();
            botPayload.name = obj.botDetails.name;
            botPayload.token = obj.botDetails.token;
            botPayload.type = obj.botDetails.type;
            botPayload.botId = index;
            jQuery.each(obj.testCase, function (index2, obj2) {
                var testCasePayload = getTestCaseFormattedPayload();
                testCasePayload.name = obj2.name;
                testCasePayload.testCaseId = obj2.testCaseId;
                testCasePayload.url = obj2.url;
                botPayload.testCases.push(testCasePayload);
            });
            payloadModel.bots.push(botPayload);
        });
    }
    addBotToPayload = function (payload) {
        payloadModel.bots.push(payload);
    }

    addUserMessageToPayload = function(message) {
        payloadModel.testCasePayload.chats[new Date().getTime() + "_USER"] = message;
    }
    addBotMessageToPayload = function(message) {
        payloadModel.testCasePayload.chats[new Date().getTime() + "_BOT"] = message;
    }

    //======ReRun Test Case========Need to be modified
    reRunTestCase = function() {
        clearMessagesFromUI();
        var tempTestCasePayload = jQuery.extend({}, payloadModel.testCasePayload).chats;
        sendMessageTemp(tempTestCasePayload, Object.keys(tempTestCasePayload)[0]);
    }

    onSelectBot = function (botId) {
        payloadModel.botId = botId;
        payloadModel.mode = "BOT";
        clearMessagesFromUI()
        clearTestCasePayload();
        setActiveBot(botId);
    }

    onSelectTestCase = function (testCaseId, botId, url) {
        payloadModel.testCasePayload.testCaseId = testCaseId;
        payloadModel.mode = "TESTCASE";
        clearMessagesFromUI();
        clearTestCasePayload();
        setActiveTestCase(testCaseId, botId);
        setActiveBot(botId);
        fetchTestCase(testCaseId);
    }

    onAddTestCaseSelect = function(){
        payloadModel.mode = "SAVE";
        addAllBots();
    }
    
    clearTestCasePayload = function(){
        payloadModel.testCasePayload.testCaseName = "";
        payloadModel.testCasePayload.testCaseId = "";
        payloadModel.testCasePayload.chats = {};
    }
    fetchTestCase = function (testCaseId1) {
        $.ajax({
            url: "/getTestCase",
            type: "GET",
            data: { testCaseId: testCaseId1 },
            dataType: "json",
            success: function (response) {
                if (response) {
                    populateTestCases(response);
                }
            },
            error: function (response) {

            }
        });
    }

    populateTestCases = function (result) {
        jQuery.each(result, function (index, obj) {
            if (index.indexOf("BOT") > -1){
                addBotMessageToUI(obj);
                addBotMessageToPayload(obj);
            }
            else{
                addUserMessageToUI(obj);
                addUserMessageToPayload(obj);
            }
        });
    }

    function sendMessageTemp(payload, key) {
        addUserMessageToUI(payload[key]);
        client.textRequest(payload[key]).then(function (response) {
            var result;
            try {
                result = response.result.fulfillment.speech
            } catch (error) {
                result = "";
            }
            addBotMessageToUI(result);
            if (payload[Object.keys(payload)[0]] != result) {
                alert("Error: Expected - " + payload[Object.keys(payload)[0]]);
            }
            else {
                delete payload[Object.keys(payload)[0]];
                if (payload[Object.keys(payload)[0]])
                    sendMessageTemp(payload, Object.keys(payload)[0]);
                else
                    alert("Success");
            }
        }).catch(function () {

        });
        delete payload[key];
    }

})();
