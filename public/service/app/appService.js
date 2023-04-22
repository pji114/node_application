const baseServiceObject = require('../../../com/baseServiceObject');
const resCodeConst = require('../../../com/enums/resCodeConst').codeEnum;
const stringUtil  = require('../../../com/utils/stringUtil');

function appService() {
    this.className = "appService";               //수행 Class명

}

appService.prototype = new baseServiceObject();
appService.prototype.constructor = appService;

//Service 실행
appService.prototype.execute = async function(data) { 
    baseServiceObject.prototype._init.call(this);
    
    this.paramCheck = [];  //필수 체크 파라미터

    try {
        this.resultObj.code = resCodeConst.SUCCESS;
        
        //필수 파라미터 Key Check!
        var validateData = this._validateData(data);
        if (!validateData.variable) {
            this.resultObj.code = resCodeConst.BAD_REQUEST_BODY;
            this.resultObj.data = validateData.param;
            this._debugLog([`${this.className} >>execute`, validateData.param]);
            return this.resultObj;
        }
        
        this.resultObj.data = {
            ServiceTime : stringUtil.nowDate(),
            ServiceVersion : '1.0.0'
        }

    } catch(ex) {
        this.resultObj.code = resCodeConst.UNKNOWN_ERROR;
        this.resultObj.data = ex.message;
        this._errorLog([`${this.className}.execute`, this.resultObj.data]);
    }
    return this.resultObj;
    
}

module.exports = new appService;
