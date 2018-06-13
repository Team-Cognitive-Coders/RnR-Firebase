(function(){

    getBotsRequest = function(payload, fSuccessHandler, fFailHandler){
        $.ajax({
            url: "/getBots",
            data: payload,
            type: "GET",
            dataType: "json",
            success: fSuccessHandler,
            error: fFailHandler
        });
    }

    saveTestCaseRequest = function(payload, fSuccessHandler, fFailHandler){
        $.ajax({
            url: "/saveTestCase",
            data: payload,
            type: "POST",
            dataType: "json",
            success: fSuccessHandler,
            error: fFailHandler
        });
    }

    deleteTestCaseRequest = function(payload, fSuccessHandler, fFailHandler){
        var url = `/deleteTestCase?uid=${payload.uid}&botId=${payload.botId}&testCaseId=${payload.testCaseId}`;
        $.ajax({
            url: url,
            data: payload,
            type: "DELETE",
            dataType: "json",
            success: fSuccessHandler,
            error: fFailHandler
        });
    }

    deleteBotRequest = function(payload, fSuccessHandler, fFailHandler){
        var url = `/deleteBot?uid=${payload.uid}&botId=${payload.botId}`;
        $.ajax({
            url: url,
            data: payload,
            type: "DELETE",
            dataType: "json",
            success: fSuccessHandler,
            error: fFailHandler
        });
    }

    getTestCaseRequest = function(payload, fSuccessHandler, fFailHandler){
        $.ajax({
            url: "/getTestCase",
            type: "GET",
            data: payload,
            dataType: "json",
            success: fSuccessHandler,
            error:fFailHandler
        });
    }

    saveBotRequest = function(payload, fSuccessHandler, fFailHandler){
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/saveBot",
            data: payload,
            error: fFailHandler,
            success: fSuccessHandler 
          });
    }
})();