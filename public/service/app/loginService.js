
const baseServiceObject = require('../../../com/baseServiceObject');
const resCodeConst = require('../../../com/enums/resCodeConst').codeEnum;
//const dbManager = require('../../../manager/dbManager');
//const temp_query = require('../../mapper/query');

function loginService() {
    this.className = "loginService";             //수행 Class명

}

loginService.prototype = new baseServiceObject();
loginService.prototype.constructor = loginService;
/*
test.prototype.selectRows = async function(params) {
    var result = undefined;
    try{
        console.log(`2`);
        var temp = temp_query.SELECT_TEMP();
        //dbManager.
        console.log(dbManager.dbConnPool.query(temp))
        //var rows = await this.dbConnPool.query(temp);
        //console.log(rows);
        console.log(`3`);
    } catch(ex) {

    }
    return result;
}
*/

//Service 실행
loginService.prototype.execute = async function(data) { 
    baseServiceObject.prototype._init.call(this);

    this.paramCheck = [ 'Name', 'UserEmail'];  //필수 체크 파라미터
    try {
        this.resultObj.code = resCodeConst.SUCCESS;
        
        //필수 파라미터 Key Check!
        var validateData = this._validateData(data);
        if (!validateData.variable) {
            this.resultObj.code = resCodeConst.BAD_REQUEST_BODY;
            this.resultObj.data = validateData.param;
            this._debugLog([`${this.className} [execute]`, validateData.param]);
            return this.resultObj;
        }
        
        //TODO: 로직...

        //TODO: 반환 객체가 있을 시 로직...
        this.resultObj.data = {
            test : "테스트입니다."
        };

    } catch(ex) {
        this.resultObj.code = resCodeConst.UNKNOWN_ERROR;
        this.resultObj.data = ex.message;
        this._errorLog([`${this.className} [execute]`, this.resultObj.data]);
    }
    return this.resultObj;
}

module.exports = new loginService;
