const baseManagerObject = require('../com/baseManagerObject');
const mysql = require('mysql');

let instance = undefined;

function dbManager() {
    this.className = "dbManager";         //ClassName 정보
    this.dbConnPool = undefined;
}

dbManager.prototype = new baseManagerObject();
dbManager.prototype.constructor = dbManager;

/*
dbManager.prototype.initDB = function() {
    baseManagerObject.prototype._init.call(this);
    this.connectDB();
}
*/

dbManager.prototype.returnRows = function(rows) {
    let rstObj = []
    if (!rows) {
        return rstObj
    }

    delete rows.meta
    rstObj = rows
/*
    var tempAdd = {RegDate: StringUtil.NowDate('yyyymmddHHMMss')}
    for(var i in rstObj){
        Object.assign(rstObj[i], tempAdd)
    }
*/

    return rstObj
}

dbManager.prototype.disposeDB = function() {
    if (this.dbConnPool.Connection != undefined) {
        this.dbConnPool.Connection.release();
        this.dbConnPool.Connection = undefined;
    }
}

dbManager.prototype.getDB = async function() {
    try {
        await this.dbConnPool.getConnection((err, conn) => { 
            if(err) throw err;
            this.dbConnPool.Connection = conn
            conn.release();
        });

        //this.dbConnPool.Connection = { test : "test" };

        //this.dbConnPool.query(`USE ${this.dbInfo.database}`);
/*
        await this.dbConnPool.getConnection((err, conn) => { 
            // Connection 연결
            if(err) throw err;
            //let sql = `USE ${this.dbInfo.database}`;
            let sql = 'select name from temp where 1=1';
            conn.query(sql, (err, result, fields)=>{ // Query문 전송
                if(err) { 
                    console.log('Connection Pool GET Error / ' + err);
                } else {
                    if (result.length === 0) {
                        console.log('DB Response Not Found');
                    } else {
                        console.log(result);
                        result;
                    }
                }
            });
            conn.release(); // Connectino Pool 반환
        });
*/        
    } catch(ex) {
        throw ex;
    }
}

dbManager.prototype.connectDB = async function() {
    if (this.dbConnPool == undefined) {
        this.dbInfo.password = this._decrypt(this.dbInfo.password);
        this.dbInfo.database = this._decrypt(this.dbInfo.database);
        this.dbConnPool = mysql.createPool(this.dbInfo);
    }
    await this.getDB();
    return this.dbConnPool;
}

instance = new dbManager();
instance.connectDB();

module.exports = instance;