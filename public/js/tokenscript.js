(function () {


$('#tokenSubmit').click(function () {
  var token = $('#bottoken').val();
  setAccessToken(token);
  var botName = $('#botNameId').val();
  $(".botName").html(botName);
});


$(".reset").click(function() {
  $(".chats").empty();
  initializeTestCasePayload();
});

$('#testCaseSubmit').click(function () {
  var testCase = $('#nameOfTestCase').val();
  setTestCaseName(testCase);
  saveTestCase();
});

$('.run').click(function () {
  setAccessToken("377422fb9dcb4abf98242fb14afa8311");
    readTestCase("Test");
});

})();
