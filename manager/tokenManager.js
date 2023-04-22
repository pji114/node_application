const baseManagerObject = require('../com/baseManagerObject');
const resCodeConst = require('../com/enums/resCodeConst').codeEnum;
const jwt = require('jsonwebtoken');

let instance = undefined;

function tokenManager() {
    this.className = "tokenManager";      // ClassName 정보
    this.type = 'bearer'                  // 토큰타입(JWT 혹은 OAuth에 대한 토큰을 사용 : RFC 6750)
    this.tokenType = 'JWT'                // 토큰생성 타입
    this.tokenAlg = 'HS256'               // 해싱 알고리즘을 지정(Ex. 보통 HMAC SHA256 / RSA 사용)
    this.accessExpiresIn = '1h'           // 만료시간 (1시간 : 1h)
    this.refreshExpiresIn = '180d'        // 만료기간 (6개월 : 180d)
}

tokenManager.prototype = new baseManagerObject();
tokenManager.prototype.constructor = tokenManager;


tokenManager.prototype.initToken = function(){
    baseManagerObject.prototype.Init.call(this);
}

//Access 토큰 생성
tokenManager.prototype.jwtAccessToken = function(clientInfo){
    //clientInfo : ...
    accessToken = undefined;
    try {
        accessToken = jwt.sign({ 
                                    type : this.tokenType,
                                    algorithm : this.tokenAlg,
                                    client : clientInfo,
                                }, 
                                this.secretInfo.jwtAccessKey, 
                                {
                                    expiresIn : this.accessExpiresIn, 
                                    issuer : global.serviceName,
                                });
        this.resultObj.code = resCodeConst.SUCCESS;
        this.resultObj.data = accessToken;
    } catch(ex) {
        //Exception
        this.resultObj.code = resCodeConst.AUTHKEY_ISSUED;
        this.resultObj.data = ex.message;
        this._errorLog([`${this.className} [jwtAccessToken.exception]`, ex.message]);
    }
    return this.resultObj;
}

//Refresh 토큰 생성
tokenManager.prototype.jwtRefreshToken = function(csno){
    //Refresh생성 시 payload 없이 발급.
    refreshToken = undefined;
    try {
        refreshToken = jwt.sign({ 
                                    type : this.tokenType,
                                    algorithm : this.tokenAlg,
                                    client : csno,
                                }, 
                                this.secretInfo.jwtRefreshKey,
                                {
                                    expiresIn : this.refreshExpiresIn,
                                    issuer : global.serviceName,
                                });
        this.resultObj.code = resCodeConst.SUCCESS;
        this.resultObj.data = refreshToken;                                
    } catch(ex) {
        //Exception
        this.resultObj.code = resCodeConst.AUTHKEY_ISSUED;
        this.resultObj.data = ex.message;
        this._errorLog([`${this.className} [jwtRefreshToken.exception]`, ex.message]);
    }
    return this.resultObj;
}

//JWT토큰 검증
tokenManager.prototype.jwtVerify = function(token, secretKey){
    var result = undefined;
    try {
        result = jwt.verify(token, secretKey);
    
        this.resultObj.code = resCodeConst.SUCCESS;
        this.resultObj.data = result;
    } catch(ex) {
        //Exception        
        if (ex.message === 'jwt expired') {
            this.resultObj.code = resCodeConst.AUTHKEY_EXPIRATION;
            this.resultObj.data = `${ex.message} - Try issuing a token.`;
            this._errorLog([`${this.className} [jwtVerify.expired]`, this.resultObj.data]);
        } else if (ex.message === 'invalid token') {
            this.resultObj.code = resCodeConst.AUTHKEY_INVALID;
            this.resultObj.data = ex.message;
            this._errorLog([`${this.className} [jwtVerify.invalid]`, this.resultObj.data]);
        } else {
            this.resultObj.code = resCodeConst.AUTHKEY_ERROR;
            this.resultObj.data = ex.message;
            this._errorLog([`${this.className} [jwtVerify.exception]`, this.resultObj.data]);
        }
    }
    return this.resultObj;
}

instance = new tokenManager();
module.exports = instance;