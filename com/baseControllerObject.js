const baseObject = require('../com/baseObject');
const { StatusCodes } = require('http-status-codes');
const resCodeConst = require('../com/enums/resCodeConst');

function baseControllerObject() {
    this.authToken = undefined;
    this.reqObject = undefined;
    this.resObject = {
        ResCode : undefined,
        ResMessage : undefined,
        ResData : undefined
    };
}

baseControllerObject.prototype = new baseObject();
baseControllerObject.prototype.constructor = baseControllerObject;

//initialize
baseControllerObject.prototype._init = function() {
    baseObject.prototype._init.call(this);
}

// dispose
baseControllerObject.prototype._dispose = function() {
    delete this;
}

// Reponse Error Defulte Code & Message return.
baseControllerObject.prototype._resCode = function(errCode, optionMsg) {
    var resultObj = resCodeConst.getResultObj(errCode, optionMsg); 
    return resultObj;
}

//Request Authorization(JWT Token) Check
baseControllerObject.prototype._validateToken = function(token, keyType) {
    try {
        this.authToken = undefined;        
        var returnObj = {
            code : undefined,
            data : undefined
        }
        
        //Authorization Parameter Check!
        if (token == undefined || token == '') {
            returnObj.code = resCodeConst.codeEnum.AUTHKEY_NODATA;
            returnObj.data = 'JWT Token is NO Data.';
            this._errorLog([`${this.className} [baseController._validateToken]`, `${returnObj.data}`]);
            return returnObj;
        }
        
        var parsingToken = token.split(' ');  //bearer +' '+ Token 분리
        
        //요청 Headers Authorization값 검증
        if (parsingToken.length > 2) {
            returnObj.code = resCodeConst.codeEnum.AUTHKEY_TYPE;
            returnObj.data = 'Headers Authorization length over.';
            this._errorLog([`${this.className} [baseController._validateToken]`, `${returnObj.data}`]);
            return returnObj;
        }        

        if (parsingToken[0] != 'bearer') {
            returnObj.code = resCodeConst.codeEnum.AUTHKEY_TYPE;
            returnObj.data = 'This is a token Type Error.';
            this._errorLog([`${this.className} [baseController._validateToken]`, `${returnObj.data}`]);
            return returnObj;
        }

        const tokenManager = require('../manager/tokenManager');
        returnObj = tokenManager.jwtVerify(parsingToken[1], keyType);

        //라우터단에서 검증된 토큰!
        if (returnObj.code == resCodeConst.codeEnum.SUCCESS) {
            this.authToken = parsingToken[1];
        }
        
    } catch(ex) {
        returnObj.code = resCodeConst.codeEnum.AUTHKEY_ERROR;
        this._errorLog([`${this.className} [baseController._validateToken]`, ex.message]);
    }
    return returnObj;
}

