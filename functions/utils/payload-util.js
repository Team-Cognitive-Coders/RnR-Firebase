getBotDetailsPayload = () => {
    return {
        name : "",
        token : "",
        type : ""
    };
}

getTestCaseDetailsPayload = () => {
    return {
        name : "",
        url : ""
    };
}

getMessagePayload = () => {
    return {
        token : "",
        query : "",
        sessionId : "",
        type : ""
    };
}

getResponseMessagePayload = () => {
    return {
        message : "",
        intent : "",
        query : ""
    };
}
module.exports = {getBotDetailsPayload, getTestCaseDetailsPayload, getMessagePayload,
    getResponseMessagePayload}