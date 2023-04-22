const LangResource = require('../../resource/errorMessage.json');

const resCodeConst = {
    SUCCESS                                    : "0000", 
    AUTHKEY_NODATA                             : "1000",
    AUTHKEY_EXPIRATION                         : "1001",
    AUTHKEY_INVALID                            : "1002",
    AUTHKEY_ISSUED                             : "1003",
    AUTHKEY_TYPE                               : "1004",
    AUTHKEY_ERROR                              : "1009",

    BAD_REQUEST                                : "3000",
    BAD_REQUEST_HEADER                         : "3001",
    BAD_REQUEST_BODY                           : "3002",
    BAD_REQUEST_APIID_HEADER                   : "3003",
    BAD_REQUEST_PARAM_BODY                     : "3004",

    BAD_REQUEST_EMAIL                          : "3010",
    BAD_REQUEST_PHONENUMBER                    : "3011",
    BAD_REQUEST_DATE                           : "3012",    

    UNKNOWN_ERROR                              : "9999",
    UNDEFINDED_ERROR                           : "-9999"
};

module.exports = {
    codeEnum : resCodeConst,
    getResultObj : (code, optionMsg) => {
        var varResObj = { ResCode : code };

        if (optionMsg == undefined) {
            switch(code){
                case resCodeConst.SUCCESS :
                    varResObj.ResMessage = LangResource[code];
                    break;
                default :
                    varResObj.ResMessage = LangResource[code];
                    break;        
            }
        } else {
            varResObj.ResMessage = optionMsg != undefined ? optionMsg : LangResource[resCodeConst.UNKNOWN_ERROR];
        }

        return varResObj;
    }
}