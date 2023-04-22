const baseObject = require('../com/baseObject');
const { StatusCodes } = require('http-status-codes');
const resCodeConst = require('../com/enums/resCodeConst');

function baseManagerObject() {
    this.resultObj = {
        code : undefined,
        data : undefined
    }
}

baseManagerObject.prototype = new baseObject();
baseManagerObject.prototype.constructor = baseManagerObject;

baseManagerObject.prototype._init = function() {
    baseObject.prototype._init.call(this);

}

baseManagerObject.prototype._dispose = function() {
    delete this;
}

//Request Body JSON validate.
baseManagerObject.prototype._validateRouteJson = function(fn) {
    try {
        fn.use((err, req, res, next) => {
            if (err instanceof SyntaxError && 
                err.status === StatusCodes.BAD_REQUEST && 'body' in err) {
                var resultRes = {}
                resultRes = resCodeConst.getResultObj(resCodeConst.codeEnum.BAD_REQUEST);
                resultRes.ResData = 'Bad Request - Invalid JSON'

                res.status(StatusCodes.BAD_REQUEST).json(resultRes);
            }
            //next();
        })
    } catch(ex) {
        //Exception
        this._errorLog([`baseManagerObject [_validateRouteJson.exception]`, ex.message]);        
    }
}

module.exports = baseManagerObject;
