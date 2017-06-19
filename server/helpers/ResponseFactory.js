
class ResponseFactory {

    makeResponse(responseSend){
        let response = {};
        response.errorCode = responseSend.errorCode;
        response.errorDescription = responseSend.errorDescription;
        
        return response;
    }
}

export default ResponseFactory