const config = require('../conf/config.json');
const cryptoJs = require('crypto-js')
let logManager = require("../manager/logManager");

function baseObject() {
    this.nodeENV = config.nodeENV;                                    // 환경정보
    this.profileActive = config.profileActive.trim().toLowerCase();;  // Active Server Profile
    this.apiVersion = config.apiVersion;                              // API Version    
    this.mainPath = config.mainPath;                                  // API main Root Pah
    this.timeOut = config.timeOut;                                    // 타임아웃 설정(단위: ms)
    this.secretInfo = config.secretInfo;                              // secret정보    
    this.serverInfo = config[this.nodeENV].serverInfo;                // Server정보
    this.dbInfo = config[this.nodeENV].databaseInfo;                  // DB정보
    this.logSeparator = " => ";
}

baseObject.prototype = new baseObject();
baseObject.prototype.constructor = baseObject;

//initialize
baseObject.prototype._init = function() {
    //baseObject.call(this);
}

// dispose
baseObject.prototype._dispose = function() {
    delete this;
}

// Base64 encoded
baseObject.prototype._enBase64 = function(data) {
    let encodedWord = cryptoJs.enc.Utf8.parse(data);           // encodedWord Array object
    let encoded = cryptoJs.enc.Base64.stringify(encodedWord);  // string
    return encoded;
}

// Base64 decoded
baseObject.prototype._deBase64 = function(data) {
    let encodedWord = cryptoJs.enc.Base64.parse(data);          // encodedWord via Base64.parse()
    let decoded = cryptoJs.enc.Utf8.stringify(encodedWord);     // decode encodedWord via Utf8.stringify()
    return decoded;
}

// SHA256 단방향
baseObject.prototype._sha256 = function(data) {
    return cryptoJs.SHA256(data).toString();
}

// SHA512 단방향
baseObject.prototype._sha512 = function(data) {
    return cryptoJs.SHA512(data).toString();
}

// AES encrypt 양방향
baseObject.prototype._encrypt = function(data) {
    return cryptoJs.AES.encrypt(data, this.secretInfo.cryptoKey).toString();
}

// AES decrypt 양방향
baseObject.prototype._decrypt = function(data) {
    return cryptoJs.AES.decrypt(data, this.secretInfo.cryptoKey).toString(cryptoJs.enc.Utf8);
}

// Error-Log
baseObject.prototype._errorLog = function(messageInfos){
    logManager.error(this._getLogMessage(messageInfos));
}

// Debug-Log
baseObject.prototype._debugLog = function(messageInfos){
    logManager.debug(this._getLogMessage(messageInfos));
}

// Info-Log
baseObject.prototype._infoLog = function(messageInfos){
    logManager.info(this._getLogMessage(messageInfos));
}

// Warn-Log
baseObject.prototype._warnLog = function(messageInfos){
    logManager.warn(this._getLogMessage(messageInfos));
}

baseObject.prototype._getLogMessage = function(messageInfos){
    var result = undefined;

    try{
        if(Array.isArray(messageInfos)) {
            result = messageInfos.join(this.logSeparator);
        } else {
            result = messageInfos.toString();
        }
    }catch(ex){
        this._errorLog([`baseObject [base._getLogMessage]`, ex.message])
    }
    return result;
}

module.exports = baseObject;
