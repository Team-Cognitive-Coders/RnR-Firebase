(function () {

    var testCasePayload, client;
    initializeTestCasePayload = function(){
        testCasePayload = {
            testCaseName : "",
            chats : {}
        }
    }
    setTestCaseName= function(testCaseName){
        testCasePayload.testCaseName = testCaseName;
    }

    setAccessToken = function(token){
        client = new ApiAi.ApiAiClient({accessToken: token});
    }

    saveTestCase = function(){
        $.ajax({
            url : "/saveTestCase",
            data : testCasePayload,
            type : "POST",
            dataType : "json",
            success : function(response){
                debugger;
            },
            error : function(response){

            }
        });
    }
    readTestCase = function(testCaseName){
        testCasePayload.testCaseName = testCaseName;
        $.ajax({
            url : "/readTestCase",
            data : testCasePayload,
            type : "GET",
            dataType : "json",
            success : function(response){
                if(response){
                    testCasePayload.chats = response;
                    reRunTestCase();
                }
            },
            error : function(response){

            }
        });
    }

    initializeTestCasePayload();
    //setAccessToken("377422fb9dcb4abf98242fb14afa8311");
    $(".messages").animate({ scrollTop: $(document).height() }, "fast");

    function newMessage() {
        message = $(".message-input input").val();
        if ($.trim(message) == '') {
            return false;
        }
        addUserMessageToUI(message);
        addUserMessageToPayload(message);
        sendUserMessage(message);
    };
    function sendUserMessage(message){
        client.textRequest(message).then(function(response){
            var result;
            try {
                result = response.result.fulfillment.speech
            } catch(error) {
                result = "";
            }
            addBotMessageToUI(result);
            addBotMessageToPayload(result);
        }).catch(function(){

        });
    }
    $('.submit').click(function () {
        newMessage();
    });


    $(window).on('keydown', function (e) {
        if (e.which == 13) {
            newMessage();
            return false;
        }
    });
    function addUserMessageToPayload(message){
        testCasePayload.chats[new Date().getTime()+"_USER"] = message;
    }
    function addBotMessageToPayload(message){
        testCasePayload.chats[new Date().getTime()+"_BOT"] = message;
    }
    function addUserMessageToUI(message){
        $('<li class="replies"><img src="./images/profile.jpg" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
        $('.message-input input').val(null);
        $('.contact.active .preview').html('<span>You: </span>' + message);
        $(".messages").animate({ scrollTop: $(document).height() }, "fast");
    };
    function addBotMessageToUI(message){
        $('<li class="sent"><img src="./images/bot.png" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
        $('.message-input input').val(null);
        $('.contact.active .preview').html('<span>'+ $('#botNameId').val() + ':</span>' + message);
        $(".messages").animate({ scrollTop: $(document).height() }, "fast");
    };
    //======ReRun Test Case========Need to be modified
    function reRunTestCase(){
        var tempTestCasePayload = jQuery.extend({}, testCasePayload).chats;
        sendMessageTemp(tempTestCasePayload, Object.keys(tempTestCasePayload)[0]);
    }
    function sendMessageTemp(payload, key){
        addUserMessageToUI(payload[key]);
        client.textRequest(payload[key]).then(function(response){
            var result;
            try {
                result = response.result.fulfillment.speech
            } catch(error) {
                result = "";
            }
            addBotMessageToUI(result);
            if(payload[Object.keys(payload)[0]] != result){
                alert("Error: Expected - "+payload[Object.keys(payload)[0]]);
            }
            else{
                delete payload[Object.keys(payload)[0]];
                if(payload[Object.keys(payload)[0]])
                    sendMessageTemp(payload, Object.keys(payload)[0]);
                else
                    alert("Success");
            }
        }).catch(function(){

        });
        delete payload[key];
    }

})();