//요청 header/body 파서(헤더 및 토큰 검증)
baseControllerObject.prototype._requestParser = function(path, headers, body) {
    try {
        this.reqObject = {};
        this.reqObject.Headers = headers;
        this.reqObject.Body = body;
        
        this._infoLog([`====================[ ${this.className}${path} ] Start.====================`]);
        this._infoLog([`${this.className}${path} [REQ]`, `Headers: ${JSON.stringify(this.reqObject.Headers)}`]);
        this._infoLog([`${this.className}${path} [REQ]`, `Body: ${JSON.stringify(this.reqObject.Body)}`]);
    
        //요청헤더에 API-ID 확인 단계
        if (this.reqObject.Headers['api-id'] ==  undefined) {
            this.resObject = this._resCode(resCodeConst.codeEnum.BAD_REQUEST_HEADER);
            this.resObject.ResData = '[Headers] API-ID is missing parameters.'
            this._errorLog([`${this.className}${path} [baseController >>_requestParser]`, `${this.resObject.ResData} ${JSON.stringify(this.resObject.ResCode)}`]);
            return this.resObject;
        }

        //요청헤더에 API-ID 검증 단계
        if (this.reqObject.Headers['api-id'] !=  undefined) {
            var apiId = this.reqObject.Headers['api-id'];               //요청 헤더 API-ID 파싱
            //API-ID값 누락확인
            if (apiId == undefined || apiId == '') {
                this.resObject = this._resCode(resCodeConst.codeEnum.BAD_REQUEST_APIID_HEADER);
                this.resObject.ResData = '[Headers] API-ID NO Data.'
                this._errorLog([`${this.className}${path} [baseController >>_requestParser]`, `${this.resObject.ResData}`]);
                return this.resObject;
            }

            //API-ID값 검증
            if (global.serviceName != apiId) {
                this.resObject = this._resCode(resCodeConst.codeEnum.BAD_REQUEST_APIID_HEADER);
                this.resObject.ResData = '[Headers] API-ID Validation'
                this._errorLog([`${this.className}${path} [baseController >>_requestParser]`, `${this.resObject.ResData} ${JSON.stringify(this.resObject.ResCode)}.`]);
                return this.resObject;                
            }
            this._debugLog([`${this.className}${path} [baseController >>_requestParser]`, `[Headers] API-ID Validation ${JSON.stringify(this.resObject.ResCode)}.`]);
        }

        //요청헤더에 API-VERSION 파라미터 및 value 검증
        if (this.reqObject.Headers['api-version'] ==  undefined ||
            this.reqObject.Headers['api-version'] ==  '' ) {
            this.resObject = this._resCode(resCodeConst.codeEnum.BAD_REQUEST_HEADER);
            this.resObject.ResData = '[Headers] API-VERSION is missing in Headers or No Data.'
            this._errorLog([`${this.className}${path} [baseController >>_requestParser]`, `${this.resObject.ResData} ${JSON.stringify(this.resObject.ResCode)}.`]);
            return this.resObject;
        }
        
        //요청헤더에 API-VERSION와 서버 API-VERSION 검증
        if (this.reqObject.Headers['api-version'] != undefined) {
            if (this.reqObject.Headers['api-version'] != this.apiVersion){
                this.resObject = this._resCode(resCodeConst.codeEnum.BAD_REQUEST_HEADER);
                this.resObject.ResData = '[Headers] Invalid API-VERSION information.'
                this._errorLog([`${this.className}${path} [baseController >>_requestParser]`, `${this.resObject.ResData} ${JSON.stringify(this.resObject.ResCode)}.`]);                
                return this.resObject;
            } else {
                this._debugLog([`${this.className}${path} [baseController >>_requestParser]`, `[Headers] API-VERSION Validation ${JSON.stringify(this.resObject.ResCode)}.`]);
            }
        }

        //요청헤더에 JWT토큰 검증 단계
        var keyType = undefined;
        if (path == '/auth/get-refresh-token') keyType = this.secretInfo.jwtRefreshKey
        else keyType = this.secretInfo.jwtAccessKey

        //최초 access토큰을 발급을 제외하고 나머지 구간에서는 헤더에 authorization 및 토큰검증을 한다.
        if (path != '/auth/get-access-token' &&
            path != '/service-info') {
            var token = this.reqObject.Headers['authorization'];        //요청 헤더 JWT토큰
            var result = this._validateToken(token, keyType);           //토큰 검증
            //보안으로 인하여 JWT토큰정보 로그는 결과Code만 찍도록한다. 
            this._debugLog([`${this.className}${path} [baseController >>_requestParser]`, `[Headers] Token(JWT) Validation ${JSON.stringify(result.code)}.`]);
            
            this.resObject = this._resCode(result.code);
            this.resObject.ResData = result.data
            return this.resObject;
        } 

    } catch(ex) {
        this.resObject = this._resCode(resCodeConst.codeEnum.UNKNOWN_ERROR);
        this._errorLog([`${this.className}${path} [baseController._requestParser]`, ex.message]);
    }
    return this.resObject;
}

//응답 Data 파서?
baseControllerObject.prototype._responseParser = function(path, headers, body) {
    try {
        this._infoLog([`${this.className}${path} [RES]`, `Headers: ${JSON.stringify(headers)}`]);
        this._infoLog([`${this.className}${path} [RES]`, `Body: ${JSON.stringify(body)}`]);
        this._infoLog([`====================[ ${this.className}${path} ] End.  ====================`]);
    } catch(ex) {
        this._errorLog([`${this.className}${path} [baseController._responseParser]`, ex.message]);
    }
    return this.resObject;
}

//Request Body Check
baseControllerObject.prototype._sendResHeader = function(req) {
    var header = {
        "Accept" : "*/*",        
        "Content-Type" : "application/json"
    };
    return header;
}

baseControllerObject.prototype._sendResJson = function(req, res, resCode, resData) {
    var httpCode = StatusCodes.OK;
    try {
        var resHeaders = this._sendResHeader();

        if (resCode !=  undefined) {
            if (resCode != resCodeConst.codeEnum.SUCCESS) {
                httpCode = StatusCodes.NOT_FOUND;
            }

            if (resCode == resCodeConst.codeEnum.AUTHKEY_NODATA || 
                resCode == resCodeConst.codeEnum.AUTHKEY_EXPIRATION ||
                resCode == resCodeConst.codeEnum.AUTHKEY_INVALID ||
                resCode == resCodeConst.codeEnum.AUTHKEY_ISSUED ||
                resCode == resCodeConst.codeEnum.AUTHKEY_ERROR ) {
                httpCode = StatusCodes.UNAUTHORIZED;
            }

            if (resCode == resCodeConst.codeEnum.BAD_REQUEST || 
                resCode == resCodeConst.codeEnum.BAD_REQUEST_HEADER ||
                resCode == resCodeConst.codeEnum.BAD_REQUEST_BODY ) {
                httpCode = StatusCodes.BAD_REQUEST;
            }
        }

        this._responseParser(req.path, resHeaders, resData);
    } catch(ex) {
        resData = this._resCode(resCodeConst.codeEnum.UNKNOWN_ERROR);
        httpCode = StatusCodes.INTERNAL_SERVER_ERROR;        
        this._errorLog([`${this.className} [baseController._sendResJson]`, ex.message]);        
    } finally {
        //Return Send        
        res.status(httpCode)
           .header(resHeaders)
           .send(resData);
    }
}

module.exports = baseControllerObject;
