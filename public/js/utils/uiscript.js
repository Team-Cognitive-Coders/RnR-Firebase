(function () {
    addUserMessageToUI = function (message) {
        $('<li class="replies"><img src="./images/profile.jpg" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
        $('.message-input input').val(null);
        $('.contact.active .preview').html('<span>You: </span>' + message);
        $(".messages").animate({ scrollTop: $(document).height() }, "fast");
    };
    addBotMessageToUI = function (message) {
        $('<li class="sent"><img src="./images/bot.png" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
        $('.message-input input').val(null);
        $('.contact.active .preview').html('<span>' + $('#botNameId').val() + ':</span>' + message);
        $(".messages").animate({ scrollTop: $(document).height() }, "fast");
    };

    $(window).on('keydown', function (e) {
        if (e.which == 13) {
            newMessage();
            return false;
        }
    });

    //Add message
    $('.submit').click(function () {
        newMessage();
    });
    
    function newMessage() {
        message = $(".message-input input").val();
        if ($.trim(message) == '') {
            return false;
        }
        addUserMessageToUI(message);
        addUserMessageToPayload(message);
        sendUserMessage(message);
    }

    $(".messages").animate({ scrollTop: $(document).height() }, "fast");

    //Header buttons
    $('.add').click(function () {
        payloadModel.mode = "SAVE";
        addAllBots();
    });

    $('.add').on('click', function () {
        payloadModel.mode = "SAVE";
        addAllBots();
    });

    $('.runAll').click(function () {

    });

    $('.run').click(function () {

    });

    $('.delete').click(function () {

    });

    $('.save').click(function () {

    });

    $('.reset').click(function () {
        clearMessagesFromUI();
    });

    clearMessagesFromUI = function () {
        $(".chats").empty();
    }

})();