const baseObject = require('../com/baseObject');

function baseServiceObject() {
    this.paramCheck = [];  //필수 체크 파라미터
    this.resultObj = {
        code : undefined,
        data : undefined
    }
}

baseServiceObject.prototype = new baseObject();
baseServiceObject.prototype.constructor = baseServiceObject;

baseServiceObject.prototype._init = function() {
    baseObject.prototype._init.call(this);
}

baseServiceObject.prototype._dispose = function() {
    delete this;
}

//Request Body Parameters Check
baseServiceObject.prototype._validateData = function(data){
    try {    
        var result = {
            variable : true,
            param : undefined
        }

        if (this.paramCheck.length > 0) {
            for (var iparam of this.paramCheck) {
                if (data[iparam] == undefined) {
                    result.variable = false;
                    result.param  = `${iparam} is missing parameters.`;
                }
            }
        }
    } catch(ex) {
        result.variable = false;
        result.param = ex.message;
        this._errorLog([`${this.className} [baseService._validReqBody]`, result.param]);
    } 
    return result;
}

module.exports = baseServiceObject;
