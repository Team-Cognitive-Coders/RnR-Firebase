(function () {


$('#tokenSubmit').click(function () {
  var payload = getSaveBotPayload();
  payload.token = $('#bottoken').val();
  payload.name = $('#botName').val();
  payload.type = "API";
  setAccessToken(payload.token);
  $.ajax({
      type: "POST",
      dataType: "json",
      url: "/saveBot",
      data: payload,
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert("error")
      },
      success: function (data) {
        var payload = getAllBotsFormattedPayload();
        payload.name = data.name;
        payload.token = data.token;
        payload.type = data.type;
        payload.botId = data.botId;
        addBotToPayload(payload);
        addAllBots();
      }
    });

});


$('#testCaseSubmit').click(function () {
  var testCase = $('#nameOfTestCase').val();
  setTestCaseName(testCase);
  saveTestCase();
});

})();
